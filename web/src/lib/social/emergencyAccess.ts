/**
 * Emergency Access Service
 * Phase 8: Social Collaboration & Family Features
 *
 * Handles emergency document access, guardian protocols,
 * time-locked access, and crisis management workflows.
 */

import { supabase } from '@/integrations/supabase/client';
import { captureError } from '@/lib/monitoring/sentry';
import { pushNotificationService } from '@/lib/pwa/pushNotifications';

export interface EmergencyContact {
  id: string;
  user_id: string;
  contact_user_id?: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  priority_order: number;
  can_access_documents: boolean;
  access_level: EmergencyAccessLevel;
  verification_method: VerificationMethod;
  created_at: string;
  updated_at: string;
  last_contacted?: string;
  response_time_hours?: number;
}

export interface EmergencyAccess {
  id: string;
  user_id: string;
  triggered_by: string;
  trigger_type: EmergencyTriggerType;
  status: EmergencyStatus;
  access_level: EmergencyAccessLevel;
  documents_accessible: string[];
  time_locked_until?: string;
  auto_unlock_at?: string;
  verification_required: boolean;
  verification_completed: boolean;
  created_at: string;
  activated_at?: string;
  resolved_at?: string;
  resolution_reason?: string;
  metadata: EmergencyMetadata;
}

export interface EmergencyProtocol {
  id: string;
  user_id: string;
  name: string;
  description: string;
  trigger_conditions: TriggerCondition[];
  time_delays: TimeDelay[];
  access_permissions: EmergencyAccessLevel[];
  notification_sequence: NotificationStep[];
  document_categories: string[];
  auto_activation: boolean;
  requires_verification: boolean;
  created_at: string;
  updated_at: string;
  last_tested?: string;
}

export interface EmergencyVerification {
  id: string;
  emergency_access_id: string;
  verifier_id: string;
  method: VerificationMethod;
  status: VerificationStatus;
  attempts: number;
  max_attempts: number;
  expires_at: string;
  verified_at?: string;
  verification_data: Record<string, unknown>;
  created_at: string;
}

export type EmergencyTriggerType =
  | 'manual_request'
  | 'inactivity_timeout'
  | 'family_request'
  | 'medical_emergency'
  | 'death_certificate'
  | 'court_order'
  | 'automatic';

export type EmergencyStatus =
  | 'pending'
  | 'time_locked'
  | 'verification_required'
  | 'active'
  | 'resolved'
  | 'denied'
  | 'expired';

export type EmergencyAccessLevel =
  | 'basic'        // View basic contact info and key documents
  | 'standard'     // Access financial and medical documents
  | 'full'         // Access all documents except private
  | 'complete';    // Access all documents including private

export type VerificationMethod =
  | 'email_code'
  | 'sms_code'
  | 'identity_document'
  | 'biometric'
  | 'multiple_contacts'
  | 'legal_document';

export type VerificationStatus =
  | 'pending'
  | 'in_progress'
  | 'verified'
  | 'failed'
  | 'expired';

export interface TriggerCondition {
  type: 'inactivity' | 'manual' | 'external';
  threshold?: number; // days for inactivity
  required_confirmations?: number;
  verification_required?: boolean;
}

export interface TimeDelay {
  level: EmergencyAccessLevel;
  delay_hours: number;
  can_expedite: boolean;
  expedite_requirements: string[];
}

export interface NotificationStep {
  delay_hours: number;
  contacts: string[]; // contact IDs
  method: 'email' | 'sms' | 'push' | 'call';
  message_template: string;
  requires_response: boolean;
  escalate_if_no_response: boolean;
}

export interface EmergencyMetadata {
  trigger_reason?: string;
  trigger_evidence?: string[];
  contact_attempts: ContactAttempt[];
  verification_history: VerificationAttempt[];
  access_log: AccessLogEntry[];
  notes: string[];
}

export interface ContactAttempt {
  contact_id: string;
  method: string;
  timestamp: string;
  success: boolean;
  response?: string;
}

export interface VerificationAttempt {
  method: VerificationMethod;
  timestamp: string;
  success: boolean;
  details: Record<string, unknown>;
}

