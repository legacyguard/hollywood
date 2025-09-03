/**
 * Database Object Types
 * Properly typed interfaces for complex nested objects stored as JSON in the database
 */

// Review and Professional Network Object Types
export interface ReviewFindings {
  legal_issues: string[];
  compliance_gaps: string[];
  recommendations: string[];
  risk_factors: string[];
  best_practices: string[];
  jurisdiction_specific_notes?: string[];
}

export interface ReviewRecommendations {
  immediate_actions: Array<{
    priority: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    estimated_time: string;
    cost_impact?: string;
  }>;
  improvements: Array<{
    category: 'legal' | 'financial' | 'clarity' | 'completeness';
    suggestion: string;
    benefit: string;
  }>;
  compliance_requirements: Array<{
    jurisdiction: string;
    requirement: string;
    deadline?: string;
    status: 'met' | 'partial' | 'missing';
  }>;
}

export interface ProfessionalCredentials {
  license_number?: string;
  bar_number?: string;
  certification_body?: string;
  years_experience?: number;
  education?: Array<{
    institution: string;
    degree: string;
    year: number;
    field_of_study: string;
  }>;
  specializations?: string[];
  languages?: string[];
  jurisdictions?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    expiry?: string;
  }>;
}

export interface PartnershipDetails {
  agreement_type?: 'referral' | 'exclusive' | 'preferred' | 'network';
  commission_rate?: number;
  exclusivity?: boolean;
  territory?: string[];
  services?: string[];
  minimum_volume?: number;
  payment_terms?: {
    frequency: 'monthly' | 'quarterly' | 'per_transaction';
    net_days: number;
  };
  performance_metrics?: {
    response_time_hours: number;
    quality_score_minimum: number;
    completion_rate_minimum: number;
  };
}

export interface CommissionStructure {
  base_rate: number;
  tier_bonuses?: Array<{
    threshold: number;
    bonus_rate: number;
  }>;
  service_specific?: Record<string, number>;
  payment_schedule: 'immediate' | 'monthly' | 'quarterly';
  minimum_payout: number;
}

// Quick Insights and Analytics Object Types
export interface QuickInsightMetadata {
  calculation_method?: string;
  data_sources?: string[];
  confidence_score?: number;
  last_updated?: string;
  trend_direction?: 'up' | 'down' | 'stable';
  comparison_period?: string;
  affected_documents?: string[];
  recommended_timeline?: string;
}

export interface FamilyImpactData {
  affected_members: Array<{
    member_id: string;
    name: string;
    relationship: string;
    impact_level: 'high' | 'medium' | 'low';
    specific_benefits?: string[];
  }>;
  protection_increase: {
    current_level: number;
    projected_level: number;
    confidence: number;
  };
  time_saved_hours: number;
  cost_savings?: {
    amount: number;
    currency: string;
    category: 'legal' | 'administrative' | 'opportunity_cost';
  };
  emotional_benefits: string[];
  peace_of_mind_score: number; // 1-10
}

// Milestone and Progress Object Types
export interface MilestoneRewards {
  points: number;
  badges?: string[];
  unlocked_features?: string[];
  discount_codes?: Array<{
    code: string;
    discount_percent: number;
    expires_at: string;
    applicable_services: string[];
  }>;
  celebration_message?: string;
}

export interface MilestoneTriggers {
  document_count?: number;
  family_members?: number;
  protection_percentage?: number;
  time_based?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    specific_date?: string;
  };
  user_action?: string;
  external_event?: string;
}

export interface MilestoneMetadata {
  category_weights: Record<string, number>;
  completion_history: Array<{
    date: string;
    trigger: string;
    value: string;
  }>;
  user_preferences?: {
    celebration_style: 'minimal' | 'standard' | 'full';
    notification_timing: 'immediate' | 'batch' | 'quiet_hours';
  };
  related_milestones?: string[];
}

// Document and Asset Object Types
export interface ExtractedEntities {
  people: Array<{
    name: string;
    role?: string;
    confidence: number;
    context: string;
  }>;
  organizations: Array<{
    name: string;
    type?: string;
    confidence: number;
    context: string;
  }>;
  locations: Array<{
    address: string;
    type?: 'residence' | 'business' | 'property';
    confidence: number;
  }>;
  dates: Array<{
    date: string;
    type?: 'expiry' | 'effective' | 'created';
    confidence: number;
    context: string;
  }>;
  financial_amounts: Array<{
    amount: number;
    currency: string;
    type?: 'value' | 'premium' | 'benefit';
    confidence: number;
    context: string;
  }>;
  legal_references: Array<{
    statute: string;
    section?: string;
    jurisdiction: string;
    confidence: number;
  }>;
}

export interface ExtractedMetadata {
  document_structure: {
    total_pages: number;
    has_signature_page: boolean;
    has_witness_section: boolean;
    has_notarization: boolean;
    sections: Array<{
      title: string;
      page_start: number;
      page_end: number;
      content_type: string;
    }>;
  };
  legal_document_type?: {
    primary_type: string;
    sub_type?: string;
    jurisdiction: string;
    confidence: number;
  };
  expiry_information?: {
    has_expiry: boolean;
    expiry_date?: string;
    renewal_required?: boolean;
    warning_period_days?: number;
  };
  required_actions?: Array<{
    action: string;
    deadline?: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    responsible_party?: string;
  }>;
}

