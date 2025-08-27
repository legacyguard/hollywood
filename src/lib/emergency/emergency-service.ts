import { createClient } from '@supabase/supabase-js';
import EmergencyDetectionEngine from './detection-engine';
import GuardianNotificationService from './guardian-notifier';
import EmergencyAccessControl from './access-control';
import EmergencyTestingSystem from './testing-system';
import type {
  EmergencyTriggerType,
  DetectionEngineConfig,
  EmergencyDashboardData,
  SurvivorInterface,
  ActivityTracker,
} from '@/types/emergency';
import { EmergencyActivation } from '@/types/emergency';

/**
 * Main Emergency Service that orchestrates all emergency system components
 * This is the primary interface for integrating emergency functionality
 */
export class EmergencyService {
  private detectionEngine: EmergencyDetectionEngine;
  private notificationService: GuardianNotificationService;
  private accessControl: EmergencyAccessControl;
  private testingSystem: EmergencyTestingSystem;

  private supabaseUrl: string;
  private supabaseServiceKey: string;
  private baseUrl: string;
  private isInitialized: boolean = false;

  constructor(
    supabaseUrl: string,
    supabaseServiceKey: string,
    baseUrl: string,
    config?: Partial<DetectionEngineConfig>
  ) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseServiceKey = supabaseServiceKey;
    this.baseUrl = baseUrl;

    // Initialize all service components
    this.detectionEngine = new EmergencyDetectionEngine(
      supabaseUrl,
      supabaseServiceKey,
      config
    );

    this.notificationService = new GuardianNotificationService(
      supabaseUrl,
      supabaseServiceKey,
      baseUrl
    );

    this.accessControl = new EmergencyAccessControl(
      supabaseUrl,
      supabaseServiceKey
    );

