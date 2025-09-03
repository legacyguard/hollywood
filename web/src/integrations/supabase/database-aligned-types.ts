/**
 * Database-Aligned Types
 * TypeScript interfaces that exactly match Supabase database schemas
 */

import type { Database } from './types';

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Direct database types - these exactly match the schema
export type DbFamilyMember = Database['public']['Tables']['family_members']['Row'];
export type DbFamilyMemberInsert = Database['public']['Tables']['family_members']['Insert'];
export type DbFamilyMemberUpdate = Database['public']['Tables']['family_members']['Update'];

export type DbFamilyInvitation = Database['public']['Tables']['family_invitations']['Row'];
export type DbFamilyInvitationInsert = Database['public']['Tables']['family_invitations']['Insert'];
export type DbFamilyInvitationUpdate = Database['public']['Tables']['family_invitations']['Update'];

export type DbEmergencyAccessRequest = Database['public']['Tables']['emergency_access_requests']['Row'];
export type DbEmergencyAccessRequestInsert = Database['public']['Tables']['emergency_access_requests']['Insert'];

export type DbDocumentShare = Database['public']['Tables']['document_shares']['Row'];
export type DbDocumentShareInsert = Database['public']['Tables']['document_shares']['Insert'];

export type DbFamilyActivityLog = Database['public']['Tables']['family_activity_log']['Row'];
export type DbFamilyActivityLogInsert = Database['public']['Tables']['family_activity_log']['Insert'];

export type DbFamilyCalendarEvent = Database['public']['Tables']['family_calendar_events']['Row'];
export type DbFamilyCalendarEventInsert = Database['public']['Tables']['family_calendar_events']['Insert'];

// Properly typed nested objects based on database JSON fields
export interface FamilyMemberPermissions {
  canViewDocuments: boolean;
  canEditDocuments: boolean;
  canDeleteDocuments: boolean;
  canInviteMembers: boolean;
  canManageMembers: boolean;
  canAccessEmergencyInfo: boolean;
  canViewFinancials: boolean;
  canReceiveNotifications: boolean;
  documentCategories: string[];
}

export interface FamilyMemberAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface FamilyMemberPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language?: string;
  timezone?: string;
}

export interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastUsed: string;
  fingerprint: string;
}

// Application-layer types that map from database to business logic
export interface FamilyMember {
  // Direct mappings from database
  id: string;
  familyOwnerId: string;
  userId: string | null;
  email: string;
  name: string;
  role: DbFamilyMember['role'];
  relationship: DbFamilyMember['relationship'];
  permissions: FamilyMemberPermissions;
  isActive: boolean;
  phone: string | null;
  address: FamilyMemberAddress | null;
  dateOfBirth: string | null;
  emergencyContact: boolean;
  accessLevel: DbFamilyMember['access_level'];
  preferences: FamilyMemberPreferences;
  trustedDevices: TrustedDevice[];
  emergencyAccessEnabled: boolean;
  avatarUrl: string | null;
  lastActiveAt: Date | null;
  createdAt: string;
  updatedAt: string;

  // Computed/derived fields for application logic
  status: 'active' | 'inactive' | 'pending';
  invitedAt: Date;
  joinedAt?: Date;
  invitedBy: string;
  emergencyPriority?: number;
  
  // Legacy compatibility fields
  avatar?: string;
  notes?: string;
}

export interface FamilyInvitation {
  // Direct mappings from database
  id: string;
  senderId: string;
  familyMemberId: string;
  email: string;
  token: string;
  status: DbFamilyInvitation['status'];
  message: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  declinedAt: string | null;
  createdAt: string;

  // Computed/derived fields
  name: string; // Will need to be fetched from family_members table
  role: DbFamilyMember['role']; // Will need to be fetched from family_members table
  relationship: DbFamilyMember['relationship']; // Will need to be fetched from family_members table
  invitedAt: Date;
  invitedBy: string;
}

export interface EmergencyAccessRequest {
  // Direct mappings from database
  id: string;
  requesterId: string;
  ownerId: string;
  reason: string;
  status: DbEmergencyAccessRequest['status'];
  requestedAt: string;
  expiresAt: string;
  respondedAt: string | null;
  approverName: string | null;
  approverRelation: string | null;
  accessGrantedUntil: string | null;
  createdAt: string;

