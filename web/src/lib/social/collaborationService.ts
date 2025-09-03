/**
 * Collaboration Service
 * Phase 8: Social Collaboration & Family Features
 *
 * Handles family member management, document sharing, permissions,
 * collaboration workflows, and family group management.
 */

import { supabase } from '@/integrations/supabase/client';
import { captureError } from '@/lib/monitoring/sentry';

export interface FamilyMember {
  id: string;
  user_id: string;
  family_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: FamilyRole;
  status: MemberStatus;
  permissions: FamilyPermissions;
  invited_at: string;
  joined_at?: string;
  last_active?: string;
  emergency_contact: boolean;
  relationship?: string;
  phone_number?: string;
  bio?: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  settings: FamilySettings;
  invite_code?: string;
  avatar_url?: string;
}

export interface DocumentShare {
  id: string;
  document_id: string;
  shared_by: string;
  shared_with: string;
  family_id?: string;
  permissions: SharePermissions;
  expires_at?: string;
  created_at: string;
  message?: string;
  viewed_at?: string;
  status: ShareStatus;
}

export interface CollaborationActivity {
  id: string;
  type: ActivityType;
  user_id: string;
  family_id: string;
  target_id: string;
  target_type: 'document' | 'member' | 'family';
  message: string;
  metadata: Record<string, any>;
  created_at: string;
  read_by: string[];
}

export type FamilyRole = 'owner' | 'admin' | 'member' | 'guardian' | 'beneficiary';
export type MemberStatus = 'invited' | 'active' | 'suspended' | 'left';
export type ShareStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';
export type ActivityType =
  | 'member_invited'
  | 'member_joined'
  | 'member_left'
  | 'document_shared'
  | 'document_accessed'
  | 'emergency_activated'
  | 'backup_created'
  | 'settings_changed'
  | 'role_changed';

export interface FamilyPermissions {
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canShareDocuments: boolean;
  canManageMembers: boolean;
  canAccessEmergency: boolean;
  canViewAnalytics: boolean;
  canModifySettings: boolean;
  canDeleteDocuments: boolean;
  documentCategories: string[];
}

export interface SharePermissions {
  canView: boolean;
  canDownload: boolean;
  canComment: boolean;
  canEdit: boolean;
  canReshare: boolean;
  expiresAt?: string;
  accessLimit?: number;
}

export interface FamilySettings {
  requireApproval: boolean;
  allowPublicInvites: boolean;
  emergencyAccess: boolean;
  activityNotifications: boolean;
  shareNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  defaultPermissions: FamilyPermissions;
  inviteExpiration: number; // hours
}

export interface FamilyInvite {
  id: string;
  family_id: string;
  invited_by: string;
  email: string;
  role: FamilyRole;
  permissions: FamilyPermissions;
  expires_at: string;
  created_at: string;
  message?: string;
  token: string;
}

export class CollaborationService {
  private static instance: CollaborationService;
  private currentFamilyId: string | null = null;
  private activityListeners: Array<(activity: CollaborationActivity) => void> = [];

  static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  /**
   * Initialize collaboration service
   */
  async initialize(userId: string): Promise<void> {
    try {
      // Get user's family groups
      const families = await this.getUserFamilies(userId);

      if (families.length > 0) {
        this.currentFamilyId = families[0].id;
      }

      // Setup real-time subscriptions
      this.setupRealtimeSubscriptions();

      console.log('Collaboration service initialized');
    } catch (error) {
      console.error('Collaboration service initialization failed:', error);
      captureError(error instanceof Error ? error : new Error(String(error)), {
        tags: { source: 'collaboration_service_init' }
      });
    }
  }

  /**
   * Create a new family group
   */
  async createFamily(data: {
    name: string;
    description?: string;
    settings?: Partial<FamilySettings>;
  }): Promise<FamilyGroup> {
    try {
      const defaultSettings: FamilySettings = {
        requireApproval: false,
        allowPublicInvites: false,
        emergencyAccess: true,
        activityNotifications: true,
        shareNotifications: true,
        autoBackup: true,
        backupFrequency: 'weekly',
        inviteExpiration: 168, // 7 days
        defaultPermissions: {
          canViewDocuments: true,
          canUploadDocuments: true,
          canShareDocuments: true,
          canManageMembers: false,
          canAccessEmergency: false,
          canViewAnalytics: false,
          canModifySettings: false,
          canDeleteDocuments: false,
          documentCategories: ['personal', 'financial', 'medical', 'legal']
        }
      };

      const familyData = {
        name: data.name,
        description: data.description,
        settings: { ...defaultSettings, ...data.settings },
        member_count: 1,
        invite_code: this.generateInviteCode()
      };

      const { data: family, error } = await supabase
        .from('families')
        .insert(familyData)
        .select()
        .single();

      if (error) throw error;

      // Add creator as owner
      await this.addFamilyMember(family.id, {
        role: 'owner',
        permissions: this.getFullPermissions(),
        emergency_contact: true
      });

      this.currentFamilyId = family.id;

      // Log activity
      await this.logActivity({
        type: 'settings_changed',
        family_id: family.id,
        target_id: family.id,
        target_type: 'family',
        message: 'Family group created',
        metadata: { action: 'create', name: family.name }
      });

      return family;
    } catch (error) {
      console.error('Failed to create family:', error);
      throw error;
    }
  }

