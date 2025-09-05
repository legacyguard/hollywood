// Centralized database type definitions
import type { Database } from './supabase';

// Legacy item types (unified schema)
export type LegacyItem = Database['public']['Tables']['legacy_items']['Row'];
export type LegacyItemInsert = Database['public']['Tables']['legacy_items']['Insert'];
export type LegacyItemUpdate = Database['public']['Tables']['legacy_items']['Update'];

// Profile types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Document types
export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

// Legacy item categories and status
export const LEGACY_ITEM_CATEGORIES = [
  'will',
  'trust',
  'power_of_attorney',
  'healthcare_directive',
  'insurance',
  'financial',
  'property',
  'business',
  'digital',
  'personal',
  'other'
] as const;

export const LEGACY_ITEM_STATUS = [
  'draft',
  'pending',
  'completed',
  'archived'
] as const;

export const LEGACY_ITEM_PRIORITY = [
  'low',
  'medium',
  'high',
  'urgent'
] as const;

export type LegacyItemCategory = typeof LEGACY_ITEM_CATEGORIES[number];
export type LegacyItemStatus = typeof LEGACY_ITEM_STATUS[number];
export type LegacyItemPriority = typeof LEGACY_ITEM_PRIORITY[number];

// Helper type for converting snake_case to camelCase
export type CamelCase<T> = T extends string
  ? T extends `${infer P1}_${infer P2}${infer P3}`
    ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
    : T
  : T;

// Type for handling both snake_case and camelCase property access
export type FlexibleLegacyItem = LegacyItem & {
  // camelCase aliases for snake_case properties
  createdAt?: string | null;
  updatedAt?: string | null;
  dueDate?: string | null;
  fileUrls?: string[] | null;
  isPublic?: boolean | null;
  userId?: string;
};

// Type guards for legacy items
export function isLegacyItem(item: any): item is LegacyItem {
  return item && typeof item === 'object' && 'id' in item && 'category' in item;
}

export function isLegacyItemCategory(category: string): category is LegacyItemCategory {
  return LEGACY_ITEM_CATEGORIES.includes(category as LegacyItemCategory);
}

export function isLegacyItemStatus(status: string): status is LegacyItemStatus {
  return LEGACY_ITEM_STATUS.includes(status as LegacyItemStatus);
}

export function isLegacyItemPriority(priority: string): priority is LegacyItemPriority {
  return LEGACY_ITEM_PRIORITY.includes(priority as LegacyItemPriority);
}

// Helper functions for property conversion
export function toCamelCase<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export function toSnakeCase<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

// Type for handling flexible property access
export type Flexible<T> = T & {
  [K in keyof T as K extends string ? CamelCase<K> : K]: T[K];
};

// Database helper types
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? U : never;
export type DbResultErr = any; // PostgrestError

// Error handling
export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Query result types
export type QueryResult<T> = {
  data: T | null;
  error: DatabaseError | null;
  loading: boolean;
};

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface LegacyItemFilters {
  category?: LegacyItemCategory;
  status?: LegacyItemStatus;
  priority?: LegacyItemPriority;
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Sorting types
export interface SortOptions {
  field: keyof LegacyItem;
  direction: 'asc' | 'desc';
}

// Common query parameters
export interface QueryOptions {
  filters?: LegacyItemFilters;
  sort?: SortOptions;
  pagination?: PaginationOptions;
}

// Type for handling partial updates
export type PartialUpdate<T> = Partial<T> & { id: string };

// Type for handling JSON data safely
export type SafeJson<T = any> = T | null | undefined;

// Type for handling arrays safely
export type SafeArray<T> = T[] | null | undefined;

// Type for handling dates safely
export type SafeDate = string | null | undefined;

// Type for handling enums safely
export type SafeEnum<T extends string> = T | null | undefined;

// Type for handling relationships
export interface LegacyItemWithRelations extends LegacyItem {
  profile?: Profile;
  documents?: Document[];
}

// Type for handling file uploads
export interface FileUpload {
  file: File;
  path: string;
  metadata?: Record<string, any>;
}

// Type for handling batch operations
export interface BatchOperation<T> {
  items: T[];
  operation: 'create' | 'update' | 'delete';
}

// Type for handling real-time updates
export interface RealtimeUpdate<T> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: T;
  old_record?: T;
}

// Type for handling subscription events
export interface SubscriptionEvent<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: T | null;
}

// Type for handling cache updates
export interface CacheUpdate<T> {
  key: string;
  data: T;
  timestamp: number;
}

// Type for handling optimistic updates
export interface OptimisticUpdate<T> {
  id: string;
  data: Partial<T>;
  timestamp: number;
}

// Type for handling error states
export interface ErrorState {
  error: DatabaseError | null;
  retryCount: number;
  lastRetry: number | null;
}

// Type for handling loading states
export interface LoadingState {
  loading: boolean;
  progress?: number;
  message?: string;
}

// Type for handling success states
export interface SuccessState<T> {
  data: T;
  message?: string;
  timestamp: number;
}

// Type for handling safe JSON operations
export function safeJsonParse<T>(json: string | null | undefined): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function safeJsonStringify(obj: any): string | null {
  try {
    return JSON.stringify(obj);
  } catch {
    return null;
  }
}

// Type for handling date operations
export function safeDateParse(date: string | null | undefined): Date | null {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Type for handling array operations
export function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : [];
}