  // Computed/derived fields
  requestedBy: string;
  documentsRequested: string[];
  accessDuration: number; // computed from expiry
  verificationMethod: 'sms' | 'email' | 'voice_call';
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Service layer interfaces for better type safety
export interface CreateFamilyMemberRequest {
  email: string;
  name: string;
  role: DbFamilyMember['role'];
  relationship: DbFamilyMember['relationship'];
  permissions?: FamilyMemberPermissions;
  phone?: string;
  address?: FamilyMemberAddress;
  dateOfBirth?: string;
  emergencyContact?: boolean;
  accessLevel?: DbFamilyMember['access_level'];
  preferences?: FamilyMemberPreferences;
}

export interface UpdateFamilyMemberRequest {
  name?: string;
  role?: DbFamilyMember['role'];
  relationship?: DbFamilyMember['relationship'];
  permissions?: FamilyMemberPermissions;
  phone?: string;
  address?: FamilyMemberAddress;
  emergencyContact?: boolean;
  accessLevel?: DbFamilyMember['access_level'];
  isActive?: boolean;
  preferences?: FamilyMemberPreferences;
}

export interface CreateFamilyInvitationRequest {
  email: string;
  name: string;
  role: DbFamilyMember['role'];
  relationship: DbFamilyMember['relationship'];
  message?: string;
  permissions?: FamilyMemberPermissions;
  phone?: string;
  address?: FamilyMemberAddress;
  accessLevel?: DbFamilyMember['access_level'];
}

// Family statistics and analytics types
export interface FamilyStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  totalDocuments: number;
  sharedDocuments: number;
  memberContributions: Record<string, number>;
  documentsByCategory: Record<string, number>;
  recentActivity: FamilyActivity[];
  upcomingEvents: FamilyCalendarEvent[];
  protectionScore: number;
}

export interface FamilyProtectionStatus {
  totalMembers: number;
  activeMembers: number;
  protectionLevel: number; // 0-100 percentage
  documentsShared: number;
  emergencyContactsSet: boolean;
  lastUpdated: Date;
  strengths: string[];
  recommendations: string[];
}

export interface FamilyActivity {
  id: string;
  familyOwnerId: string;
  actorId: string | null;
  actorName: string | null;
  actionType: DbFamilyActivityLog['action_type'];
  targetType: DbFamilyActivityLog['target_type'];
  targetId: string | null;
  details: Record<string, any>;
  createdAt: string;
}

export interface FamilyCalendarEvent {
  id: string;
  familyOwnerId: string;
  createdById: string | null;
  title: string;
  description: string | null;
  eventType: DbFamilyCalendarEvent['event_type'];
  scheduledAt: string;
  durationMinutes: number;
  attendees: Record<string, any>;
  location: string | null;
  meetingUrl: string | null;
  isRecurring: boolean;
  recurrencePattern: string | null;
  recurrenceEndDate: string | null;
  status: DbFamilyCalendarEvent['status'];
  reminders: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Legacy compatibility fields
  date: Date;
  type: 'birthday' | 'anniversary' | 'document_expiry' | 'appointment' | 'milestone' | 'custom';
  createdBy: string;
  notifyMembers: string[];
  priority: 'high' | 'medium' | 'low';
}

// Type guards for runtime type checking
export function isValidFamilyRole(role: string): role is DbFamilyMember['role'] {
  return ['owner', 'co_owner', 'collaborator', 'viewer', 'emergency_contact'].includes(role);
}

export function isValidRelationship(relationship: string): relationship is DbFamilyMember['relationship'] {
  return [
    'spouse', 'parent', 'child', 'sibling', 'grandparent', 'grandchild', 
    'aunt_uncle', 'cousin', 'friend', 'professional', 'other'
  ].includes(relationship);
}

export function isValidAccessLevel(level: string): level is DbFamilyMember['access_level'] {
  return ['view', 'edit', 'admin'].includes(level);
}

