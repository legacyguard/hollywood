/**
 * LegacyGuard Type Definitions
 * Centralized type definitions for the entire application
 */

// Import Supabase types for database operations
import type { Database } from '../integrations/supabase/types';

export type ProfessionalReviewer = Database['public']['Tables']['professional_reviewers']['Row'];
export type ProfessionalReviewerInsert = Database['public']['Tables']['professional_reviewers']['Insert'];
export type ProfessionalReviewerUpdate = Database['public']['Tables']['professional_reviewers']['Update'];

// Base types
export type UUID = string;
export type ISO8601Date = string;
export type Currency = string;

// User types
export interface User {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface PrivacySettings {
  shareWithFamily: boolean;
  shareWithProfessionals: boolean;
  dataRetention: number;
}

// Estate planning types
export interface EstatePlan {
  id: UUID;
  userId: UUID;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  documents: Document[];
  beneficiaries: Beneficiary[];
  assets: Asset[];
}

export interface Document {
  id: UUID;
  estatePlanId: UUID;
  type: DocumentType;
  name: string;
  fileUrl?: string;
  content?: string;
  status: 'draft' | 'reviewed' | 'signed' | 'archived';
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  metadata: DocumentMetadata;
}

export type DocumentType =
  | 'will'
  | 'power_of_attorney'
  | 'living_will'
  | 'trust'
  | 'insurance_policy'
  | 'property_deed'
  | 'bank_statement'
  | 'investment_statement'
  | 'other';

export interface DocumentMetadata {
  fileSize?: number;
  mimeType?: string;
  encryptionKey?: string;
  checksum?: string;
  version: number;
  lastModifiedBy?: UUID;
}

// Asset types
export interface Asset {
  id: UUID;
  estatePlanId: UUID;
  type: AssetType;
  name: string;
  description?: string;
  value: number;
  currency: Currency;
  location?: string;
  ownership: OwnershipDetails;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
}

export type AssetType =
  | 'real_estate'
  | 'bank_account'
  | 'investment'
  | 'vehicle'
  | 'jewelry'
  | 'art'
  | 'cryptocurrency'
  | 'business'
  | 'insurance'
  | 'other';

export interface OwnershipDetails {
  owner: string;
  percentage: number;
  coOwners?: CoOwner[];
}

export interface CoOwner {
  name: string;
  percentage: number;
}

// Beneficiary types
export interface Beneficiary {
  id: UUID;
  estatePlanId: UUID;
  type: BeneficiaryType;
  name: string;
  email?: string;
  phone?: string;
  relationship: string;
  allocation: AllocationDetails;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
}

export type BeneficiaryType = 'individual' | 'organization' | 'trust';

export interface AllocationDetails {
  type: 'percentage' | 'fixed_amount' | 'specific_asset';
  value: number;
  assetId?: UUID;
  conditions?: string[];
}

// Professional specialization types
export interface ProfessionalSpecialization {
  id: string;
  name: string;
  category: string;
}

// Professional network types - Domain model for business logic
export interface ProfessionalReviewerDTO {
  id: UUID;
  userId: UUID;
  email: string; // Email address for notifications
  fullName: string; // Full name for display and notifications
  type: ProfessionalType;
  licenseNumber: string;
  jurisdiction: string;
  specializations: ProfessionalSpecialization[];
  experience: number;
  verified: boolean;
  onboardingStatus: OnboardingStatus;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  // Extended properties for component compatibility
  full_name: string; // Alias for fullName
  professional_title?: string;
  law_firm_name?: string;
  bio?: string;
  hourly_rate?: number;
  experience_years: number; // Alias for experience
  licensed_states?: string[];
  profile_image_url?: string;
  bar_number?: string; // Alias for licenseNumber
  verification_status?: string;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: ISO8601Date; // Alias for createdAt
  user_id?: string; // Alias for userId
  updated_at?: ISO8601Date; // Alias for updatedAt
}

export type ProfessionalType = 'attorney' | 'notary' | 'financial_advisor' | 'estate_planner' | 'tax_advisor';

export type OnboardingStatus =
  | 'pending'
  | 'documents_submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

// Mapper function to convert Supabase type to domain type
export function mapSupabaseToDomainReviewer(
  supabaseReviewer: ProfessionalReviewer
): ProfessionalReviewerDTO {
  const experience = calculateExperience(supabaseReviewer.reviews_completed);
  const fullName = supabaseReviewer.name;
  
  return {
    id: supabaseReviewer.id,
    userId: supabaseReviewer.contact_email, // Map contact_email to userId for domain logic
    email: supabaseReviewer.contact_email, // Use contact_email as email
    fullName,
    type: mapCredentialsToType(supabaseReviewer.credentials),
    licenseNumber: supabaseReviewer.bar_number || '',
    jurisdiction: supabaseReviewer.jurisdiction,
    specializations: (supabaseReviewer.specializations || []).map((spec, index) => ({
      id: `${index}`,
      name: spec,
      category: mapSpecializationToCategory(spec)
    })),
    experience,
    verified: supabaseReviewer.profile_verified,
    onboardingStatus: mapVerificationToOnboardingStatus(supabaseReviewer.profile_verified),
    createdAt: supabaseReviewer.created_at,
    updatedAt: supabaseReviewer.updated_at,
    // Extended properties for component compatibility
    full_name: fullName,
    professional_title: supabaseReviewer.credentials,
    law_firm_name: undefined, // Not available in current schema
    bio: undefined, // Not available in current schema
    hourly_rate: undefined, // Not available in current schema
    experience_years: experience,
    licensed_states: [supabaseReviewer.jurisdiction], // Use jurisdiction as licensed state
    profile_image_url: undefined, // Not available in current schema
    bar_number: supabaseReviewer.bar_number,
    verification_status: supabaseReviewer.profile_verified ? 'verified' : 'pending',
    status: supabaseReviewer.profile_verified ? 'active' : 'inactive',
    created_at: supabaseReviewer.created_at,
  };
}

// Mapper function to convert domain type to Supabase type
export function mapDomainToSupabaseReviewer(
  domainReviewer: ProfessionalReviewerDTO
): Omit<ProfessionalReviewerInsert, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: `${domainReviewer.userId}`, // Map userId to name field
    credentials: mapTypeToCredentials(domainReviewer.type),
    bar_number: domainReviewer.licenseNumber,
    jurisdiction: domainReviewer.jurisdiction,
    specializations: domainReviewer.specializations,
    rating: 0, // Default value
    reviews_completed: 0, // Default value
    average_turnaround_hours: 24, // Default value
    profile_verified: domainReviewer.verified,
    contact_email: domainReviewer.userId, // Map userId to contact_email
  };
}

