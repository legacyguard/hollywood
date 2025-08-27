/**
 * Family Service
 * Handles family member management, invitations, and collaboration features
 */

import type {
  FamilyMember,
  FamilyInvitation,
  FamilyRole,
  RelationshipType,
  FamilyPermissions,
  FamilyProtectionStatus,
  FamilyStats,
  FamilyCalendarEvent,
  FamilyTimeline,
  EmergencyAccessRequest} from '@/types/family';
import {
  FAMILY_ROLE_PERMISSIONS
} from '@/types/family';

export class FamilyService {
  private static instance: FamilyService;
  private familyMembers: Map<string, FamilyMember[]> = new Map(); // userId -> members
  private invitations: Map<string, FamilyInvitation[]> = new Map(); // userId -> invitations
  private calendarEvents: Map<string, FamilyCalendarEvent[]> = new Map(); // familyId -> events
  private timeline: Map<string, FamilyTimeline[]> = new Map(); // familyId -> timeline

  private constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  public static getInstance(): FamilyService {
    if (!FamilyService.instance) {
      FamilyService.instance = new FamilyService();
    }
    return FamilyService.instance;
  }

  /**
   * Initialize mock data for development
   */
  private initializeMockData(): void {
    const mockUserId = 'user_123';

    // Mock family members
    const mockMembers: FamilyMember[] = [
      {
        id: 'member_1',
        email: 'sarah.johnson@email.com',
        name: 'Sarah Johnson',
        role: 'collaborator',
        relationship: 'spouse',
        status: 'active',
        invitedAt: new Date('2024-01-15'),
        joinedAt: new Date('2024-01-16'),
        lastActiveAt: new Date('2024-01-20'),
        invitedBy: mockUserId,
        permissions: FAMILY_ROLE_PERMISSIONS.collaborator,
        emergencyPriority: 1,
        notes: 'Primary emergency contact'
      },
      {
        id: 'member_2',
        email: 'michael.johnson@email.com',
        name: 'Michael Johnson',
        role: 'viewer',
        relationship: 'child',
        status: 'active',
        invitedAt: new Date('2024-01-20'),
        joinedAt: new Date('2024-01-21'),
        lastActiveAt: new Date('2024-01-25'),
        invitedBy: mockUserId,
        permissions: FAMILY_ROLE_PERMISSIONS.viewer,
        notes: 'Adult child, basic access'
      },
      {
        id: 'member_3',
        email: 'dr.smith@lawfirm.com',
        name: 'Dr. Robert Smith',
        role: 'viewer',
        relationship: 'attorney',
        status: 'invited',
        invitedAt: new Date('2024-01-28'),
        invitedBy: mockUserId,
        permissions: {
          ...FAMILY_ROLE_PERMISSIONS.viewer,
          documentCategories: ['will', 'trust', 'legal']
        },
        notes: 'Family attorney for estate planning'
      }
    ];

    this.familyMembers.set(mockUserId, mockMembers);

    // Mock pending invitations
    const mockInvitations: FamilyInvitation[] = [
      {
        id: 'invite_1',
        email: 'emma.johnson@email.com',
        name: 'Emma Johnson',
        role: 'viewer',
        relationship: 'child',
        message: 'Hi Emma! I\'d love for you to be part of our family\'s legacy protection plan. This will help you stay informed about important family documents.',
        invitedBy: mockUserId,
        invitedAt: new Date('2024-01-30'),
        expiresAt: new Date('2024-02-29'),
        status: 'pending',
        token: 'inv_token_123'
      }
    ];

    this.invitations.set(mockUserId, mockInvitations);
  }

