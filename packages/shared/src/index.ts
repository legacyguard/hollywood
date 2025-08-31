// Export all services
export * from './services/auth.service';
export * from './services/encryption.service';
export * from './services/sync.service';
export * from './services/freemium.service';
export * from './services/subscription.service';
export * from './services/stripe.service';
export { DocumentService } from './services/documentService';
export type { Document } from './services/documentService';

// Export Supabase client
export * from './supabase/client';

// Export types
export type {
  SubscriptionPlan,
  SubscriptionStatus,
  BillingCycle,
  UserSubscription,
  UserUsage,
  SubscriptionLimits,
  UsageType
} from './services/subscription.service';

export type {
  SyncStatus,
  SyncConflictResolution
} from './services/sync.service';

export type {
  FreemiumFeature,
  FreemiumPlan,
  FreemiumLimits
} from './services/freemium.service';
