/**
 * Will and Testament Types for LegacyGuard
 * Handles will creation, validation, and management
 */

export type WillStatus = 'draft' | 'review' | 'completed' | 'witnessed' | 'notarized' | 'archived';
export type WillType = 'simple' | 'detailed' | 'international' | 'trust';
export type BeneficiaryType = 'primary' | 'secondary' | 'contingent' | 'charitable';

export interface Will {
  id: string;
  user_id: string;
  will_type: WillType;
  status: WillStatus;
  version: number;

  // Legal Information
  jurisdiction: string;
  language: string;
  legal_framework: string;

  // Content
  preamble?: string;
  declarations: WillDeclaration[];
  beneficiaries: Beneficiary[];
  asset_distributions: AssetDistribution[];
  guardianship_appointments?: GuardianshipAppointment[];
  executor_appointments: ExecutorAppointment[];
  special_instructions?: SpecialInstruction[];
  funeral_wishes?: FuneralWishes;

  // Signatures & Witnesses
  testator_signature?: Signature;
  witnesses?: WitnessSignature[];
  notary?: NotaryDetails;

  // Metadata
  created_at: string;
  updated_at: string;
  signed_at?: string;
  witnessed_at?: string;
  notarized_at?: string;

  // AI Assistance
  ai_suggestions?: AISuggestion[];
  validation_errors?: ValidationError[];
  completeness_score: number;
}

export interface WillDeclaration {
  id: string;
  type: 'identity' | 'mental_capacity' | 'revocation' | 'family_status' | 'custom';
  content: string;
  is_mandatory: boolean;
  order: number;
}

export interface Beneficiary {
  id: string;
  type: BeneficiaryType;
  full_name: string;
  relationship: string;
  date_of_birth?: string;
  identification?: string;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  share_percentage?: number;
  specific_bequests?: string[];
  conditions?: string;
  alternate_beneficiary_id?: string;
}

export interface AssetDistribution {
  id: string;
  asset_type: 'real_estate' | 'financial' | 'personal' | 'business' | 'digital' | 'other';
  description: string;
  estimated_value?: number;
  currency?: string;
  location?: string;
  beneficiary_ids: string[];
  distribution_type: 'equal' | 'percentage' | 'specific';
  distribution_details: {
    [beneficiary_id: string]: {
      percentage?: number;
      specific_amount?: number;
      conditions?: string;
    };
  };
  special_instructions?: string;
}

export interface GuardianshipAppointment {
  id: string;
  child_name: string;
  child_date_of_birth: string;
  primary_guardian: {
    full_name: string;
    relationship: string;
    contact_info: any;
  };
  alternate_guardian?: {
    full_name: string;
    relationship: string;
    contact_info: any;
  };
  special_instructions?: string;
}

export interface ExecutorAppointment {
  id: string;
  type: 'primary' | 'alternate' | 'co-executor';
  full_name: string;
  relationship: string;
  contact_info: any;
  professional?: boolean;
  compensation?: string;
  powers_granted: string[];
  restrictions?: string[];
}

export interface SpecialInstruction {
  id: string;
  category: 'pets' | 'business' | 'debts' | 'taxes' | 'charity' | 'other';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FuneralWishes {
  type: 'burial' | 'cremation' | 'other';
  location?: string;
  specific_instructions?: string;
  prepaid_arrangements?: boolean;
  provider_details?: string;
  memorial_preferences?: string;
}

export interface Signature {
  signatory_name: string;
  signed_at: string;
  signature_data?: string; // Base64 encoded signature image
  ip_address?: string;
  location?: string;
}

export interface WitnessSignature extends Signature {
  witness_number: number;
  address: string;
  occupation?: string;
  declaration: string;
}

export interface NotaryDetails {
  name: string;
  registration_number: string;
  jurisdiction: string;
  office_address: string;
  seal_number?: string;
  notarization_date: string;
  notarization_location: string;
  fee?: number;
  currency?: string;
}

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'missing' | 'legal_requirement';
  category: string;
  title: string;
  description: string;
  suggested_action?: string;
  priority: 'high' | 'medium' | 'low';
  jurisdiction_specific: boolean;
  created_at: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  legal_reference?: string;
}

// Asset type interfaces for legacy compatibility
export interface RealEstateAsset {
  description: string;
  address: string;
  value?: number;
}

export interface VehicleAsset {
  description: string;
  make?: string;
  model?: string;
  year?: number;
  value?: number;
}

export interface BankAccountAsset {
  description: string;
  bank?: string;
  accountNumber?: string;
  value?: number;
}

export interface PersonalPropertyAsset {
  description: string;
  category?: string;
  value?: number;
}