  /**
   * Get all family members for a user
   */
  public async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    return this.familyMembers.get(userId) || [];
  }

  /**
   * Get pending invitations for a user
   */
  public async getPendingInvitations(userId: string): Promise<FamilyInvitation[]> {
    const invitations = this.invitations.get(userId) || [];
    return invitations.filter(inv => inv.status === 'pending' && inv.expiresAt > new Date());
  }

  /**
   * Send family member invitation
   */
  public async sendInvitation(
    userId: string,
    invitationData: {
      email: string;
      name: string;
      role: FamilyRole;
      relationship: RelationshipType;
      message?: string;
    }
  ): Promise<FamilyInvitation> {
    const invitation: FamilyInvitation = {
      id: `invite_${Date.now()}`,
      email: invitationData.email,
      name: invitationData.name,
      role: invitationData.role,
      relationship: invitationData.relationship,
      message: invitationData.message || this.generateDefaultMessage(invitationData.relationship),
      invitedBy: userId,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'pending',
      token: this.generateInvitationToken()
    };

    // Store invitation
    const userInvitations = this.invitations.get(userId) || [];
    userInvitations.push(invitation);
    this.invitations.set(userId, userInvitations);

    // In production, this would send an email
    await this.sendInvitationEmail(invitation);

    // Add to timeline
    await this.addTimelineEvent(userId, {
      type: 'member_joined',
      title: 'Family Invitation Sent',
      description: `Invited ${invitation.name} to join as ${invitation.role}`,
      initiatedBy: userId,
      affectedMembers: []
    });

    return invitation;
  }

  /**
   * Accept family invitation
   */
  public async acceptInvitation(token: string): Promise<FamilyMember> {
    // Find invitation by token
    let invitation: FamilyInvitation | null = null;
    let ownerId = '';

    for (const [userId, invitations] of this.invitations.entries()) {
      const found = invitations.find(inv => inv.token === token && inv.status === 'pending');
      if (found) {
        invitation = found;
        ownerId = userId;
        break;
      }
    }

    if (!invitation) {
      throw new Error('Invitation not found or expired');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      throw new Error('Invitation has expired');
    }

    // Create family member
    const member: FamilyMember = {
      id: `member_${Date.now()}`,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      relationship: invitation.relationship,
      status: 'active',
      invitedAt: invitation.invitedAt,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      invitedBy: invitation.invitedBy,
      permissions: FAMILY_ROLE_PERMISSIONS[invitation.role]
    };

    // Add to family members
    const familyMembers = this.familyMembers.get(ownerId) || [];
    familyMembers.push(member);
    this.familyMembers.set(ownerId, familyMembers);

    // Update invitation status
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();

    // Add to timeline
    await this.addTimelineEvent(ownerId, {
      type: 'member_joined',
      title: 'New Family Member',
      description: `${member.name} joined the family protection plan`,
      initiatedBy: member.id,
      affectedMembers: [member.id]
    });

    return member;
  }

  /**
   * Remove family member
   */
  public async removeFamilyMember(userId: string, memberId: string): Promise<void> {
    const members = this.familyMembers.get(userId) || [];
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
      throw new Error('Family member not found');
    }

    const member = members[memberIndex];
    members.splice(memberIndex, 1);
    this.familyMembers.set(userId, members);

    // Add to timeline
    await this.addTimelineEvent(userId, {
      type: 'member_joined', // Using closest available type
      title: 'Family Member Removed',
      description: `${member.name} was removed from the family plan`,
      initiatedBy: userId,
      affectedMembers: [memberId]
    });
  }

  /**
   * Update family member role and permissions
   */
  public async updateMemberRole(
    userId: string,
    memberId: string,
    newRole: FamilyRole,
    customPermissions?: Partial<FamilyPermissions>
  ): Promise<FamilyMember> {
    const members = this.familyMembers.get(userId) || [];
    const member = members.find(m => m.id === memberId);

    if (!member) {
      throw new Error('Family member not found');
    }

    const oldRole = member.role;
    member.role = newRole;
    member.permissions = customPermissions ?
      { ...FAMILY_ROLE_PERMISSIONS[newRole], ...customPermissions } :
      FAMILY_ROLE_PERMISSIONS[newRole];

    // Add to timeline
    await this.addTimelineEvent(userId, {
      type: 'member_joined', // Using closest available type
      title: 'Role Updated',
      description: `${member.name}'s role changed from ${oldRole} to ${newRole}`,
      initiatedBy: userId,
      affectedMembers: [memberId]
    });

    return member;
  }

  /**
   * Get family protection status
   */
  public async getFamilyProtectionStatus(userId: string): Promise<FamilyProtectionStatus> {
    const members = await this.getFamilyMembers(userId);
    const activeMembers = members.filter(m => m.status === 'active');

    // Calculate protection level based on various factors
    let protectionScore = 0;

    // Base score for having family members
    if (activeMembers.length > 0) protectionScore += 20;
    if (activeMembers.length >= 3) protectionScore += 20;

    // Emergency contacts
    const emergencyContacts = activeMembers.filter(m => m.role === 'emergency_contact' || m.emergencyPriority);
    if (emergencyContacts.length > 0) protectionScore += 20;
    if (emergencyContacts.length >= 2) protectionScore += 10;

    // Professional help (attorney, etc.)
    const professionals = activeMembers.filter(m => ['attorney', 'accountant'].includes(m.relationship));
    if (professionals.length > 0) protectionScore += 15;

    // Document sharing coverage
    const collaborators = activeMembers.filter(m => m.permissions.canViewDocuments);
    if (collaborators.length >= 2) protectionScore += 15;

    const strengths: string[] = [];
    const recommendations: string[] = [];

    if (emergencyContacts.length > 0) {
      strengths.push('Emergency contacts established');
    } else {
      recommendations.push('Add emergency contacts for critical situations');
    }

    if (professionals.length > 0) {
      strengths.push('Professional advisors included');
    } else {
      recommendations.push('Consider adding your attorney or accountant');
    }

    if (collaborators.length >= 2) {
      strengths.push('Multiple family members can access documents');
    } else {
      recommendations.push('Share document access with more family members');
    }

    return {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      protectionLevel: Math.min(protectionScore, 100),
      documentsShared: 0, // Would calculate from actual document sharing
      emergencyContactsSet: emergencyContacts.length > 0,
      lastUpdated: new Date(),
      strengths,
      recommendations
    };
  }

  /**
   * Get family statistics
   */
  public async getFamilyStats(userId: string): Promise<FamilyStats> {
    const members = await this.getFamilyMembers(userId);
    const timeline = this.timeline.get(userId) || [];
    const upcomingEvents = this.calendarEvents.get(userId) || [];

    return {
      totalDocuments: 24, // Mock data
      sharedDocuments: 18,
      memberContributions: {
        'member_1': 5,
        'member_2': 2,
        'user_123': 17
      },
      documentsByCategory: {
        'will': 3,
        'trust': 2,
        'insurance': 8,
        'medical': 6,
        'other': 5
      },
      recentActivity: timeline.slice(-10),
      upcomingEvents: upcomingEvents.filter(e => e.date > new Date()).slice(0, 5),
      protectionScore: 78
    };
  }

  /**
   * Create emergency access request
   */
  public async createEmergencyAccessRequest(
    memberId: string,
    requestData: {
      reason: string;
      documentsRequested: string[];
      emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
    }
  ): Promise<EmergencyAccessRequest> {
    const request: EmergencyAccessRequest = {
      id: `emergency_${Date.now()}`,
      requestedBy: memberId,
      requestedAt: new Date(),
      reason: requestData.reason,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      documentsRequested: requestData.documentsRequested,
      accessDuration: 2, // 2 hours default
      verificationMethod: 'sms',
      emergencyLevel: requestData.emergencyLevel
    };

    // In production, this would trigger notifications to family admins
    // and store in database

    return request;
  }

  /**
   * Generate default invitation message based on relationship
   */
  private generateDefaultMessage(relationship: RelationshipType): string {
    const messages: Partial<Record<RelationshipType, string>> = {
      spouse: "I'd love for you to be part of our family's legacy protection plan. This will help us both stay organized and protected.",
      partner: "I'd love for you to be part of our family's legacy protection plan. This will help us both stay organized and protected.",
      child: "Hi! I want to make sure you have access to important family information when you need it. This is about keeping our family prepared and connected.",
      parent: "I'd like you to be part of our family's document protection system. Your wisdom and guidance are important to our family's security.",
      sibling: "Hey! I'm setting up a family protection plan and would love for you to be included. It's about keeping our family connected and secure.",
      grandparent: "I'd like you to be part of our family's document protection system. Your wisdom and guidance are important to our family's security.",
      grandchild: "Hi! I want to make sure you have access to important family information when you need it. This is about keeping our family prepared and connected.",
      aunt_uncle: "Hey! I'm setting up a family protection plan and would love for you to be included. It's about keeping our family connected and secure.",
      cousin: "Hey! I'm setting up a family protection plan and would love for you to be included. It's about keeping our family connected and secure.",
      attorney: "I would like to invite you to access our family's legal documents through our secure platform for easier collaboration.",
      accountant: "I would like to invite you to access our family's financial documents through our secure platform for easier collaboration.",
      friend: "I trust you and would like you to have access to important information about our family in case of emergencies.",
      other: "I'd like to invite you to join our family's legacy protection plan to help keep important information organized and accessible."
    };

    return messages[relationship] || messages.other;
  }

  /**
   * Generate secure invitation token
   */
  private generateInvitationToken(): string {
    return 'inv_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Send invitation email (mock implementation)
   */
  private async sendInvitationEmail(invitation: FamilyInvitation): Promise<void> {
    console.log(`Sending invitation email to ${invitation.email}`);
    // In production, this would use an email service
  }

  /**
   * Add timeline event
   */
  private async addTimelineEvent(
    userId: string,
    eventData: {
      type: FamilyTimeline['type'];
      title: string;
      description: string;
      initiatedBy: string;
      affectedMembers: string[];
      relatedDocumentId?: string;
      relatedEventId?: string;
    }
  ): Promise<void> {
    const event: FamilyTimeline = {
      id: `timeline_${Date.now()}`,
      ...eventData,
      date: new Date(),
      metadata: {}
    };

    const timeline = this.timeline.get(userId) || [];
    timeline.unshift(event); // Add to beginning

    // Keep only last 100 events
    if (timeline.length > 100) {
      timeline.splice(100);
    }

    this.timeline.set(userId, timeline);
  }

  /**
   * Get recommended family members to invite
   */
  public async getInvitationRecommendations(userId: string): Promise<{
    relationship: RelationshipType;
    role: FamilyRole;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[]> {
    const members = await this.getFamilyMembers(userId);
    const existingRelationships = new Set(members.map(m => m.relationship));

    const recommendations = [
      {
        relationship: 'spouse' as RelationshipType,
        role: 'collaborator' as FamilyRole,
        reason: 'Your spouse should have full access to family documents and decision-making',
        priority: 'high' as const
      },
      {
        relationship: 'child' as RelationshipType,
        role: 'viewer' as FamilyRole,
        reason: 'Adult children benefit from knowing about family planning and important documents',
        priority: 'high' as const
      },
      {
        relationship: 'attorney' as RelationshipType,
        role: 'viewer' as FamilyRole,
        reason: 'Your attorney can provide better service with access to relevant documents',
        priority: 'medium' as const
      },
      {
        relationship: 'sibling' as RelationshipType,
        role: 'emergency_contact' as FamilyRole,
        reason: 'A trusted sibling can serve as an important emergency contact',
        priority: 'medium' as const
      }
    ];

    // Filter out relationships that already exist
    return recommendations.filter(rec => !existingRelationships.has(rec.relationship));
  }

  /**
   * Check if user has reached family member limits
   */
  public async checkFamilyLimits(userId: string): Promise<{
    currentPlan: 'free' | 'family' | 'premium';
    memberCount: number;
    memberLimit: number;
    canAddMore: boolean;
    upgradeRequired: boolean;
  }> {
    const members = await this.getFamilyMembers(userId);

    // Mock current plan - in production, this would come from user's subscription
    const currentPlan = 'free';
    const limits = { free: 2, family: 8, premium: -1 };
    const memberLimit = limits[currentPlan];
    const canAddMore = memberLimit === -1 || members.length < memberLimit;

    return {
      currentPlan,
      memberCount: members.length,
      memberLimit,
      canAddMore,
      upgradeRequired: !canAddMore
    };
  }

  /**
   * Resend invitation to family member
   */
  public async resendInvitation(userId: string, memberId: string): Promise<void> {
    const userInvitations = this.invitations.get(userId) || [];
    const invitation = userInvitations.find(inv => inv.id === memberId);

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Reset expiration date
    invitation.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    invitation.status = 'pending';

    // Resend email
    await this.sendInvitationEmail(invitation);
  }

  /**
   * Get calendar events for date range
   */
  public async getCalendarEvents(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<FamilyCalendarEvent[]> {
    const userEvents = this.calendarEvents.get(userId) || [];
    return userEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  /**
   * Create calendar event
   */
  public async createCalendarEvent(
    userId: string,
    eventData: Omit<FamilyCalendarEvent, 'id'>
  ): Promise<FamilyCalendarEvent> {
    const event: FamilyCalendarEvent = {
      id: `event_${Date.now()}`,
      ...eventData
    };

    const userEvents = this.calendarEvents.get(userId) || [];
    userEvents.push(event);
    this.calendarEvents.set(userId, userEvents);

    return event;
  }
}

export const familyService = FamilyService.getInstance();

