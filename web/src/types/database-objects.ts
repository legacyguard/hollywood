/**
 * Database Object Types
 * Properly typed interfaces for complex nested objects stored as JSON in the database
 */

// Review and Professional Network Object Types
export interface ReviewFindings {
  best_practices: string[];
  compliance_gaps: string[];
  jurisdiction_specific_notes?: string[];
  legal_issues: string[];
  recommendations: string[];
  risk_factors: string[];
}

export interface ReviewRecommendations {
  compliance_requirements: Array<{
    deadline?: string;
    jurisdiction: string;
    requirement: string;
    status: 'met' | 'missing' | 'partial';
  }>;
  immediate_actions: Array<{
    cost_impact?: string;
    description: string;
    estimated_time: string;
    priority: 'critical' | 'high' | 'low' | 'medium';
  }>;
  improvements: Array<{
    benefit: string;
    category: 'clarity' | 'completeness' | 'financial' | 'legal';
    suggestion: string;
  }>;
}

export interface ProfessionalCredentials {
  bar_number?: string;
  certification_body?: string;
  certifications?: Array<{
    date: string;
    expiry?: string;
    issuer: string;
    name: string;
  }>;
  education?: Array<{
    degree: string;
    field_of_study: string;
    institution: string;
    year: number;
  }>;
  jurisdictions?: string[];
  languages?: string[];
  license_number?: string;
  specializations?: string[];
  years_experience?: number;
}

export interface PartnershipDetails {
  agreement_type?: 'exclusive' | 'network' | 'preferred' | 'referral';
  commission_rate?: number;
  exclusivity?: boolean;
  minimum_volume?: number;
  payment_terms?: {
    frequency: 'monthly' | 'per_transaction' | 'quarterly';
    net_days: number;
  };
  performance_metrics?: {
    completion_rate_minimum: number;
    quality_score_minimum: number;
    response_time_hours: number;
  };
  services?: string[];
  territory?: string[];
}

export interface CommissionStructure {
  base_rate: number;
  minimum_payout: number;
  payment_schedule: 'immediate' | 'monthly' | 'quarterly';
  service_specific?: Record<string, number>;
  tier_bonuses?: Array<{
    bonus_rate: number;
    threshold: number;
  }>;
}

// Quick Insights and Analytics Object Types
export interface QuickInsightMetadata {
  affected_documents?: string[];
  calculation_method?: string;
  comparison_period?: string;
  confidence_score?: number;
  data_sources?: string[];
  last_updated?: string;
  recommended_timeline?: string;
  trend_direction?: 'down' | 'stable' | 'up';
}

export interface FamilyImpactData {
  affected_members: Array<{
    impact_level: 'high' | 'low' | 'medium';
    member_id: string;
    name: string;
    relationship: string;
    specific_benefits?: string[];
  }>;
  cost_savings?: {
    amount: number;
    category: 'administrative' | 'legal' | 'opportunity_cost';
    currency: string;
  };
  emotional_benefits: string[];
  peace_of_mind_score: number; // 1-10
  protection_increase: {
    confidence: number;
    current_level: number;
    projected_level: number;
  };
  time_saved_hours: number;
}

// Milestone and Progress Object Types
export interface MilestoneRewards {
  badges?: string[];
  celebration_message?: string;
  discount_codes?: Array<{
    applicable_services: string[];
    code: string;
    discount_percent: number;
    expires_at: string;
  }>;
  points: number;
  unlocked_features?: string[];
}

export interface MilestoneTriggers {
  document_count?: number;
  external_event?: string;
  family_members?: number;
  protection_percentage?: number;
  time_based?: {
    frequency: 'daily' | 'monthly' | 'weekly' | 'yearly';
    specific_date?: string;
  };
  user_action?: string;
}

export interface MilestoneMetadata {
  category_weights: Record<string, number>;
  completion_history: Array<{
    date: string;
    trigger: string;
    value: string;
  }>;
  related_milestones?: string[];
  user_preferences?: {
    celebration_style: 'full' | 'minimal' | 'standard';
    notification_timing: 'batch' | 'immediate' | 'quiet_hours';
  };
}

