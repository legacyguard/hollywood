/**
 * Type adapters to convert between database types and application types
 * This helps bridge the gap between Supabase database schema and application interfaces
 */

import type {
  FamilyActivity as DbFamilyActivity,
  FamilyCalendarEvent as DbFamilyCalendarEvent,
  FamilyMember as DbFamilyMember,
  FamilyStats as DbFamilyStats,
} from '@/integrations/supabase/database-aligned-types';
import type {
  FamilyActivity,
  FamilyCalendarEvent,
  FamilyMember,
  FamilyMemberStatus,
  FamilyRole,
  FamilyStats,
  RelationshipType,
} from '@/types/family';

/**
 * Convert database FamilyMember to application FamilyMember
 */
export function adaptDbFamilyMemberToApp(
  dbMember: DbFamilyMember
): FamilyMember {
  return {
    id: dbMember.id,
    email: dbMember.email,
    name: dbMember.name,
    role: dbMember.role as FamilyRole,
    relationship: dbMember.relationship as RelationshipType,
    status: (dbMember.isActive ? 'active' : 'inactive') as FamilyMemberStatus,
    avatar: dbMember.avatarUrl || undefined,
    phone: dbMember.phone,
    address: dbMember.address
      ? {
          street: dbMember.address.street,
          city: dbMember.address.city,
          state: dbMember.address.state,
          postalCode: dbMember.address.postalCode,
          country: dbMember.address.country,
        }
      : undefined,
    invitedAt: new Date(dbMember.createdAt),
    joinedAt: dbMember.lastActiveAt
      ? new Date(dbMember.lastActiveAt)
      : undefined,
    lastActiveAt: dbMember.lastActiveAt
      ? new Date(dbMember.lastActiveAt)
      : undefined,
    invitedBy: dbMember.familyOwnerId, // Assuming family owner is the inviter
    permissions: {
      canViewDocuments: dbMember.permissions.canViewDocuments,
      canEditDocuments: dbMember.permissions.canEditDocuments,
      canDeleteDocuments: dbMember.permissions.canDeleteDocuments,
      canInviteMembers: dbMember.permissions.canInviteMembers,
      canManageMembers: dbMember.permissions.canManageMembers,
      canAccessEmergencyInfo: dbMember.permissions.canAccessEmergencyInfo,
      canViewFinancials: dbMember.permissions.canViewFinancials,
      canReceiveNotifications: dbMember.permissions.canReceiveNotifications,
    },
    emergencyPriority: dbMember.emergencyContact ? 1 : undefined,
  };
}

/**
 * Convert database FamilyActivity to application FamilyActivity
 */
export function adaptDbFamilyActivityToApp(
  dbActivity: DbFamilyActivity
): FamilyActivity {
  return {
    id: dbActivity.id,
    familyOwnerId: dbActivity.familyOwnerId,
    actorId: dbActivity.actorId,
    actorName: dbActivity.actorName,
    actionType: dbActivity.actionType,
    targetType: dbActivity.targetType,
    targetId: dbActivity.targetId,
    details: dbActivity.details,
    createdAt: dbActivity.createdAt,
  };
}

/**
 * Convert database FamilyCalendarEvent to application FamilyCalendarEvent
 */
export function adaptDbFamilyCalendarEventToApp(
  dbEvent: DbFamilyCalendarEvent
): FamilyCalendarEvent {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    date: new Date(dbEvent.scheduledAt),
    type: dbEvent.eventType as
      | 'anniversary'
      | 'appointment'
      | 'birthday'
      | 'custom'
      | 'document_expiry'
      | 'milestone',
    relatedDocumentId: dbEvent.relatedDocumentId,
    relatedMemberId: dbEvent.relatedMemberId,
    createdBy: dbEvent.createdBy,
    notifyMembers: dbEvent.notifyMembers || [],
    recurring: dbEvent.isRecurring
      ? {
          frequency:
            (dbEvent.recurrencePattern as 'monthly' | 'weekly' | 'yearly') ||
            'yearly',
          endDate: dbEvent.recurrenceEndDate
            ? new Date(dbEvent.recurrenceEndDate)
            : undefined,
        }
      : undefined,
    priority: (dbEvent.priority as 'high' | 'low' | 'medium') || 'medium',
  };
}