// Special provisions interface
export interface SpecialProvision {
  id: string;
  type: 'trust' | 'charity' | 'condition' | 'instruction';
  title: string;
  description: string;
  conditions?: string;
  beneficiaryIds?: string[];
}

// Legacy WillData interface for compatibility
export interface WillData extends Will {
  testatorInfo?: {
    fullName: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };

  // Additional testator_data property for component compatibility
  testator_data: {
    fullName: string;
    dateOfBirth: string;
    address: string;
    citizenship?: string;
    maritalStatus?: string;
  };

  // Assets structure for component compatibility
  assets: {
    realEstate?: RealEstateAsset[];
    vehicles?: VehicleAsset[];
    bankAccounts?: BankAccountAsset[];
    personalProperty?: PersonalPropertyAsset[];
  };

  executors?: ExecutorAppointment[];
  specificBequests?: AssetDistribution[];
  residuaryEstate?: {
    beneficiaries: Beneficiary[];
    distribution: string;
  };
  digitalAssets?: {
    included: boolean;
    instructions?: string;
    accessInfo?: string;
  };
  funeralInstructions?: FuneralWishes;
  additionalClauses?: string[];
  witnesses?: WitnessSignature[];
  notarization?: NotaryDetails;
  legalValidation?: {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
  };

  // Special provisions for advanced will features
  specialProvisions?: SpecialProvision[];

  // Guardianship appointments for minor children
  guardianship?: GuardianshipAppointment[];

  // Professional Review System Integration
  professional_review?: ProfessionalReview;
  trust_score?: TrustScore;
  review_eligibility: boolean;
  family_protection_level: 'basic' | 'standard' | 'premium' | 'comprehensive';
}

// Will Builder Types
export interface WillBuilderState {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  currentSection: WillSection;
  will: Partial<Will>;
  validationStatus: ValidationStatus;
}

export type WillSection =
  | 'personal_info'
  | 'beneficiaries'
  | 'assets'
  | 'guardianship'
  | 'executors'
  | 'special_instructions'
  | 'funeral_wishes'
  | 'review'
  | 'signatures';

export interface ValidationStatus {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completeness: number;
  missingRequired: string[];
}

// Professional Network Integration
export interface WillReview {
  id: string;
  will_id: string;
  reviewer_id: string;
  reviewer_type: 'lawyer' | 'notary' | 'financial_advisor';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  review_notes?: string;
  recommendations?: string[];
  fee?: number;
  currency?: string;
  reviewed_at?: string;
}

export interface WillTemplate {
  id: string;
  name: string;
  description: string;
  jurisdiction: string;
  language: string;
  will_type: WillType;
  sections: WillTemplateSection[];
  variables: TemplateVariable[];
  is_active: boolean;
}

export interface WillTemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
  is_mandatory: boolean;
  conditions?: string;
  help_text?: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  default_value?: any;
  options?: { value: string; label: string }[];
  validation_rules?: any;
}

// Professional Review System Types
export interface ProfessionalReviewer {
  id: string;
  name: string;
  credentials: string;
  bar_number?: string;
  jurisdiction: string;
  specializations: string[];
  rating: number; // 1-5 star rating
  reviews_completed: number;
  average_turnaround_hours: number;
  profile_verified: boolean;
}

export interface ProfessionalReview {
  id: string;
  document_id: string;
  reviewer: ProfessionalReviewer;
  status: 'pending' | 'in_review' | 'approved' | 'needs_revision' | 'rejected';
  review_date: string;
  completion_date?: string;
  certification_level: 'basic' | 'premium' | 'legal_certified';
  review_notes?: string;
  recommended_changes?: string[];
  legal_compliance_score: number; // 0-100
  family_protection_score: number; // 0-100
  review_fee?: number;
}

export interface TrustScore {
  overall_score: number; // 0-100
  validation_score: number; // Technical validation
  professional_score: number; // Professional review score
  completeness_score: number; // Document completeness
  family_protection_score: number; // How well it protects family
  last_updated: string;
  factors: TrustFactor[];
}

export interface TrustFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
  improvement_suggestion?: string;
}

// Export functions for will management
export const WILL_VALIDATION_RULES = {
  MIN_WITNESSES: 2,
  MIN_AGE: 18,
  MAX_BENEFICIARIES: 50,
  MAX_EXECUTORS: 4,
} as const;

export const DEFAULT_WILL_TEMPLATE: Partial<Will> = {
  will_type: 'simple',
  status: 'draft',
  version: 1,
  declarations: [],
  beneficiaries: [],
  asset_distributions: [],
  executor_appointments: [],
  completeness_score: 0,
};
