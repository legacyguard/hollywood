export type EmergencyTriggerType =
  | 'inactivity_detected'
  | 'manual_guardian'
  | 'admin_override'
  | 'health_check_failure';
export type EmergencyStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'expired'
  | 'cancelled';
export type ShieldStatus =
  | 'inactive'
  | 'pending_verification'
  | 'active'
  | 'triggered';

// Core Emergency Detection Types
export interface EmergencyDetectionRule {
  id: string;
  name: string;
  description: string;
  rule_type:
    | 'inactivity'
    | 'health_check'
    | 'guardian_manual'
    | 'suspicious_activity';
  is_enabled: boolean;
  trigger_conditions: EmergencyTriggerCondition[];
  response_actions: EmergencyResponseAction[];
}

export interface EmergencyTriggerCondition {
  type: 'time_based' | 'activity_based' | 'guardian_based' | 'document_based';
  threshold_value: number;
  threshold_unit: 'days' | 'weeks' | 'months' | 'attempts' | 'guardians';
  comparison_operator:
    | 'greater_than'
    | 'less_than'
    | 'equal_to'
    | 'not_equal_to';
  metadata?: Record<string, any>;
}

export interface EmergencyResponseAction {
  type:
    | 'notify_guardians'
    | 'activate_shield'
    | 'send_email'
    | 'create_alert'
    | 'log_event';
  priority: number;
  delay_minutes: number;
  target_guardians?: string[]; // Guardian IDs
  message_template?: string;
  metadata?: Record<string, any>;
}

// Emergency Activation System
export interface EmergencyActivation {
  id: string;
  user_id: string;
  guardian_id?: string | null;
  trigger_type: EmergencyTriggerType;
  status: EmergencyStatus;
  verification_token: string;
  token_expires_at: string;
  guardian_email?: string | null;
  guardian_name?: string | null;
  notes?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  confirmed_at?: string | null;
  expired_at?: string | null;
}

// Emergency Dashboard Types
export interface EmergencyDashboardData {
  user_info: {
    name: string;
    email: string;
    last_activity: string;
    shield_status: ShieldStatus;
  };
  activation_details: EmergencyActivation;
  available_documents: EmergencyDocument[];
  access_permissions: GuardianPermissions;
  contact_information: EmergencyContact[];
  time_capsules: EmergencyTimeCapsule[];
}

export interface EmergencyDocument {
  id: string;
  file_name: string;
  document_type: string;
  access_level: 'health' | 'financial' | 'legal' | 'personal' | 'general';
  is_accessible: boolean;
  last_updated: string;
  description?: string;
}

export interface GuardianPermissions {
  can_trigger_emergency: boolean;
  can_access_health_docs: boolean;
  can_access_financial_docs: boolean;
  is_child_guardian: boolean;
  is_will_executor: boolean;
  emergency_contact_priority: number;
}

export interface EmergencyContact {
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  priority: number;
  is_notified: boolean;
}

export interface EmergencyTimeCapsule {
  id: string;
  message_title: string;
  message_preview?: string;
  delivery_condition: 'ON_DATE' | 'ON_DEATH';
  access_token: string;
  is_available: boolean;
  created_at: string;
}

// Detection Engine Configuration
export interface DetectionEngineConfig {
  inactivity_threshold_days: number;
  health_check_frequency_hours: number;
  guardian_verification_timeout_days: number;
  max_activation_attempts: number;
  cooldown_period_hours: number;
  notification_escalation_hours: number[];
}

export interface ActivityTracker {
  user_id: string;
  last_login: string;
  last_document_access: string;
  last_api_activity: string;
  activity_score: number; // Weighted score based on recent activity
  inactivity_days: number;
  health_check_status: 'healthy' | 'warning' | 'critical' | 'unresponsive';
  consecutive_missed_checks: number;
}

// Guardian Notification System
export interface GuardianNotification {
  id: string;
  guardian_id: string;
  user_id: string;
  notification_type:
    | 'activation_request'
    | 'verification_needed'
    | 'shield_activated'
    | 'status_update';
  title: string;
  message: string;
  action_required: boolean;
  action_url?: string;
  verification_token?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  delivery_method: 'email' | 'sms' | 'push' | 'all';
  sent_at?: string;
  read_at?: string;
  responded_at?: string;
  expires_at?: string;
}

// Survivor Interface Types
export interface SurvivorAccessRequest {
  token: string;
  requester_email?: string;
  requester_name?: string;
  relationship?: string;
  purpose?: string;
  requested_access_types: string[];
}

export interface SurvivorInterface {
  user_info: {
    name: string;
    memorial_message?: string;
    profile_photo_url?: string;
  };
  available_resources: SurvivorResource[];
  emergency_contacts: EmergencyContact[];
  important_documents: EmergencyDocument[];
  time_capsules: EmergencyTimeCapsule[];
  guidance_entries: SurvivorGuidanceEntry[];
}

export interface SurvivorResource {
  id: string;
  category:
    | 'financial'
    | 'legal'
    | 'medical'
    | 'personal'
    | 'contacts'
    | 'instructions';
  title: string;
  description: string;
  access_level: 'immediate' | 'guardian_verified' | 'legal_required';
  is_available: boolean;
  resource_type: 'document' | 'contact' | 'instruction' | 'time_capsule';
  metadata?: Record<string, any>;
}

export interface SurvivorGuidanceEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  priority: number;
  is_completed: boolean;
  completion_notes?: string;
  related_documents: string[];
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface CreateEmergencyActivationRequest {
  user_id: string;
  trigger_type: EmergencyTriggerType;
  guardian_id?: string;
  notes?: string;
}

export interface ConfirmEmergencyActivationRequest {
  verification_token: string;
  guardian_confirmation: boolean;
  additional_notes?: string;
}

export interface EmergencyActivationResponse {
  success: boolean;
  activation_id?: string;
  verification_token?: string;
  expires_at?: string;
  message: string;
  next_steps?: string[];
}

// Health Check System
export interface UserHealthCheck {
  user_id: string;
  check_type: 'login' | 'document_access' | 'api_ping' | 'manual_confirmation';
  status: 'responded' | 'missed' | 'pending';
  scheduled_at: string;
  responded_at?: string;
  response_method?: string;
  metadata?: Record<string, any>;
}

export const DEFAULT_DETECTION_CONFIG: DetectionEngineConfig = {
  inactivity_threshold_days: 180, // 6 months
  health_check_frequency_hours: 24, // Daily check
  guardian_verification_timeout_days: 7,
  max_activation_attempts: 3,
  cooldown_period_hours: 24,
  notification_escalation_hours: [0, 24, 72, 168], // Immediate, 1 day, 3 days, 1 week
};

export const EMERGENCY_PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type EmergencyPriority =
  (typeof EMERGENCY_PRIORITY_LEVELS)[keyof typeof EMERGENCY_PRIORITY_LEVELS];