// Will and Estate Planning Object Types
export interface TestatorData {
  personal_info: {
    full_name: string;
    date_of_birth: string;
    place_of_birth?: string;
    citizenship: string;
    marital_status: 'single' | 'married' | 'divorced' | 'widowed' | 'domestic_partnership';
    spouse_name?: string;
    children_count: number;
    occupation?: string;
  };
  contact_info: {
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    phone?: string;
    email?: string;
  };
  identification: {
    type: 'passport' | 'drivers_license' | 'national_id';
    number: string;
    issuing_authority: string;
    expiry_date?: string;
  };
}

export interface BeneficiaryInfo {
  id: string;
  type: 'primary' | 'contingent' | 'residuary';
  name: string;
  relationship: string;
  date_of_birth?: string;
  contact_info?: {
    address?: any;
    phone?: string;
    email?: string;
  };
  share_type: 'percentage' | 'specific_amount' | 'specific_assets' | 'remainder';
  share_value: string; // Could be percentage, amount, or asset description
  conditions?: string[];
  guardian_info?: {
    guardian_name: string;
    relationship: string;
    contact_info: any;
  };
}

export interface AssetInfo {
  id: string;
  type: 'real_estate' | 'bank_account' | 'investment' | 'personal_property' | 'business' | 'vehicle' | 'digital_asset' | 'other';
  description: string;
  value: number;
  currency: string;
  location?: string;
  ownershipPercentage: number;
  joint_owners?: string[];
  encumbrances?: string[];
  special_instructions?: string;
}

export interface ExecutorInfo {
  id: string;
  type: 'primary' | 'alternate' | 'co_executor';
  name: string;
  relationship: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactInfo: any;
  isProfessional: boolean;
  compensation?: string;
  special_powers?: string[];
  limitations?: string[];
}

export interface SpecialInstructions {
  funeral_preferences?: {
    type: 'burial' | 'cremation' | 'donation';
    location?: string;
    specific_wishes?: string;
    ceremony_preferences?: string;
  };
  charitable_bequests?: Array<{
    organization: string;
    amount_type: 'percentage' | 'fixed_amount';
    amount: string;
    purpose?: string;
  }>;
  personal_effects_distribution?: Array<{
    item_description: string;
    recipient: string;
    sentimental_note?: string;
  }>;
  business_succession?: {
    business_name: string;
    succession_plan: string;
    key_personnel?: string[];
  };
  digital_assets?: {
    accounts: Array<{
      platform: string;
      username?: string;
      instructions: string;
    }>;
    general_instructions: string;
  };
  pet_care?: Array<{
    pet_name: string;
    pet_type: string;
    caregiver: string;
    care_fund_amount?: number;
    special_instructions?: string;
  }>;
}

export interface AISuggestion {
  id: string;
  type: 'warning' | 'improvement' | 'optimization' | 'legal_consideration';
  category: string;
  title: string;
  description: string;
  suggested_action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  jurisdiction_specific: boolean;
  legal_references?: string[];
  estimated_cost?: {
    min: number;
    max: number;
    currency: string;
  };
  implementation_timeline?: string;
  created_at: string;
}

// Calendar and Event Object Types
export interface CalendarAttendees {
  family_members: string[]; // Array of family member IDs
  external_contacts: Array<{
    name: string;
    email: string;
    role?: string;
  }>;
  professionals: Array<{
    id: string;
    name: string;
    type: 'attorney' | 'accountant' | 'financial_advisor';
  }>;
}

export interface CalendarReminders {
  email: Array<{
    minutes_before: number;
    recipient_roles: string[];
  }>;
  sms: Array<{
    minutes_before: number;
    recipient_roles: string[];
  }>;
  in_app: Array<{
    minutes_before: number;
    recipient_roles: string[];
  }>;
}

export interface CalendarMetadata {
  created_by_name: string;
  last_modified_by?: string;
  recurrence_exceptions?: string[]; // Array of ISO date strings
  related_documents?: string[];
  meeting_preparation?: {
    required_documents: string[];
    agenda_items: string[];
    pre_meeting_tasks: Array<{
      task: string;
      assignee: string;
      deadline: string;
    }>;
  };
  follow_up_actions?: Array<{
    action: string;
    assignee: string;
    deadline: string;
    completed: boolean;
  }>;
}

// Type guards for runtime validation
export function isValidExtractedEntities(obj: any): obj is ExtractedEntities {
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

export function isValidTestatorData(obj: any): obj is TestatorData {
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

export function isValidBeneficiaryInfo(obj: any): obj is BeneficiaryInfo {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    ['primary', 'contingent', 'residuary'].includes(obj.type) &&
    ['percentage', 'specific_amount', 'specific_assets', 'remainder'].includes(obj.share_type)
  );
}

// Utility functions for type conversion and validation
export function sanitizeJsonField<T>(
  field: any,
  validator: (obj: any) => obj is T,
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

export function ensureArray<T>(value: any): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}

export function ensureObject<T extends Record<string, any>>(
  value: any,
  fallback: T
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ...fallback, ...value };
  }
  return fallback;
}