// Document and Asset Object Types
export interface ExtractedEntities {
  dates: Array<{
    confidence: number;
    context: string;
    date: string;
    type?: 'created' | 'effective' | 'expiry';
  }>;
  financial_amounts: Array<{
    amount: number;
    confidence: number;
    context: string;
    currency: string;
    type?: 'benefit' | 'premium' | 'value';
  }>;
  legal_references: Array<{
    confidence: number;
    jurisdiction: string;
    section?: string;
    statute: string;
  }>;
  locations: Array<{
    address: string;
    confidence: number;
    type?: 'business' | 'property' | 'residence';
  }>;
  organizations: Array<{
    confidence: number;
    context: string;
    name: string;
    type?: string;
  }>;
  people: Array<{
    confidence: number;
    context: string;
    name: string;
    role?: string;
  }>;
}

export interface ExtractedMetadata {
  document_structure: {
    has_notarization: boolean;
    has_signature_page: boolean;
    has_witness_section: boolean;
    sections: Array<{
      content_type: string;
      page_end: number;
      page_start: number;
      title: string;
    }>;
    total_pages: number;
  };
  expiry_information?: {
    expiry_date?: string;
    has_expiry: boolean;
    renewal_required?: boolean;
    warning_period_days?: number;
  };
  legal_document_type?: {
    confidence: number;
    jurisdiction: string;
    primary_type: string;
    sub_type?: string;
  };
  required_actions?: Array<{
    action: string;
    deadline?: string;
    priority: 'critical' | 'high' | 'low' | 'medium';
    responsible_party?: string;
  }>;
}

// Will and Estate Planning Object Types
export interface TestatorData {
  contact_info: {
    address: {
      city: string;
      country: string;
      postal_code: string;
      state: string;
      street: string;
    };
    email?: string;
    phone?: string;
  };
  identification: {
    expiry_date?: string;
    issuing_authority: string;
    number: string;
    type: 'drivers_license' | 'national_id' | 'passport';
  };
  personal_info: {
    children_count: number;
    citizenship: string;
    date_of_birth: string;
    full_name: string;
    marital_status:
      | 'divorced'
      | 'domestic_partnership'
      | 'married'
      | 'single'
      | 'widowed';
    occupation?: string;
    place_of_birth?: string;
    spouse_name?: string;
  };
}

export interface BeneficiaryInfo {
  conditions?: string[];
  contact_info?: {
    address?: {
      city: string;
      country: string;
      postal_code: string;
      state: string;
      street: string;
    };
    email?: string;
    phone?: string;
  };
  date_of_birth?: string;
  guardian_info?: {
    contact_info: {
      address?: {
        city: string;
        country: string;
        postal_code: string;
        state: string;
        street: string;
      };
      email?: string;
      phone?: string;
    };
    guardian_name: string;
    relationship: string;
  };
  id: string;
  name: string;
  relationship: string;
  share_type:
    | 'percentage'
    | 'remainder'
    | 'specific_amount'
    | 'specific_assets';
  share_value: string; // Could be percentage, amount, or asset description
  type: 'contingent' | 'primary' | 'residuary';
}

export interface AssetInfo {
  currency: string;
  description: string;
  encumbrances?: string[];
  id: string;
  joint_owners?: string[];
  location?: string;
  ownershipPercentage: number;
  special_instructions?: string;
  type:
    | 'bank_account'
    | 'business'
    | 'digital_asset'
    | 'investment'
    | 'other'
    | 'personal_property'
    | 'real_estate'
    | 'vehicle';
  value: number;
}

export interface ExecutorInfo {
  address: {
    city: string;
    country: string;
    postalCode: string;
    street: string;
  };
  compensation?: string;
  contactInfo: {
    address?: {
      city: string;
      country: string;
      postal_code: string;
      state: string;
      street: string;
    };
    email?: string;
    phone?: string;
  };
  id: string;
  isProfessional: boolean;
  limitations?: string[];
  name: string;
  relationship: string;
  special_powers?: string[];
  type: 'alternate' | 'co_executor' | 'primary';
}