// Type for handling enum operations
export function safeEnum<T extends string>(
  value: string | null | undefined,
  validValues: readonly T[]
): T | null {
  if (!value) return null;
  return validValues.includes(value as T) ? (value as T) : null;
}


// Type for handling nullable properties
export type Nullable<T> = T | null;

// Type for handling optional properties
export type Optional<T> = T | undefined;

// Type for handling required properties
export type Required<T> = T extends null | undefined ? never : T;

// Type for handling partial with required id
export type PartialWithId<T> = Partial<T> & { id: string };

// Type for handling update operations
export type UpdateOperation<T> = {
  id: string;
  updates: Partial<T>;
  timestamp: number;
};

// Type for handling create operations
export type CreateOperation<T> = {
  data: T;
  timestamp: number;
};

// Type for handling delete operations
export type DeleteOperation = {
  id: string;
  timestamp: number;
};

// Type for handling batch operations
export type BatchOperations<T> = {
  creates?: CreateOperation<T>[];
  updates?: UpdateOperation<T>[];
  deletes?: DeleteOperation[];
};

// Type for handling query builders
export type QueryBuilder<T> = {
  select: (columns?: string) => any;
  insert: (values: Partial<T>[]) => any;
  update: (values: Partial<T>) => any;
  delete: () => any;
  eq: (column: string, value: any) => QueryBuilder<T>;
  neq: (column: string, value: any) => QueryBuilder<T>;
  gt: (column: string, value: any) => QueryBuilder<T>;
  gte: (column: string, value: any) => QueryBuilder<T>;
  lt: (column: string, value: any) => QueryBuilder<T>;
  lte: (column: string, value: any) => QueryBuilder<T>;
  like: (column: string, pattern: string) => QueryBuilder<T>;
  ilike: (column: string, pattern: string) => QueryBuilder<T>;
  is: (column: string, value: any) => QueryBuilder<T>;
  in: (column: string, values: any[]) => QueryBuilder<T>;
  contains: (column: string, value: any) => QueryBuilder<T>;
  containedBy: (column: string, value: any) => QueryBuilder<T>;
  rangeGt: (column: string, range: any) => QueryBuilder<T>;
  rangeGte: (column: string, range: any) => QueryBuilder<T>;
  rangeLt: (column: string, range: any) => QueryBuilder<T>;
  rangeLte: (column: string, range: any) => QueryBuilder<T>;
  rangeAdjacent: (column: string, range: any) => QueryBuilder<T>;
  overlaps: (column: string, range: any) => QueryBuilder<T>;
  textSearch: (column: string, query: string) => QueryBuilder<T>;
  match: (query: any) => QueryBuilder<T>;
  not: (query: any) => QueryBuilder<T>;
  or: (filters: any[]) => QueryBuilder<T>;
  and: (filters: any[]) => QueryBuilder<T>;
  order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => QueryBuilder<T>;
  limit: (count: number) => QueryBuilder<T>;
  range: (from: number, to: number) => QueryBuilder<T>;
  single: () => QueryBuilder<T>;
  maybeSingle: () => QueryBuilder<T>;
  csv: () => QueryBuilder<T>;
};

// Type for handling database operations
export interface DatabaseOperations {
  legacyItems: {
    create: (item: LegacyItemInsert) => Promise<LegacyItem>;
    read: (id: string) => Promise<LegacyItem | null>;
    update: (id: string, updates: LegacyItemUpdate) => Promise<LegacyItem>;
    delete: (id: string) => Promise<void>;
    list: (options?: QueryOptions) => Promise<PaginatedResult<LegacyItem>>;
  };
  profiles: {
    create: (profile: ProfileInsert) => Promise<Profile>;
    read: (id: string) => Promise<Profile | null>;
    update: (id: string, updates: ProfileUpdate) => Promise<Profile>;
    delete: (id: string) => Promise<void>;
  };
  documents: {
    create: (document: DocumentInsert) => Promise<Document>;
    read: (id: string) => Promise<Document | null>;
    update: (id: string, updates: DocumentUpdate) => Promise<Document>;
    delete: (id: string) => Promise<void>;
    list: (userId: string) => Promise<Document[]>;
  };
}

// Type for handling migration operations
export interface MigrationOperations {
  migrateFromLegacy: (oldData: any) => LegacyItem;
  migrateToLegacy: (newData: LegacyItem) => any;
  validateMigration: (oldData: any, newData: LegacyItem) => boolean;
}

// Type for handling validation
export interface ValidationRules<T> {
  required?: (keyof T)[];
  optional?: (keyof T)[];
  custom?: Record<string, (value: any) => boolean>;
}

// Type for handling error handling
export interface ErrorHandler {
  handleError: (error: any) => DatabaseError;
  retry: (operation: () => Promise<any>, maxRetries?: number) => Promise<any>;
}

// Type for handling logging
export interface Logger {
  log: (message: string, data?: any) => void;
  error: (message: string, error?: any) => void;
  warn: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
}

// Type for handling performance
export interface PerformanceMetrics {
  queryTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
}

// Type for handling caching
export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'lfu';
}

// Type for handling rate limiting
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests: boolean;
}

// Type for handling security
export interface SecurityConfig {
  encryptionKey: string;
  saltRounds: number;
  jwtSecret: string;
  corsOrigins: string[];
}

// Type for handling configuration
export interface AppConfig {
  database: {
    url: string;
    poolSize: number;
    timeout: number;
  };
  cache: CacheConfig;
  rateLimit: RateLimitConfig;
  security: SecurityConfig;
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
  };
}

// Export everything
export * from './supabase';