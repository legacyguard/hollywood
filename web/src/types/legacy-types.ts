// Legacy types for backward compatibility
// This file provides backward compatibility for old type definitions

import type { LegacyItem } from './database';
import type { Json } from './supabase';

// Backward compatibility types
export interface Will {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  metadata?: Json;
}

export interface Trust {
  id: string;
  userId: string;
  name: string;
  type: string;
  beneficiaries: Json;
  assets: Json;
  status: 'draft' | 'pending' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  metadata?: Json;
}

export interface DocumentForAnalysis {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  content: string;
  metadata?: Json;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface QuickInsight {
  id: string;
  userId: string;
  documentId: string | null;
  type: 'completion_gap' | 'document_analysis' | 'family_impact' | 'protection_level' | 'time_saved' | 'urgent_action';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  impact: string;
  actionText?: string;
  actionUrl?: string;
  actionable: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    calculatedAt: string;
    category: string;
    confidence: number;
    expiresAt?: string;
    tags: string[];
  };
  familyImpact?: {
    affectedMembers: string[];
    emotionalBenefit: string;
    riskReduction: number;
  };
}

export interface LegacyMilestone {
  id: string;
  userId: string;
  category: 'protection' | 'family' | 'professional' | 'foundation' | 'maintenance' | 'mastery';
  title: string;
  description: string;
  criteria: {
    type: string;
    threshold: number;
    currentValue: number;
  };
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  celebration: {
    message: string;
    color: string;
    emotionalFraming: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalReviewer {
  id: string;
  name: string;
  email: string;
  credentials: string;
  specializations: string[];
  jurisdiction: string;
  hourlyRate: number;
  rating: number;
  reviewsCompleted: number;
  availabilityStatus: 'available' | 'busy' | 'unavailable';
  profile: {
    verified: boolean;
    bio: string;
    photoUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  id: string;
  userId: string;
  documentId: string;
  professionalId: string;
  reviewType: 'basic' | 'certified' | 'comprehensive';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentReview {
  id: string;
  userId: string;
  documentId: string;
  professionalId: string;
  reviewType: 'basic' | 'certified' | 'comprehensive';
  score: number;
  findings: Json;
  recommendations: Json;
  complianceScore: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  reviewDate: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  userId: string;
  professionalId: string;
  consultationType: 'initial_consultation' | 'document_review' | 'estate_planning' | 'family_planning';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  durationMinutes: number;
  cost: number;
  consultationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  age: number;
  role: string;
  contactInfo: Json;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFinding {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  location?: string;
}

export interface ReviewRecommendation {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action: string;
  deadline?: string;
  estimatedCost?: number;
}

// Type conversion utilities
export function legacyItemToWill(item: LegacyItem): Will {
  return {
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.description || '',
    status: item.status as any,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
    metadata: item.metadata ? (typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata) : undefined
  };
}

export function willToLegacyItem(will: Will): LegacyItem {
  return {
    id: will.id,
    user_id: will.userId,
    title: will.title,
    description: will.content,
    category: 'will',
    status: will.status,
    created_at: will.createdAt,
    updated_at: will.updatedAt,
    metadata: will.metadata ? JSON.stringify(will.metadata) : null,
    priority: 'medium',
    tags: [],
    file_urls: [],
    is_public: false,
    due_date: null
  };
}

export function legacyItemToTrust(item: LegacyItem): Trust {
  const metadata = item.metadata ? (typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata) : {};
  return {
    id: item.id,
    userId: item.user_id,
    name: item.title,
    type: metadata.type || 'revocable',
    beneficiaries: metadata.beneficiaries || [],
    assets: metadata.assets || [],
    status: item.status as any,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
    metadata
  };
}

export function trustToLegacyItem(trust: Trust): LegacyItem {
  return {
    id: trust.id,
    user_id: trust.userId,
    title: trust.name,
    description: JSON.stringify({
      type: trust.type,
      beneficiaries: trust.beneficiaries,
      assets: trust.assets
    }),
    category: 'trust',
    status: trust.status,
    created_at: trust.createdAt,
    updated_at: trust.updatedAt,
    metadata: trust.metadata ? JSON.stringify(trust.metadata) : null,
    priority: 'medium',
    tags: [],
    file_urls: [],
    is_public: false,
    due_date: null
  };
}

// Document conversion utilities
export function legacyItemToDocumentForAnalysis(item: LegacyItem): DocumentForAnalysis {
  const metadata = item.metadata ? (typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata) : {};
  return {
    id: item.id,
    name: item.title,
    type: item.category,
    category: item.category,
    status: item.status,
    content: item.description || '',
    metadata,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
    userId: item.user_id
  };
}

export function documentForAnalysisToLegacyItem(doc: DocumentForAnalysis): LegacyItem {
  return {
    id: doc.id,
    user_id: doc.userId,
    title: doc.name,
    description: doc.content,
    category: doc.category,
    status: doc.status,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    metadata: doc.metadata ? JSON.stringify(doc.metadata) : null,
    priority: 'medium',
    tags: [],
    file_urls: [],
    is_public: false,
    due_date: null
  };
}

// Safe JSON utilities
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

// Safe date utilities
export function safeDateParse(date: string | null | undefined): Date | null {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateForDatabase(date: Date): string {
  return date.toISOString();
}

// Type guards
export function isValidLegacyItemCategory(category: string): boolean {
  const validCategories = [
    'will', 'trust', 'power_of_attorney', 'healthcare_directive',
    'insurance', 'financial', 'property', 'business', 'digital',
    'personal', 'other'
  ];
  return validCategories.includes(category);
}

export function isValidLegacyItemStatus(status: string): boolean {
  const validStatuses = ['draft', 'pending', 'completed', 'archived'];
  return validStatuses.includes(status);
}

export function isValidLegacyItemPriority(priority: string): boolean {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  return validPriorities.includes(priority);
}

// Export all utilities
export const LegacyTypes = {
  legacyItemToWill,
  willToLegacyItem,
  legacyItemToTrust,
  trustToLegacyItem,
  legacyItemToDocumentForAnalysis,
  documentForAnalysisToLegacyItem,
  safeJsonParse,
  safeJsonStringify,
  safeDateParse,
  formatDateForDatabase,
  isValidLegacyItemCategory,
  isValidLegacyItemStatus,
  isValidLegacyItemPriority
};

export default LegacyTypes;