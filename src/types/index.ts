/**
 * LegacyGuard Type Definitions
 * Centralized type definitions for the entire application
 */

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

// Professional network types
export interface ProfessionalReviewer {
  id: UUID;
  userId: UUID;
  type: ProfessionalType;
  licenseNumber: string;
  jurisdiction: string;
  specializations: string[];
  experience: number;
  verified: boolean;
  onboardingStatus: OnboardingStatus;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
}

export type ProfessionalType = 'attorney' | 'notary' | 'financial_advisor' | 'estate_planner' | 'tax_advisor';

export type OnboardingStatus =
  | 'pending'
  | 'documents_submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

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
  updatedAt: ISO8601Date;
}

export type ReviewType = 'legal_review' | 'financial_review' | 'compliance_review' | 'final_review';
export type ReviewStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'needs_revision';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

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
  details?: Record<string, any>;
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
  filters?: Record<string, any>;
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
  payload: Record<string, any>;
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
  data: Record<string, any>;
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