export interface AccessLogEntry {
  timestamp: string;
  action: string;
  document_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export class EmergencyAccessService {
  private static instance: EmergencyAccessService;
  private activeEmergencies = new Map<string, EmergencyAccess>();
  private emergencyListeners: Array<(emergency: EmergencyAccess) => void> = [];

  static getInstance(): EmergencyAccessService {
    if (!EmergencyAccessService.instance) {
      EmergencyAccessService.instance = new EmergencyAccessService();
    }
    return EmergencyAccessService.instance;
  }

  /**
   * Initialize emergency access service
   */
  async initialize(userId: string): Promise<void> {
    try {
      // Load active emergencies
      await this.loadActiveEmergencies(userId);

      // Setup monitoring for automatic triggers
      this.setupAutomaticTriggers(userId);

      // Setup real-time subscriptions
      this.setupRealtimeSubscriptions();

      console.log('Emergency access service initialized');
    } catch (error) {
      console.error('Emergency access service initialization failed:', error);
      captureError(error instanceof Error ? error : new Error(String(error)), {
        tags: { source: 'emergency_access_init' }
      });
    }
  }

  /**
   * Create emergency protocol
   */
  async createEmergencyProtocol(data: Omit<EmergencyProtocol, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<EmergencyProtocol> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const protocolData = {
        ...data,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: protocol, error } = await supabase
        .from('emergency_protocols')
        .insert(protocolData)
        .select()
        .single();

      if (error) throw error;

      console.log('Emergency protocol created:', protocol.id);
      return protocol;
    } catch (error) {
      console.error('Failed to create emergency protocol:', error);
      throw error;
    }
  }

  /**
   * Add emergency contact
   */
  async addEmergencyContact(data: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<EmergencyContact> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const contactData = {
        ...data,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: contact, error } = await supabase
        .from('emergency_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) throw error;

      console.log('Emergency contact added:', contact.email);
      return contact;
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
      throw error;
    }
  }

  /**
   * Trigger emergency access
   */
  async triggerEmergencyAccess(data: {
    userId: string;
    triggerType: EmergencyTriggerType;
    accessLevel: EmergencyAccessLevel;
    reason?: string;
    evidence?: string[];
    expedite?: boolean;
  }): Promise<EmergencyAccess> {
    try {
      // Check if there's already an active emergency
      const existing = await this.getActiveEmergency(data.userId);
      if (existing) {
        throw new Error('Emergency access already active for this user');
      }

      // Get user's emergency protocol
      const protocol = await this.getUserEmergencyProtocol(data.userId);

      // Calculate time locks based on protocol
      const timeLocks = this.calculateTimeLocks(protocol, data.accessLevel, data.expedite);

      // Create emergency access record
      const emergencyData: Omit<EmergencyAccess, 'id'> = {
        user_id: data.userId,
        triggered_by: (await supabase.auth.getUser()).data.user?.id || 'system',
        trigger_type: data.triggerType,
        status: timeLocks.timeLockedUntil ? 'time_locked' : 'verification_required',
        access_level: data.accessLevel,
        documents_accessible: await this.getAccessibleDocuments(data.userId, data.accessLevel),
        time_locked_until: timeLocks.timeLockedUntil,
        auto_unlock_at: timeLocks.autoUnlockAt,
        verification_required: protocol?.requires_verification || true,
        verification_completed: false,
        created_at: new Date().toISOString(),
        metadata: {
          trigger_reason: data.reason,
          trigger_evidence: data.evidence || [],
          contact_attempts: [],
          verification_history: [],
          access_log: [],
          notes: []
        }
      };

      const { data: emergency, error } = await supabase
        .from('emergency_access')
        .insert(emergencyData)
        .select()
        .single();

      if (error) throw error;

      // Start notification sequence
      await this.startNotificationSequence(emergency, protocol);

      // Cache active emergency
      this.activeEmergencies.set(data.userId, emergency);

      // Notify listeners
      this.notifyEmergencyListeners(emergency);

      console.log('Emergency access triggered:', emergency.id);
      return emergency;
    } catch (error) {
      console.error('Failed to trigger emergency access:', error);
      throw error;
    }
  }

  /**
   * Request emergency access (from family member perspective)
   */
  async requestEmergencyAccess(data: {
    targetUserId: string;
    accessLevel: EmergencyAccessLevel;
    reason: string;
    relationship: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    evidence?: string[];
  }): Promise<EmergencyAccess> {
    try {
      const requesterId = (await supabase.auth.getUser()).data.user?.id;
      if (!requesterId) throw new Error('User not authenticated');

      // Check if requester is authorized emergency contact
      const isAuthorized = await this.verifyEmergencyContact(data.targetUserId, requesterId);
      if (!isAuthorized) {
        throw new Error('Not authorized to request emergency access');
      }

      return await this.triggerEmergencyAccess({
        userId: data.targetUserId,
        triggerType: 'family_request',
        accessLevel: data.accessLevel,
        reason: `${data.relationship} requesting ${data.urgency} priority access: ${data.reason}`,
        evidence: data.evidence,
        expedite: data.urgency === 'high' || data.urgency === 'critical'
      });
    } catch (error) {
      console.error('Failed to request emergency access:', error);
      throw error;
    }
  }