export interface SpecialInstructions {
  business_succession?: {
    business_name: string;
    key_personnel?: string[];
    succession_plan: string;
  };
  charitable_bequests?: Array<{
    amount: string;
    amount_type: 'fixed_amount' | 'percentage';
    organization: string;
    purpose?: string;
  }>;
  digital_assets?: {
    accounts: Array<{
      instructions: string;
      platform: string;
      username?: string;
    }>;
    general_instructions: string;
  };
  funeral_preferences?: {
    ceremony_preferences?: string;
    location?: string;
    specific_wishes?: string;
    type: 'burial' | 'cremation' | 'donation';
  };
  personal_effects_distribution?: Array<{
    item_description: string;
    recipient: string;
    sentimental_note?: string;
  }>;
  pet_care?: Array<{
    care_fund_amount?: number;
    caregiver: string;
    pet_name: string;
    pet_type: string;
    special_instructions?: string;
  }>;
}

export interface AISuggestion {
  category: string;
  created_at: string;
  description: string;
  estimated_cost?: {
    currency: string;
    max: number;
    min: number;
  };
  id: string;
  implementation_timeline?: string;
  jurisdiction_specific: boolean;
  legal_references?: string[];
  priority: 'critical' | 'high' | 'low' | 'medium';
  suggested_action: string;
  title: string;
  type: 'improvement' | 'legal_consideration' | 'optimization' | 'warning';
}

// Calendar and Event Object Types
export interface CalendarAttendees {
  external_contacts: Array<{
    email: string;
    name: string;
    role?: string;
  }>;
  family_members: string[]; // Array of family member IDs
  professionals: Array<{
    id: string;
    name: string;
    type: 'accountant' | 'attorney' | 'financial_advisor';
  }>;
}

export interface CalendarReminders {
  email: Array<{
    minutes_before: number;
    recipient_roles: string[];
  }>;
  in_app: Array<{
    minutes_before: number;
    recipient_roles: string[];
  }>;
  sms: Array<{
    minutes_before: number;
    recipient_roles: string[];
  }>;
}

export interface CalendarMetadata {
  created_by_name: string;
  follow_up_actions?: Array<{
    action: string;
    assignee: string;
    completed: boolean;
    deadline: string;
  }>;
  last_modified_by?: string;
  meeting_preparation?: {
    agenda_items: string[];
    pre_meeting_tasks: Array<{
      assignee: string;
      deadline: string;
      task: string;
    }>;
    required_documents: string[];
  };
  recurrence_exceptions?: string[]; // Array of ISO date strings
  related_documents?: string[];
}

// Type guards for runtime validation
export function isValidExtractedEntities(obj: unknown): obj is ExtractedEntities {
  return (
    obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.people) &&
    Array.isArray(obj.organizations) &&
    Array.isArray(obj.locations) &&
    Array.isArray(obj.dates) &&
    Array.isArray(obj.financial_amounts) &&
    Array.isArray(obj.legal_references)
  );
}

export function isValidTestatorData(obj: unknown): obj is TestatorData {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.personal_info &&
    typeof obj.personal_info === 'object' &&
    typeof obj.personal_info.full_name === 'string' &&
    obj.contact_info &&
    typeof obj.contact_info === 'object'
  );
}

export function isValidBeneficiaryInfo(obj: unknown): obj is BeneficiaryInfo {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    ['primary', 'contingent', 'residuary'].includes(obj.type) &&
    ['percentage', 'specific_amount', 'specific_assets', 'remainder'].includes(
      obj.share_type
    )
  );
}

// Utility functions for type conversion and validation
export function sanitizeJsonField<T>(
  field: unknown,
  validator: (obj: unknown) => obj is T,
  fallback: T
): T {
  try {
    if (typeof field === 'string') {
      const parsed = JSON.parse(field);
      return validator(parsed) ? parsed : fallback;
    }
    return validator(field) ? field : fallback;
  } catch {
    return fallback;
  }
}

export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}

export function ensureObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ...fallback, ...value };
  }
  return fallback;
}