/**
 * Convert database FamilyStats to application FamilyStats
 */
export function adaptDbFamilyStatsToApp(dbStats: DbFamilyStats): FamilyStats {
  return {
    totalMembers: dbStats.totalMembers,
    activeMembers: dbStats.activeMembers,
    pendingInvitations: dbStats.pendingInvitations,
    totalDocuments: dbStats.totalDocuments,
    sharedDocuments: dbStats.sharedDocuments,
    recentActivity: dbStats.recentActivity.map(adaptDbFamilyActivityToApp),
    upcomingEvents: dbStats.upcomingEvents.map(adaptDbFamilyCalendarEventToApp),
    lastUpdated: new Date(dbStats.lastUpdated),
    strengths: dbStats.strengths,
    recommendations: dbStats.recommendations,
  };
}

/**
 * Convert application FamilyMember to database FamilyMember (for updates)
 */
export function adaptAppFamilyMemberToDb(
  appMember: Partial<FamilyMember>
): Partial<DbFamilyMember> {
  return {
    name: appMember.name,
    role: appMember.role as any,
    relationship: appMember.relationship as any,
    isActive: appMember.status === 'active',
    phone: appMember.phone,
    address: appMember.address
      ? {
          street: appMember.address.street,
          city: appMember.address.city,
          state: appMember.address.state,
          postalCode: appMember.address.postalCode,
          country: appMember.address.country,
        }
      : null,
    emergencyContact: !!appMember.emergencyPriority,
  };
}

/**
 * Convert application FamilyCalendarEvent to database FamilyCalendarEvent (for creation/updates)
 */
export function adaptAppFamilyCalendarEventToDb(
  appEvent: Partial<FamilyCalendarEvent>
): Partial<DbFamilyCalendarEvent> {
  return {
    title: appEvent.title,
    description: appEvent.description,
    eventType: appEvent.eventType,
    scheduledAt: appEvent.scheduledAt?.toISOString(),
    durationMinutes: appEvent.durationMinutes,
    location: appEvent.location,
    meetingUrl: appEvent.meetingUrl,
    attendees: appEvent.attendees,
    isRecurring: appEvent.isRecurring,
    recurrencePattern: appEvent.recurrencePattern,
    recurrenceEndDate: appEvent.recurrenceEndDate?.toISOString(),
    notifyMembers: appEvent.notifyMembers,
    priority: appEvent.priority,
  };
}

/**
 * Convert database Document to application Document
 */
export function adaptDbDocumentToApp(dbDoc: any): any {
  return {
    id: dbDoc.id,
    title: dbDoc.file_name,
    file_name: dbDoc.file_name,
    file_size: dbDoc.file_size,
    created_at: dbDoc.created_at,
    expires_at: dbDoc.expires_at,
    category: dbDoc.document_type,
    tags: dbDoc.tags || [],
    file_url: dbDoc.file_path,
    ocr_confidence: dbDoc.ocr_confidence,
    is_important: dbDoc.is_important,
    description: dbDoc.description,
    file_type: dbDoc.file_type || 'unknown',
  };
}

/**
 * Convert database Document to ProcessedDocument
 */
export function adaptDbDocumentToProcessedDocument(dbDoc: any): any {
  return {
    id: dbDoc.id,
    originalFileName: dbDoc.file_name,
    filePath: dbDoc.file_path,
    fileType: dbDoc.file_type || 'unknown',
    fileSize: dbDoc.file_size || 0,
    ocrResult: {
      text: dbDoc.extracted_text || '',
      confidence: dbDoc.ocr_confidence || 0,
    },
    classification: {
      category: dbDoc.document_type || 'other',
      confidence: 0.8,
    },
    extractedMetadata: {
      title: dbDoc.title || dbDoc.file_name,
      description: dbDoc.description || '',
      tags: dbDoc.tags || [],
    },
    processingStatus: 'completed',
    createdAt: new Date(dbDoc.created_at),
    expiresAt: dbDoc.expires_at ? new Date(dbDoc.expires_at) : null,
  };
}