    this.testingSystem = new EmergencyTestingSystem(
      supabaseUrl,
      supabaseServiceKey,
      baseUrl,
      config
    );
  }

  private getServiceClient() {
    return createClient(this.supabaseUrl, this.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Initialize the emergency system for a user
   * Sets up default detection rules and shield settings
   */
  async initializeForUser(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = this.getServiceClient();

      // Check if already initialized
      const { data: existingSettings } = await supabase
        .from('family_shield_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingSettings) {
        return { success: true }; // Already initialized
      }

      // Create default shield settings
      const { error: settingsError } = await supabase
        .from('family_shield_settings')
        .insert({
          user_id: userId,
          inactivity_period_months: 6,
          required_guardians_for_activation: 1,
          is_shield_enabled: false, // User must explicitly enable
          shield_status: 'inactive',
        });

      if (settingsError) {
        throw settingsError;
      }

      // Initialize default emergency detection rules
      await supabase.rpc('initialize_default_emergency_rules', {
        target_user_id: userId,
      });

      this.isInitialized = true;
      return { success: true };
    } catch (error) {
      console.error('Error initializing emergency system:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      };
    }
  }

  /**
   * Monitor user activity and trigger emergency detection if needed
   * This should be called regularly (e.g., daily cron job)
   */
  async monitorUserActivity(userId: string): Promise<{
    activityTracker: ActivityTracker;
    triggerResult?: any;
    shouldAlert: boolean;
  }> {
    try {
      // Check current activity status
      const activityTracker =
        await this.detectionEngine.checkUserActivity(userId);

      // Evaluate if emergency triggers should be activated
      const evaluation =
        await this.detectionEngine.evaluateEmergencyTriggers(userId);

      let triggerResult = null;
      if (evaluation.shouldTrigger && evaluation.triggerType) {
        triggerResult = await this.detectionEngine.triggerEmergencyActivation(
          userId,
          evaluation.triggerType,
          undefined,
          `Automatic trigger: ${evaluation.reasons.join(', ')}`
        );
      }

      return {
        activityTracker,
        triggerResult,
        shouldAlert:
          evaluation.severity === 'high' || evaluation.severity === 'critical',
      };
    } catch (error) {
      console.error('Error monitoring user activity:', error);
      throw error;
    }
  }

  /**
   * Process a guardian's response to an emergency activation
   */
  async processGuardianResponse(
    verificationToken: string,
    guardianId: string,
    response: 'confirmed' | 'rejected',
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.notificationService.recordGuardianResponse(
        verificationToken,
        guardianId,
        response,
        notes
      );

      if (result.success && response === 'confirmed') {
        // Additional activation logic could go here
        // e.g., unlock survivor resources, send additional notifications, etc.
        console.log('Emergency activation confirmed by guardian');
      }

      return result;
    } catch (error) {
      console.error('Error processing guardian response:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to process response',
      };
    }
  }

  /**
   * Get emergency dashboard data for a guardian
   */
  async getEmergencyDashboard(
    verificationToken: string
  ): Promise<{ data?: EmergencyDashboardData; error?: string }> {
    try {
      const supabase = this.getServiceClient();

      // Get activation details
      const { data: activation, error: activationError } = await supabase
        .from('family_shield_activation_log')
        .select(
          `
          *,
          guardians!inner (*)
        `
        )
        .eq('verification_token', verificationToken)
        .single();

      if (activationError || !activation) {
        throw new Error('Invalid verification token');
      }

      // Check if token is expired
      if (new Date(activation.token_expires_at) < new Date()) {
        throw new Error('Verification token has expired');
      }

      // Get accessible resources for the guardian
      const guardian = activation.guardians;
      const resources = await this.accessControl.getAccessibleResources(
        activation.user_id,
        {
          accessorType: 'guardian',
          accessorId: guardian.id,
          guardianPermissions: {
            can_trigger_emergency: guardian.can_trigger_emergency,
            can_access_health_docs: guardian.can_access_health_docs,
            can_access_financial_docs: guardian.can_access_financial_docs,
            is_child_guardian: guardian.is_child_guardian,
            is_will_executor: guardian.is_will_executor,
            emergency_contact_priority: guardian.emergency_contact_priority,
          },
        }
      );

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('user_id', activation.user_id)
        .single();

      const dashboardData: EmergencyDashboardData = {
        user_info: {
          name: profile?.full_name || 'Unknown User',
          email: profile?.email || '',
          last_activity: activation.created_at,
          shield_status: 'pending_verification',
        },
        activation_details: activation,
        available_documents: resources.documents,
        access_permissions: {
          can_trigger_emergency: guardian.can_trigger_emergency,
          can_access_health_docs: guardian.can_access_health_docs,
          can_access_financial_docs: guardian.can_access_financial_docs,
          is_child_guardian: guardian.is_child_guardian,
          is_will_executor: guardian.is_will_executor,
          emergency_contact_priority: guardian.emergency_contact_priority,
        },
        contact_information: resources.contacts,
        time_capsules: resources.timeCapsules,
      };

      return { data: dashboardData };
    } catch (error) {
      console.error('Error getting emergency dashboard:', error);
      return {
        error:
          error instanceof Error ? error.message : 'Failed to load dashboard',
      };
    }
  }

  /**
   * Get survivor interface data
   */
  async getSurvivorInterface(
    accessToken: string,
    isPublicAccess: boolean = false
  ): Promise<{ data?: SurvivorInterface; error?: string }> {
    try {
      const supabase = this.getServiceClient();

      let userId: string;
      let hasFullAccess = false;

      if (isPublicAccess) {
        // For public access, token might be user ID or memorial token
        userId = accessToken;
      } else {
        // Try to find user by activation token
        const { data: activation } = await supabase
          .from('family_shield_activation_log')
          .select('user_id, status')
          .eq('verification_token', accessToken)
          .eq('status', 'confirmed')
          .single();

        if (activation) {
          userId = activation.user_id;
          hasFullAccess = true;
        } else {
          throw new Error('Invalid access token');
        }
      }

      // Get accessible resources
      const resources = await this.accessControl.getAccessibleResources(
        userId,
        {
          accessorType: hasFullAccess ? 'family_member' : 'public',
          accessToken: accessToken,
        }
      );

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, memorial_message')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      const survivorData: SurvivorInterface = {
        user_info: {
          name: profile.full_name || 'Unknown',
          memorial_message: profile.memorial_message,
          profile_photo_url: profile.avatar_url,
        },
        available_resources: [
          ...resources.documents.map(d => ({
            id: d.id,
            category: d.access_level as any,
            title: d.file_name,
            description: d.description || '',
            access_level: 'immediate',
            is_available: d.is_accessible,
            resource_type: 'document',
            metadata: { document_id: d.id },
          })),
          ...resources.contacts.map((c, idx) => ({
            id: `contact-${idx}`,
            category: 'contacts',
            title: c.name,
            description: `${c.relationship} - ${c.email}`,
            access_level: 'immediate',
            is_available: true,
            resource_type: 'contact',
            metadata: { contact: c },
          })),
        ],
        emergency_contacts: resources.contacts,
        important_documents: resources.documents,
        time_capsules: resources.timeCapsules,
        guidance_entries: resources.guidance.map(g => ({
          id: g.id,
          category: g.entry_type,
          title: g.title,
          content: g.content,
          priority: g.priority,
          is_completed: g.is_completed,
          related_documents: g.related_document_ids || [],
          created_at: g.created_at,
          updated_at: g.updated_at,
        })),
      };

      return { data: survivorData };
    } catch (error) {
      console.error('Error getting survivor interface:', error);
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load survivor interface',
      };
    }
  }

  /**
   * Manually trigger emergency activation (for testing or admin use)
   */
  async manualTrigger(
    userId: string,
    triggerType: EmergencyTriggerType,
    guardianId?: string,
    notes?: string
  ): Promise<{ success: boolean; activationId?: string; error?: string }> {
    return await this.detectionEngine.triggerEmergencyActivation(
      userId,
      triggerType,
      guardianId,
      notes
    );
  }

  /**
   * Get activation status for a user
   */
  async getActivationStatus(userId: string) {
    return await this.detectionEngine.getActivationStatus(userId);
  }

  /**
   * Record a health check response
   */
  async recordHealthCheck(
    userId: string,
    checkType: 'login' | 'document_access' | 'api_ping' | 'manual_confirmation',
    responded: boolean = true
  ): Promise<void> {
    await this.detectionEngine.processHealthCheck(userId, checkType, responded);
  }

  /**
   * Send reminder notifications for pending activations
   */
  async sendReminderNotifications(
    activationId: string,
    reminderType: 'first_reminder' | 'urgent_reminder' | 'final_warning'
  ) {
    return await this.notificationService.sendReminderNotification(
      activationId,
      reminderType
    );
  }

  /**
   * Run emergency system test suite
   * Use this to validate the emergency system is working correctly
   */
  async runTests(): Promise<any[]> {
    console.log('🧪 Running Emergency System Tests...');
    const results = await this.testingSystem.runTestSuite();

    // Generate and log test report
    const report = await this.testingSystem.generateTestReport(results);
    console.log(report);

    return results;
  }

  /**
   * Clean up expired tokens and notifications
   * Should be run periodically (e.g., daily cron job)
   */
  async cleanupExpiredData(): Promise<{ cleaned: number; errors: string[] }> {
    const supabase = this.getServiceClient();
    const errors: string[] = [];
    let cleaned = 0;

    try {
      // Clean up expired activation tokens
      const { error: tokenError } = await supabase.rpc(
        'expire_old_activation_tokens'
      );
      if (tokenError) {
        errors.push(`Token cleanup failed: ${tokenError.message}`);
      } else {
        cleaned++;
      }

      // Clean up expired notifications and access requests
      const { error: cleanupError } = await supabase.rpc(
        'cleanup_expired_emergency_data'
      );
      if (cleanupError) {
        errors.push(`Data cleanup failed: ${cleanupError.message}`);
      } else {
        cleaned++;
      }

      console.warn(
        `Emergency cleanup completed: ${cleaned} operations, ${errors.length} errors`
      );

      return { cleaned, errors };
    } catch (error) {
      console.error('Emergency cleanup error:', error);
      return {
        cleaned: 0,
        errors: [
          error instanceof Error ? error.message : 'Unknown cleanup error',
        ],
      };
    }
  }

  /**
   * Get comprehensive emergency system status
   */
  async getSystemStatus(): Promise<{
    isHealthy: boolean;
    activeShields: number;
    pendingActivations: number;
    pendingNotifications: number;
    errors: string[];
  }> {
    const supabase = this.getServiceClient();
    const errors: string[] = [];

    try {
      // Count active shields
      const { count: activeShields, error: shieldError } = await supabase
        .from('family_shield_settings')
        .select('*', { count: 'exact', head: true })
        .eq('is_shield_enabled', true);

      if (shieldError)
        errors.push(`Shield count error: ${shieldError.message}`);

      // Count pending activations
      const { count: pendingActivations, error: activationError } =
        await supabase
          .from('family_shield_activation_log')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

      if (activationError)
        errors.push(`Activation count error: ${activationError.message}`);

      // Count pending notifications
      const { count: pendingNotifications, error: notificationError } =
        await supabase
          .from('guardian_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('delivery_status', 'pending');

      if (notificationError)
        errors.push(`Notification count error: ${notificationError.message}`);

      const isHealthy = errors.length === 0;

      return {
        isHealthy,
        activeShields: activeShields || 0,
        pendingActivations: pendingActivations || 0,
        pendingNotifications: pendingNotifications || 0,
        errors,
      };
    } catch (error) {
      return {
        isHealthy: false,
        activeShields: 0,
        pendingActivations: 0,
        pendingNotifications: 0,
        errors: [
          error instanceof Error ? error.message : 'System status check failed',
        ],
      };
    }
  }
}

export default EmergencyService;