// Default permission templates
export const DEFAULT_PERMISSIONS: Record<DbFamilyMember['role'], FamilyMemberPermissions> = {
  owner: {
    canViewDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: true,
    canInviteMembers: true,
    canManageMembers: true,
    canAccessEmergencyInfo: true,
    canViewFinancials: true,
    canReceiveNotifications: true,
    documentCategories: ['all']
  },
  co_owner: {
    canViewDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: true,
    canInviteMembers: true,
    canManageMembers: true,
    canAccessEmergencyInfo: true,
    canViewFinancials: true,
    canReceiveNotifications: true,
    documentCategories: ['all']
  },
  collaborator: {
    canViewDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: false,
    canInviteMembers: false,
    canManageMembers: false,
    canAccessEmergencyInfo: false,
    canViewFinancials: false,
    canReceiveNotifications: true,
    documentCategories: ['will', 'insurance', 'medical']
  },
  viewer: {
    canViewDocuments: true,
    canEditDocuments: false,
    canDeleteDocuments: false,
    canInviteMembers: false,
    canManageMembers: false,
    canAccessEmergencyInfo: false,
    canViewFinancials: false,
    canReceiveNotifications: true,
    documentCategories: ['will', 'medical']
  },
  emergency_contact: {
    canViewDocuments: false,
    canEditDocuments: false,
    canDeleteDocuments: false,
    canInviteMembers: false,
    canManageMembers: false,
    canAccessEmergencyInfo: true,
    canViewFinancials: false,
    canReceiveNotifications: true,
    documentCategories: ['emergency']
  }
};

// Utility functions for type conversion
export function mapDbFamilyMemberToApplication(
  dbMember: DbFamilyMember, 
  familyOwnerId: string
): FamilyMember {
  return {
    // Direct mappings
    id: dbMember.id,
    familyOwnerId: dbMember.family_owner_id,
    userId: dbMember.user_id,
    email: dbMember.email,
    name: dbMember.name,
    role: dbMember.role,
    relationship: dbMember.relationship,
    permissions: (dbMember.permissions as unknown as FamilyMemberPermissions) || DEFAULT_PERMISSIONS[dbMember.role],
    isActive: dbMember.is_active,
    phone: dbMember.phone,
    address: dbMember.address as unknown as FamilyMemberAddress,
    dateOfBirth: dbMember.date_of_birth,
    emergencyContact: dbMember.emergency_contact,
    accessLevel: dbMember.access_level,
    preferences: (dbMember.preferences as unknown as FamilyMemberPreferences) || {},
    trustedDevices: (dbMember.trusted_devices as unknown as TrustedDevice[]) || [],
    emergencyAccessEnabled: dbMember.emergency_access_enabled,
    avatarUrl: dbMember.avatar_url,
    lastActiveAt: dbMember.last_active_at ? new Date(dbMember.last_active_at) : null,
    createdAt: dbMember.created_at,
    updatedAt: dbMember.updated_at,

    // Computed fields
    status: dbMember.is_active ? 'active' : 'inactive',
    invitedAt: new Date(dbMember.created_at),
    joinedAt: dbMember.last_active_at ? new Date(dbMember.last_active_at) : undefined,
    invitedBy: familyOwnerId, // The family owner who added them
    emergencyPriority: dbMember.emergency_contact ? 1 : undefined,
    
    // Legacy compatibility
    avatar: dbMember.avatar_url || undefined,
    notes: undefined, // No notes field in database yet
  };
}

export function mapApplicationToDbFamilyMember(
  familyMember: CreateFamilyMemberRequest,
  familyOwnerId: string
): DbFamilyMemberInsert {
  return {
    family_owner_id: familyOwnerId,
    email: familyMember.email,
    name: familyMember.name,
    role: familyMember.role,
    relationship: familyMember.relationship,
    permissions: (familyMember.permissions || DEFAULT_PERMISSIONS[familyMember.role]) as unknown as Json,
    phone: familyMember.phone || null,
    address: (familyMember.address || null) as unknown as Json,
    date_of_birth: familyMember.dateOfBirth || null,
    emergency_contact: familyMember.emergencyContact || false,
    access_level: familyMember.accessLevel || 'view',
    preferences: (familyMember.preferences || {}) as unknown as Json,
    is_active: true,
    emergency_access_enabled: false,
    trusted_devices: [],
  };
}