  /**
   * Verify emergency access request
   */
  async verifyEmergencyAccess(data: {
    emergencyId: string;
    method: VerificationMethod;
    verificationData: Record<string, unknown>;
  }): Promise<boolean> {
    try {
      const verifierId = (await supabase.auth.getUser()).data.user?.id;
      if (!verifierId) throw new Error('User not authenticated');

      // Create verification record
      const verificationData = {
        emergency_access_id: data.emergencyId,
        verifier_id: verifierId,
        method: data.method,
        status: 'in_progress' as VerificationStatus,
        attempts: 1,
        max_attempts: this.getMaxAttempts(data.method),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        verification_data: data.verificationData,
        created_at: new Date().toISOString()
      };

      const { data: verification, error } = await supabase
        .from('emergency_verifications')
        .insert(verificationData)
        .select()
        .single();

      if (error) throw error;

      // Process verification based on method
      const isVerified = await this.processVerification(verification, data.verificationData);

      if (isVerified) {
        // Update verification status
        await supabase
          .from('emergency_verifications')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString()
          })
          .eq('id', verification.id);

        // Update emergency access
        await this.activateEmergencyAccess(data.emergencyId);

        return true;
      } else {
        // Update verification status
        await supabase
          .from('emergency_verifications')
          .update({ status: 'failed' })
          .eq('id', verification.id);

        return false;
      }
    } catch (error) {
      console.error('Failed to verify emergency access:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts
   */
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      const { data: contacts, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('priority_order', { ascending: true });

      if (error) throw error;
      return contacts || [];
    } catch (error) {
      console.error('Failed to get emergency contacts:', error);
      return [];
    }
  }

  /**
   * Get user's emergency access status
   */
  async getEmergencyAccessStatus(userId: string): Promise<EmergencyAccess | null> {
    try {
      const { data: emergency, error } = await supabase
        .from('emergency_access')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return emergency || null;
    } catch (error) {
      console.error('Failed to get emergency access status:', error);
      return null;
    }
  }

  /**
   * Resolve emergency access
   */
  async resolveEmergencyAccess(emergencyId: string, reason: string): Promise<void> {
    try {
      const { data: emergency, error } = await supabase
        .from('emergency_access')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_reason: reason
        })
        .eq('id', emergencyId)
        .select()
        .single();

      if (error) throw error;

      // Remove from active cache
      this.activeEmergencies.delete(emergency.user_id);

      // Notify relevant parties
      await this.notifyEmergencyResolution(emergency, reason);

      console.log('Emergency access resolved:', emergencyId);
    } catch (error) {
      console.error('Failed to resolve emergency access:', error);
      throw error;
    }
  }

  // Private helper methods

  private async loadActiveEmergencies(userId: string): Promise<void> {
    try {
      const { data: emergencies, error } = await supabase
        .from('emergency_access')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['pending', 'time_locked', 'verification_required', 'active']);

      if (error) throw error;

      emergencies?.forEach(emergency => {
        this.activeEmergencies.set(emergency.user_id, emergency);
      });
    } catch (error) {
      console.error('Failed to load active emergencies:', error);
    }
  }

  private setupAutomaticTriggers(userId: string): void {
    // Check for inactivity every hour
    setInterval(async () => {
      await this.checkInactivityTriggers(userId);
    }, 60 * 60 * 1000);
  }

  private async checkInactivityTriggers(userId: string): Promise<void> {
    try {
      const protocol = await this.getUserEmergencyProtocol(userId);
      if (!protocol?.auto_activation) return;

      const inactivityTrigger = protocol.trigger_conditions.find(
        condition => condition.type === 'inactivity'
      );

      if (!inactivityTrigger?.threshold) return;

      // Check last activity
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.last_sign_in_at) {
        const lastActivity = new Date(user.user.last_sign_in_at);
        const thresholdDate = new Date(Date.now() - inactivityTrigger.threshold * 24 * 60 * 60 * 1000);

        if (lastActivity < thresholdDate) {
          await this.triggerEmergencyAccess({
            userId,
            triggerType: 'inactivity_timeout',
            accessLevel: 'basic',
            reason: `No activity detected for ${inactivityTrigger.threshold} days`
          });
        }
      }
    } catch (error) {
      console.error('Failed to check inactivity triggers:', error);
    }
  }

  private setupRealtimeSubscriptions(): void {
    supabase
      .channel('emergency_access')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_access'
        },
        (payload) => {
          const emergency = payload.new as EmergencyAccess;
          if (emergency) {
            this.activeEmergencies.set(emergency.user_id, emergency);
            this.notifyEmergencyListeners(emergency);
          }
        }
      )
      .subscribe();
  }

  private async getUserEmergencyProtocol(userId: string): Promise<EmergencyProtocol | null> {
    try {
      const { data: protocol, error } = await supabase
        .from('emergency_protocols')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return protocol || null;
    } catch (error) {
      return null;
    }
  }

  private calculateTimeLocks(protocol: EmergencyProtocol | null, accessLevel: EmergencyAccessLevel, expedite?: boolean) {
    if (!protocol) {
      // Default time locks
      const delays = {
        basic: 0,
        standard: 24,
        full: 72,
        complete: 168
      };

      const delayHours = expedite ? Math.floor(delays[accessLevel] / 2) : delays[accessLevel];
      const unlockTime = delayHours > 0 ? new Date(Date.now() + delayHours * 60 * 60 * 1000) : null;

      return {
        timeLockedUntil: unlockTime?.toISOString(),
        autoUnlockAt: unlockTime?.toISOString()
      };
    }

    const timeDelay = protocol.time_delays.find(delay => delay.level === accessLevel);
    if (!timeDelay) {
      return { timeLockedUntil: null, autoUnlockAt: null };
    }

    const delayHours = expedite && timeDelay.can_expedite ?
      Math.floor(timeDelay.delay_hours / 2) :
      timeDelay.delay_hours;

    const unlockTime = delayHours > 0 ? new Date(Date.now() + delayHours * 60 * 60 * 1000) : null;

    return {
      timeLockedUntil: unlockTime?.toISOString(),
      autoUnlockAt: unlockTime?.toISOString()
    };
  }

  private async getAccessibleDocuments(userId: string, accessLevel: EmergencyAccessLevel): Promise<string[]> {
    try {
      let categories: string[];

      switch (accessLevel) {
        case 'basic':
          categories = ['legal', 'emergency'];
          break;
        case 'standard':
          categories = ['legal', 'emergency', 'financial', 'medical'];
          break;
        case 'full':
          categories = ['legal', 'emergency', 'financial', 'medical', 'insurance', 'property'];
          break;
        case 'complete':
        default:
          categories = ['legal', 'emergency', 'financial', 'medical', 'insurance', 'property', 'personal'];
          break;
      }

      const { data: documents, error } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', userId)
        .in('category', categories);

      if (error) throw error;
      return documents?.map(doc => doc.id) || [];
    } catch (error) {
      console.error('Failed to get accessible documents:', error);
      return [];
    }
  }

  private async startNotificationSequence(emergency: EmergencyAccess, protocol: EmergencyProtocol | null): Promise<void> {
    if (!protocol) return;

    for (const step of protocol.notification_sequence) {
      setTimeout(async () => {
        await this.executeNotificationStep(emergency, step);
      }, step.delay_hours * 60 * 60 * 1000);
    }
  }

  private async executeNotificationStep(emergency: EmergencyAccess, step: NotificationStep): Promise<void> {
    try {
      const contacts = await this.getEmergencyContacts(emergency.user_id);
      const targetContacts = contacts.filter(contact => step.contacts.includes(contact.id));

      for (const contact of targetContacts) {
        await this.sendEmergencyNotification(emergency, contact, step);
      }
    } catch (error) {
      console.error('Failed to execute notification step:', error);
    }
  }

  private async sendEmergencyNotification(emergency: EmergencyAccess, contact: EmergencyContact, step: NotificationStep): Promise<void> {
    const message = step.message_template
      .replace('{contactName}', contact.name)
      .replace('{userEmail}', emergency.user_id)
      .replace('{accessLevel}', emergency.access_level)
      .replace('{triggerType}', emergency.trigger_type);

    switch (step.method) {
      case 'email':
        // Implement email notification
        console.log('Sending email to:', contact.email, message);
        break;
      case 'sms':
        // Implement SMS notification
        console.log('Sending SMS to:', contact.phone, message);
        break;
      case 'push':
        if (contact.contact_user_id) {
          await pushNotificationService.sendNotification('family_access_requested', {
            familyMember: contact.name,
            emergencyType: emergency.trigger_type,
            accessLevel: emergency.access_level
          });
        }
        break;
    }

    // Log contact attempt
    const attempt: ContactAttempt = {
      contact_id: contact.id,
      method: step.method,
      timestamp: new Date().toISOString(),
      success: true,
      response: undefined
    };

    emergency.metadata.contact_attempts.push(attempt);

    // Update emergency record
    await supabase
      .from('emergency_access')
      .update({ metadata: emergency.metadata })
      .eq('id', emergency.id);
  }

  private async verifyEmergencyContact(userId: string, contactUserId: string): Promise<boolean> {
    try {
      const { data: contact, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('contact_user_id', contactUserId)
        .eq('can_access_documents', true)
        .single();

      return !error && !!contact;
    } catch (error) {
      return false;
    }
  }

  private async processVerification(verification: EmergencyVerification, data: Record<string, unknown>): Promise<boolean> {
    switch (verification.method) {
      case 'email_code':
        return data.code && data.code === verification.verification_data.expected_code;
      case 'sms_code':
        return data.code && data.code === verification.verification_data.expected_code;
      case 'identity_document':
        return this.verifyIdentityDocument(data);
      case 'multiple_contacts':
        return this.verifyMultipleContacts(verification.emergency_access_id, data);
      default:
        return false;
    }
  }

  private verifyIdentityDocument(data: Record<string, unknown>): boolean {
    // Implement identity document verification logic
    return data.documentType && data.documentNumber && data.documentImage;
  }

  private async verifyMultipleContacts(emergencyId: string, data: Record<string, unknown>): Promise<boolean> {
    // Check if required number of contacts have verified
    const requiredVerifications = 2;
    const verifications = data.verifications || [];
    return verifications.length >= requiredVerifications;
  }

  private async activateEmergencyAccess(emergencyId: string): Promise<void> {
    const { data: emergency, error } = await supabase
      .from('emergency_access')
      .update({
        status: 'active',
        activated_at: new Date().toISOString(),
        verification_completed: true
      })
      .eq('id', emergencyId)
      .select()
      .single();

    if (error) throw error;

    // Update cache
    this.activeEmergencies.set(emergency.user_id, emergency);

    // Notify listeners
    this.notifyEmergencyListeners(emergency);

    console.log('Emergency access activated:', emergencyId);
  }

  private async notifyEmergencyResolution(emergency: EmergencyAccess, reason: string): Promise<void> {
    const contacts = await this.getEmergencyContacts(emergency.user_id);

    for (const _contact of contacts) {
      if (_contact.contact_user_id) {
        await pushNotificationService.sendNotification('security_alert', {
          message: `Emergency access resolved: ${reason}`,
          emergencyId: emergency.id
        });
      }
    }
  }

  private getMaxAttempts(method: VerificationMethod): number {
    switch (method) {
      case 'email_code':
      case 'sms_code':
        return 3;
      case 'identity_document':
        return 5;
      case 'multiple_contacts':
        return 1;
      default:
        return 3;
    }
  }

  private async getActiveEmergency(userId: string): Promise<EmergencyAccess | null> {
    return this.activeEmergencies.get(userId) || null;
  }

  private notifyEmergencyListeners(emergency: EmergencyAccess): void {
    this.emergencyListeners.forEach(listener => {
      try {
        listener(emergency);
      } catch (error) {
        console.error('Emergency listener error:', error);
      }
    });
  }

  /**
   * Add emergency event listener
   */
  addEmergencyListener(callback: (emergency: EmergencyAccess) => void): void {
    this.emergencyListeners.push(callback);
  }

  /**
   * Remove emergency event listener
   */
  removeEmergencyListener(callback: (emergency: EmergencyAccess) => void): void {
    const index = this.emergencyListeners.indexOf(callback);
    if (index > -1) {
      this.emergencyListeners.splice(index, 1);
    }
  }

  /**
   * Test emergency protocol
   */
  async testEmergencyProtocol(protocolId: string): Promise<boolean> {
    try {
      // Update last tested timestamp
      await supabase
        .from('emergency_protocols')
        .update({ last_tested: new Date().toISOString() })
        .eq('id', protocolId);

      // Send test notifications to emergency contacts
      const protocol = await supabase
        .from('emergency_protocols')
        .select('*')
        .eq('id', protocolId)
        .single();

      if (protocol.data) {
        const contacts = await this.getEmergencyContacts(protocol.data.user_id);

        for (const _contact of contacts) {
          await pushNotificationService.sendNotification('system_update', {
            message: `Emergency protocol test - ${protocol.data.name}`,
            testMode: true
          });
        }
      }

      console.log('Emergency protocol tested:', protocolId);
      return true;
    } catch (error) {
      console.error('Failed to test emergency protocol:', error);
      return false;
    }
  }
}

export const emergencyAccessService = EmergencyAccessService.getInstance();
