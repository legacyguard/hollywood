export interface Guardian {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string | null;
  relationship?: string | null;
  notes?: string | null;
  is_active: boolean;
  // Family Shield permissions
  can_trigger_emergency: boolean;
  can_access_health_docs: boolean;
  can_access_financial_docs: boolean;
  is_child_guardian: boolean;
  is_will_executor: boolean;
  emergency_contact_priority: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGuardianRequest {
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
  notes?: string;
  // Family Shield permissions
  can_trigger_emergency?: boolean;
  can_access_health_docs?: boolean;
  can_access_financial_docs?: boolean;
  is_child_guardian?: boolean;
  is_will_executor?: boolean;
  emergency_contact_priority?: number;
}

export interface UpdateGuardianRequest extends Partial<CreateGuardianRequest> {
  is_active?: boolean;
}

export type GuardianRelationship =
  | 'spouse'
  | 'partner'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'friend'
  | 'lawyer'
  | 'financial_advisor'
  | 'other';

export const GUARDIAN_RELATIONSHIPS: {
  value: GuardianRelationship;
  label: string;
}[] = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'partner', label: 'Partner' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'financial_advisor', label: 'Financial Advisor' },
  { value: 'other', label: 'Other' },
];

// Family Shield types
export interface FamilyShieldSettings {
  id: string;
  user_id: string;
  inactivity_period_months: number;
  required_guardians_for_activation: number;
  is_shield_enabled: boolean;
  last_activity_check: string;
  shield_status: 'inactive' | 'pending_verification' | 'active';
  created_at: string;
  updated_at: string;
}

export interface CreateFamilyShieldSettingsRequest {
  inactivity_period_months?: number;
  required_guardians_for_activation?: number;
  is_shield_enabled?: boolean;
}

export type FamilyShieldActivationType =
  | 'inactivity_detected'
  | 'manual_guardian'
  | 'admin_override';
export type ActivationStatus = 'pending' | 'confirmed' | 'rejected' | 'expired';

export interface FamilyShieldActivationLog {
  id: string;
  user_id: string;
  guardian_id?: string | null;
  activation_type: FamilyShieldActivationType;
  status: ActivationStatus;
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

export type ManualEntryType =
  | 'important_contacts'
  | 'financial_access'
  | 'property_management'
  | 'funeral_wishes'
  | 'document_locations'
  | 'custom_instruction'
  | 'emergency_procedure'
  | 'child_care_instructions';

export interface FamilyGuidanceEntry {
  id: string;
  user_id: string;
  entry_type: ManualEntryType;
  title: string;
  content: string;
  is_completed: boolean;
  priority: number;
  tags: string[];
  related_document_ids: string[];
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGuidanceEntryRequest {
  entry_type: ManualEntryType;
  title: string;
  content: string;
  priority?: number;
  tags?: string[];
  related_document_ids?: string[];
}