// Helper functions for mapping
function mapCredentialsToType(credentials: string): ProfessionalType {
  if (credentials.toLowerCase().includes('attorney') || credentials.toLowerCase().includes('lawyer')) {
    return 'attorney';
  } else if (credentials.toLowerCase().includes('notary')) {
    return 'notary';
  } else if (credentials.toLowerCase().includes('financial') || credentials.toLowerCase().includes('advisor')) {
    return 'financial_advisor';
  } else if (credentials.toLowerCase().includes('estate') || credentials.toLowerCase().includes('planner')) {
    return 'estate_planner';
  } else if (credentials.toLowerCase().includes('tax')) {
    return 'tax_advisor';
  }
  return 'attorney'; // Default fallback
}

function mapTypeToCredentials(type: ProfessionalType): string {
  switch (type) {
    case 'attorney':
      return 'Attorney at Law';
    case 'notary':
      return 'Notary Public';
    case 'financial_advisor':
      return 'Financial Advisor';
    case 'estate_planner':
      return 'Estate Planning Specialist';
    case 'tax_advisor':
      return 'Tax Advisor';
    default:
      return 'Legal Professional';
  }
}

function calculateExperience(reviewsCompleted: number): number {
  // Simple heuristic: assume each review represents some experience
  return Math.max(1, Math.floor(reviewsCompleted / 10));
}

function mapVerificationToOnboardingStatus(verified: boolean): OnboardingStatus {
  return verified ? 'approved' : 'pending';
}

function mapSpecializationToCategory(specialization: string): string {
  const spec = specialization.toLowerCase();
  if (spec.includes('estate') || spec.includes('will') || spec.includes('trust')) {
    return 'estate_planning';
  } else if (spec.includes('tax')) {
    return 'tax_law';
  } else if (spec.includes('business') || spec.includes('corporate')) {
    return 'business_law';
  } else if (spec.includes('family') || spec.includes('divorce')) {
    return 'family_law';
  } else if (spec.includes('real estate') || spec.includes('property')) {
    return 'real_estate';
  }
  return 'general';
}

export interface ReviewRequest {
  id: UUID;
  estatePlanId: UUID;
  reviewerId: UUID;
  type: ReviewType;
  status: ReviewStatus;
  priority: Priority;
  documents: UUID[];
  notes?: string;
  deadline?: ISO8601Date;
  createdAt: ISO8601Date;
}

export type ReviewType = 'legal' | 'financial' | 'medical' | 'technical' | 'compliance';
export type ReviewStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'needs_revision';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Professional Profile - used by directory components
export interface ProfessionalProfile extends ProfessionalReviewerDTO {
  availability?: 'available' | 'busy' | 'unavailable';
}

// Professional Review types
export type ProfessionalReview = Database['public']['Tables']['professional_reviews']['Row'];

export interface DocumentShare {
  id: string;
  document_id: string;
  shared_with: string;
  permissions: SharePermissions;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SharePermissions {
  view: boolean;
  edit: boolean;
  download: boolean;
}

// Search result type for QuickSearch
export interface QuickSearchResult {
  id: string;
  type: 'document' | 'action' | 'guardian';
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: ISO8601Date;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: ISO8601Date;
  version: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface FormValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'custom';
}

export interface FormState<T> {
  data: T;
  errors: FormValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export interface AppEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: ISO8601Date;
  userId?: UUID;
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  auth: {
    sessionTimeout: number;
    refreshTokenInterval: number;
  };
  storage: {
    encryptionKey: string;
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
  features: {
    enableProfessionalNetwork: boolean;
    enableRealTimeUpdates: boolean;
    enableOfflineMode: boolean;
  };
}

// Webhook types
export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: ISO8601Date;
  signature: string;
}

// Search types
export interface SearchFilters {
  query?: string;
  type?: string[];
  status?: string[];
  dateFrom?: ISO8601Date;
  dateTo?: ISO8601Date;
  tags?: string[];
}

export interface SearchResult<T> {
  item: T;
  score: number;
  highlights: Record<string, string[]>;
}