  /**
   * Get user's family groups
   */
  async getUserFamilies(userId: string): Promise<FamilyGroup[]> {
    try {
      const { data: memberships, error } = await supabase
        .from('family_members')
        .select(`
          family_id,
          role,
          status,
          families (
            id,
            name,
            description,
            owner_id,
            created_at,
            updated_at,
            member_count,
            settings,
            invite_code,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      return memberships?.map(m => m.families as FamilyGroup) || [];
    } catch (error) {
      console.error('Failed to get user families:', error);
      return [];
    }
  }

  /**
   * Get family members
   */
  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    try {
      const { data: members, error } = await supabase
        .from('family_members')
        .select(`
          *,
          users (
            email,
            name,
            avatar_url
          )
        `)
        .eq('family_id', familyId)
        .order('joined_at', { ascending: true });

      if (error) throw error;

      return members?.map(member => ({
        ...member,
        email: member.users?.email || '',
        name: member.users?.name || '',
        avatar_url: member.users?.avatar_url
      })) || [];
    } catch (error) {
      console.error('Failed to get family members:', error);
      return [];
    }
  }

  /**
   * Invite family member
   */
  async inviteFamilyMember(data: {
    familyId: string;
    email: string;
    role: FamilyRole;
    permissions?: Partial<FamilyPermissions>;
    message?: string;
    relationship?: string;
  }): Promise<FamilyInvite> {
    try {
      const family = await this.getFamily(data.familyId);
      if (!family) throw new Error('Family not found');

      // Check if user is already a member
      const existingMember = await this.findMemberByEmail(data.familyId, data.email);
      if (existingMember) {
        throw new Error('User is already a family member');
      }

      const defaultPermissions = family.settings.defaultPermissions;
      const inviteData: Omit<FamilyInvite, 'id'> = {
        family_id: data.familyId,
        invited_by: (await supabase.auth.getUser()).data.user?.id || '',
        email: data.email,
        role: data.role,
        permissions: { ...defaultPermissions, ...data.permissions },
        expires_at: new Date(Date.now() + family.settings.inviteExpiration * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        message: data.message,
        token: this.generateInviteToken()
      };

      const { data: invite, error } = await supabase
        .from('family_invites')
        .insert(inviteData)
        .select()
        .single();

      if (error) throw error;

      // Send invitation email (implement email service)
      await this.sendInvitationEmail(invite, family);

      // Log activity
      await this.logActivity({
        type: 'member_invited',
        family_id: data.familyId,
        target_id: invite.id,
        target_type: 'member',
        message: `Invited ${data.email} as ${data.role}`,
        metadata: {
          email: data.email,
          role: data.role,
          relationship: data.relationship
        }
      });

      return invite;
    } catch (error) {
      console.error('Failed to invite family member:', error);
      throw error;
    }
  }

  /**
   * Accept family invitation
   */
  async acceptInvitation(token: string): Promise<FamilyMember> {
    try {
      // Get invitation
      const { data: invite, error: inviteError } = await supabase
        .from('family_invites')
        .select('*')
        .eq('token', token)
        .single();

      if (inviteError || !invite) {
        throw new Error('Invalid or expired invitation');
      }

      // Check expiration
      if (new Date(invite.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Create family member
      const memberData: Omit<FamilyMember, 'id' | 'email' | 'name' | 'avatar_url'> = {
        user_id: userId,
        family_id: invite.family_id,
        role: invite.role,
        permissions: invite.permissions,
        status: 'active',
        invited_at: invite.created_at,
        joined_at: new Date().toISOString(),
        emergency_contact: false
      };

      const { data: member, error: memberError } = await supabase
        .from('family_members')
        .insert(memberData)
        .select(`
          *,
          users (
            email,
            name,
            avatar_url
          )
        `)
        .single();

      if (memberError) throw memberError;

      // Delete used invitation
      await supabase
        .from('family_invites')
        .delete()
        .eq('id', invite.id);

      // Update family member count
      await this.updateFamilyMemberCount(invite.family_id);

      // Log activity
      await this.logActivity({
        type: 'member_joined',
        family_id: invite.family_id,
        target_id: member.id,
        target_type: 'member',
        message: `${member.users?.name || member.users?.email} joined the family`,
        metadata: { role: member.role }
      });

      return {
        ...member,
        email: member.users?.email || '',
        name: member.users?.name || '',
        avatar_url: member.users?.avatar_url
      };
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      throw error;
    }
  }

  /**
   * Share document with family members
   */
  async shareDocument(data: {
    documentId: string;
    recipients: string[]; // member IDs
    permissions: SharePermissions;
    message?: string;
    expiresAt?: string;
  }): Promise<DocumentShare[]> {
    try {
      const shares: DocumentShare[] = [];
      const userId = (await supabase.auth.getUser()).data.user?.id;

      for (const recipientId of data.recipients) {
        const shareData = {
          document_id: data.documentId,
          shared_by: userId,
          shared_with: recipientId,
          family_id: this.currentFamilyId,
          permissions: data.permissions,
          expires_at: data.expiresAt,
          message: data.message,
          status: 'pending' as ShareStatus,
          created_at: new Date().toISOString()
        };

        const { data: share, error } = await supabase
          .from('document_shares')
          .insert(shareData)
          .select()
          .single();

        if (error) throw error;
        shares.push(share);

        // Send notification
        await this.sendShareNotification(share, data.documentId);
      }

      // Log activity
      await this.logActivity({
        type: 'document_shared',
        family_id: this.currentFamilyId!,
        target_id: data.documentId,
        target_type: 'document',
        message: `Shared document with ${data.recipients.length} member(s)`,
        metadata: {
          recipients: data.recipients.length,
          permissions: data.permissions
        }
      });

      return shares;
    } catch (error) {
      console.error('Failed to share document:', error);
      throw error;
    }
  }

  /**
   * Get shared documents
   */
  async getSharedDocuments(userId: string, type: 'shared_by_me' | 'shared_with_me' = 'shared_with_me'): Promise<DocumentShare[]> {
    try {
      const column = type === 'shared_by_me' ? 'shared_by' : 'shared_with';

      const { data: shares, error } = await supabase
        .from('document_shares')
        .select(`
          *,
          documents (
            id,
            name,
            type,
            category,
            size,
            created_at
          ),
          shared_by_user:users!shared_by (
            name,
            email,
            avatar_url
          ),
          shared_with_user:users!shared_with (
            name,
            email,
            avatar_url
          )
        `)
        .eq(column, userId)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return shares || [];
    } catch (error) {
      console.error('Failed to get shared documents:', error);
      return [];
    }
  }

  /**
   * Update member role and permissions
   */
  async updateMemberRole(memberId: string, role: FamilyRole, permissions?: Partial<FamilyPermissions>): Promise<void> {
    try {
      const updateData: any = { role };

      if (permissions) {
        const { data: currentMember } = await supabase
          .from('family_members')
          .select('permissions')
          .eq('id', memberId)
          .single();

        updateData.permissions = { ...currentMember?.permissions, ...permissions };
      }

      const { error } = await supabase
        .from('family_members')
        .update(updateData)
        .eq('id', memberId);

      if (error) throw error;

      // Log activity
      await this.logActivity({
        type: 'role_changed',
        family_id: this.currentFamilyId!,
        target_id: memberId,
        target_type: 'member',
        message: `Member role updated to ${role}`,
        metadata: { role, permissions }
      });
    } catch (error) {
      console.error('Failed to update member role:', error);
      throw error;
    }
  }

  /**
   * Remove family member
   */
  async removeFamilyMember(memberId: string): Promise<void> {
    try {
      // Update status to left instead of deleting
      const { error } = await supabase
        .from('family_members')
        .update({
          status: 'left',
          left_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;

      // Update family member count
      if (this.currentFamilyId) {
        await this.updateFamilyMemberCount(this.currentFamilyId);
      }

      // Log activity
      await this.logActivity({
        type: 'member_left',
        family_id: this.currentFamilyId!,
        target_id: memberId,
        target_type: 'member',
        message: 'Member removed from family',
        metadata: { action: 'removed' }
      });
    } catch (error) {
      console.error('Failed to remove family member:', error);
      throw error;
    }
  }

  /**
   * Get family activity feed
   */
  async getFamilyActivity(familyId: string, limit: number = 50): Promise<CollaborationActivity[]> {
    try {
      const { data: activities, error } = await supabase
        .from('collaboration_activities')
        .select(`
          *,
          users (
            name,
            email,
            avatar_url
          )
        `)
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return activities || [];
    } catch (error) {
      console.error('Failed to get family activity:', error);
      return [];
    }
  }

  /**
   * Update family settings
   */
  async updateFamilySettings(familyId: string, settings: Partial<FamilySettings>): Promise<void> {
    try {
      const { data: family } = await supabase
        .from('families')
        .select('settings')
        .eq('id', familyId)
        .single();

      const updatedSettings = { ...family?.settings, ...settings };

      const { error } = await supabase
        .from('families')
        .update({ settings: updatedSettings })
        .eq('id', familyId);

      if (error) throw error;

      // Log activity
      await this.logActivity({
        type: 'settings_changed',
        family_id: familyId,
        target_id: familyId,
        target_type: 'family',
        message: 'Family settings updated',
        metadata: { changes: Object.keys(settings) }
      });
    } catch (error) {
      console.error('Failed to update family settings:', error);
      throw error;
    }
  }

  // Private helper methods

  private async getFamily(familyId: string): Promise<FamilyGroup | null> {
    try {
      const { data: family, error } = await supabase
        .from('families')
        .select('*')
        .eq('id', familyId)
        .single();

      if (error) return null;
      return family;
    } catch (error) {
      return null;
    }
  }

  private async findMemberByEmail(familyId: string, email: string): Promise<FamilyMember | null> {
    try {
      const { data: member, error } = await supabase
        .from('family_members')
        .select(`
          *,
          users (
            email,
            name,
            avatar_url
          )
        `)
        .eq('family_id', familyId)
        .eq('users.email', email)
        .single();

      if (error) return null;
      return {
        ...member,
        email: member.users?.email || '',
        name: member.users?.name || '',
        avatar_url: member.users?.avatar_url
      };
    } catch (error) {
      return null;
    }
  }

  private async addFamilyMember(familyId: string, data: Partial<FamilyMember>): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const memberData = {
      user_id: userId,
      family_id: familyId,
      status: 'active',
      joined_at: new Date().toISOString(),
      ...data
    };

    await supabase
      .from('family_members')
      .insert(memberData);
  }

  private async updateFamilyMemberCount(familyId: string): Promise<void> {
    const { count } = await supabase
      .from('family_members')
      .select('*', { count: 'exact', head: true })
      .eq('family_id', familyId)
      .eq('status', 'active');

    await supabase
      .from('families')
      .update({ member_count: count || 0 })
      .eq('id', familyId);
  }

  private async logActivity(data: Omit<CollaborationActivity, 'id' | 'user_id' | 'created_at' | 'read_by'>): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;

      const activityData = {
        ...data,
        user_id: userId,
        created_at: new Date().toISOString(),
        read_by: []
      };

      const { data: activity, error } = await supabase
        .from('collaboration_activities')
        .insert(activityData)
        .select()
        .single();

      if (error) throw error;

      // Notify listeners
      this.notifyActivityListeners(activity);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  private async sendInvitationEmail(invite: FamilyInvite, family: FamilyGroup): Promise<void> {
    // Implement email service integration
    console.log('Sending invitation email:', invite.email, family.name);
  }

  private async sendShareNotification(share: DocumentShare, documentId: string): Promise<void> {
    // Implement push notification service
    console.log('Sending share notification:', share.shared_with, documentId);
  }

  private setupRealtimeSubscriptions(): void {
    if (!this.currentFamilyId) return;

    // Subscribe to family activities
    supabase
      .channel('family_activities')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'collaboration_activities',
          filter: `family_id=eq.${this.currentFamilyId}`
        },
        (payload) => {
          this.notifyActivityListeners(payload.new as CollaborationActivity);
        }
      )
      .subscribe();
  }

  private notifyActivityListeners(activity: CollaborationActivity): void {
    this.activityListeners.forEach(listener => {
      try {
        listener(activity);
      } catch (error) {
        console.error('Activity listener error:', error);
      }
    });
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateInviteToken(): string {
    return crypto.getRandomValues(new Uint8Array(32)).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  }

  private getFullPermissions(): FamilyPermissions {
    return {
      canViewDocuments: true,
      canUploadDocuments: true,
      canShareDocuments: true,
      canManageMembers: true,
      canAccessEmergency: true,
      canViewAnalytics: true,
      canModifySettings: true,
      canDeleteDocuments: true,
      documentCategories: ['personal', 'financial', 'medical', 'legal', 'insurance', 'property']
    };
  }

  /**
   * Add activity listener
   */
  addActivityListener(callback: (activity: CollaborationActivity) => void): void {
    this.activityListeners.push(callback);
  }

  /**
   * Remove activity listener
   */
  removeActivityListener(callback: (activity: CollaborationActivity) => void): void {
    const index = this.activityListeners.indexOf(callback);
    if (index > -1) {
      this.activityListeners.splice(index, 1);
    }
  }

  /**
   * Get current family ID
   */
  getCurrentFamilyId(): string | null {
    return this.currentFamilyId;
  }

  /**
   * Set current family ID
   */
  setCurrentFamilyId(familyId: string): void {
    this.currentFamilyId = familyId;
    this.setupRealtimeSubscriptions();
  }
}

export const collaborationService = CollaborationService.getInstance();
