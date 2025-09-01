/**
 * Shared TypeScript Types and Interfaces
 * Central type definitions for the entire LegacyGuard application
 */

// User and Authentication Types
export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  preferences?: UserPreferences
  subscription?: Subscription
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: NotificationSettings
  sofiaMode: 'empathetic' | 'pragmatic' | 'balanced'
  autoSave: boolean
  privacyLevel: 'private' | 'shared' | 'public'
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  reminders: boolean
  updates: boolean
  marketing: boolean
}

// Document Types
export interface Document {
  id: string
  userId: string
  type: DocumentType
  title: string
  content: DocumentContent
  status: DocumentStatus
  category: DocumentCategory
  tags: string[]
  metadata: DocumentMetadata
  encryption?: EncryptionInfo
  sharing?: SharingSettings
  createdAt: Date
  updatedAt: Date
  lastAccessedAt?: Date
}

export type DocumentType =
  | 'will'
  | 'healthcare-directive'
  | 'power-of-attorney'
  | 'digital-assets'
  | 'insurance'
  | 'financial'
  | 'personal-letter'
  | 'emergency-contacts'
  | 'funeral-wishes'
  | 'family-history'

export type DocumentStatus =
  | 'draft'
  | 'complete'
  | 'reviewed'
  | 'shared'
  | 'archived'

export type DocumentCategory =
  | 'legal'
  | 'medical'
  | 'financial'
  | 'personal'
  | 'emergency'
  | 'family'

export interface DocumentContent {
  text?: string
  fields?: Record<string, any>
  attachments?: Attachment[]
  version: number
}

export interface DocumentMetadata {
  wordCount?: number
  completionPercentage: number
  lastReviewDate?: Date
  nextReviewDate?: Date
  importance: 'low' | 'medium' | 'high' | 'critical'
  isTemplate: boolean
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
  encrypted: boolean
}

// Encryption Types
export interface EncryptionInfo {
  algorithm: string
  keyId: string
  encryptedAt: Date
  iv?: string
  salt?: string
}

// Sharing Types
export interface SharingSettings {
  isShared: boolean
  sharedWith: SharedUser[]
  publicLink?: string
  expiresAt?: Date
  permissions: SharingPermission[]
}

export interface SharedUser {
  userId?: string
  email: string
  name?: string
  role: 'viewer' | 'editor' | 'admin'
  sharedAt: Date
  lastAccessed?: Date
}

export type SharingPermission =
  | 'view'
  | 'comment'
  | 'edit'
  | 'share'
  | 'download'
  | 'print'

// Subscription Types
export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: Date
  endDate?: Date
  billingCycle: BillingCycle
  paymentMethod?: PaymentMethod
  usage: SubscriptionUsage
}

export type SubscriptionPlan =
  | 'free'
  | 'premium'
  | 'family'
  | 'enterprise'

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'expired'

export type BillingCycle =
  | 'monthly'
  | 'yearly'
  | 'lifetime'

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface SubscriptionUsage {
  documentsCreated: number
  documentsLimit: number
  storageUsedMB: number
  storageLimitMB: number
  sharesUsed: number
  sharesLimit: number
  aiRequestsUsed: number
  aiRequestsLimit: number
}

// Activity and Analytics Types
export interface UserActivity {
  userId: string
  action: ActivityAction
  resourceType: ResourceType
  resourceId: string
  metadata?: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

export type ActivityAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share'
  | 'download'
  | 'print'
  | 'archive'
  | 'restore'

export type ResourceType =
  | 'document'
  | 'template'
  | 'contact'
  | 'setting'
  | 'subscription'

// Template Types
export interface Template {
  id: string
  name: string
  description: string
  type: DocumentType
  category: DocumentCategory
  content: TemplateContent
  thumbnail?: string
  isPremium: boolean
  usageCount: number
  rating?: number
  createdBy: string
  tags: string[]
}

export interface TemplateContent {
  structure: TemplateField[]
  defaultValues?: Record<string, any>
  validationRules?: ValidationRule[]
}

export interface TemplateField {
  id: string
  name: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  helpText?: string
  options?: FieldOption[]
  validation?: ValidationRule
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email'
  | 'phone'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'signature'

export interface FieldOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message?: string
}

// Contact Types
export interface Contact {
  id: string
  userId: string
  type: ContactType
  name: string
  email?: string
  phone?: string
  address?: Address
  relationship?: string
  isPrimary: boolean
  isEmergency: boolean
  notes?: string
  permissions: SharingPermission[]
  createdAt: Date
  updatedAt: Date
}

export type ContactType =
  | 'beneficiary'
  | 'executor'
  | 'guardian'
  | 'attorney'
  | 'doctor'
  | 'emergency'
  | 'family'
  | 'friend'

export interface Address {
  street1: string
  street2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  metadata?: ResponseMetadata
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export interface ResponseMetadata {
  page?: number
  limit?: number
  total?: number
  hasMore?: boolean
}

// Form Types
export interface FormState<T = any> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// Navigation Types
export interface NavigationItem {
  id: string
  label: string
  icon?: string
  path?: string
  badge?: string | number
  children?: NavigationItem[]
  requiresAuth?: boolean
  requiresPlan?: SubscriptionPlan[]
}

// Export all types from this file
export type { }
