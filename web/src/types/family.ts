/**
 * Family Collaboration System Types
 * Comprehensive types for family member management and collaboration
 */

export type FamilyRole = 'admin' | 'collaborator' | 'viewer' | 'emergency_contact';

export type FamilyMemberStatus = 'invited' | 'active' | 'inactive' | 'pending_verification';

export type RelationshipType =
  | 'spouse'
  | 'partner'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'grandparent'
  | 'grandchild'
  | 'aunt_uncle'
  | 'cousin'
  | 'friend'
  | 'attorney'
  | 'accountant'
  | 'other';

export interface FamilyMember {
  id: string;
  email: string;
  name: string;
  role: FamilyRole;
  relationship: RelationshipType;
  status: FamilyMemberStatus;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  invitedAt: Date;
  joinedAt?: Date;
  lastActiveAt?: Date;
  invitedBy: string; // User ID who sent the invitation
  permissions: FamilyPermissions;
  emergencyPriority?: number; // For emergency contacts (1 = highest priority)
  notes?: string;
}

export interface FamilyPermissions {
  canViewDocuments: boolean;
  canEditDocuments: boolean;
  canDeleteDocuments: boolean;
  canInviteMembers: boolean;
  canManageMembers: boolean;
  canAccessEmergencyInfo: boolean;
  canViewFinancials: boolean;
  canReceiveNotifications: boolean;
  documentCategories: string[]; // Which document types they can access
}

export interface FamilyInvitation {
  id: string;
  email: string;
  name: string;
  role: FamilyRole;
  relationship: RelationshipType;
  message: string;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedAt?: Date;
  declinedAt?: Date;
  token: string; // Secure invitation token
}

export interface FamilyCalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'document_expiry' | 'appointment' | 'milestone' | 'custom';
  relatedDocumentId?: string;
  relatedMemberId?: string;
  createdBy: string;
  notifyMembers: string[]; // Array of member IDs to notify
  recurring?: {
    frequency: 'yearly' | 'monthly' | 'weekly';
    endDate?: Date;
  };
  priority: 'high' | 'medium' | 'low';
}

export interface FamilyTimeline {
  id: string;
  type: 'document_added' | 'member_joined' | 'document_shared' | 'milestone_reached' | 'calendar_event' | 'emergency_access';
  title: string;
  description: string;
  date: Date;
  initiatedBy: string; // Member ID
  affectedMembers: string[]; // Array of member IDs
  relatedDocumentId?: string;
  relatedEventId?: string;
  metadata?: Record<string, unknown>;
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

export interface FamilyStats {
  totalDocuments: number;
  sharedDocuments: number;
  memberContributions: Record<string, number>; // Member ID -> document count
  documentsByCategory: Record<string, number>;
  recentActivity: FamilyTimeline[];
  upcomingEvents: FamilyCalendarEvent[];
  protectionScore: number;
}

export interface FamilyNotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: {
    newDocuments: boolean;
    documentUpdates: boolean;
    memberActivity: boolean;
    calendarReminders: boolean;
    emergencyAlerts: boolean;
    milestoneAchievements: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "07:00"
  };
}

export interface EmergencyAccessRequest {
  id: string;
  requestedBy: string; // Member ID
  requestedAt: Date;
  reason: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  approvedBy?: string;
  approvedAt?: Date;
  expiresAt: Date;
  documentsRequested: string[];
  accessDuration: number; // in hours
  verificationMethod: 'sms' | 'email' | 'voice_call';
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface FamilyPlan {
  type: 'free' | 'family' | 'premium';
  maxMembers: number;
  features: {
    unlimitedDocuments: boolean;
    professionalReviews: boolean;
    emergencyAccess: boolean;
    familyCalendar: boolean;
    advancedSharing: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
  pricing: {
    monthly: number;
    yearly: number;
  };
  trialDays?: number;
}

export interface FamilyMemberActivity {
  id: string;
  memberId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Helper functions and constants
export const FAMILY_ROLE_PERMISSIONS: Record<FamilyRole, FamilyPermissions> = {
  admin: {
    canViewDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: true,
    canInviteMembers: true,
    canManageMembers: true,
    canAccessEmergencyInfo: true,
    canViewFinancials: true,
    canReceiveNotifications: true,
    documentCategories: ['*'] // All categories
  },
  collaborator: {
    canViewDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: false,
    canInviteMembers: true,
    canManageMembers: false,
    canAccessEmergencyInfo: true,
    canViewFinancials: true,
    canReceiveNotifications: true,
    documentCategories: ['will', 'trust', 'insurance', 'medical', 'identification']
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
    documentCategories: ['will', 'trust', 'medical']
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
    documentCategories: ['medical', 'emergency']
  }
};

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  spouse: 'Spouse',
  partner: 'Partner',
  child: 'Child',
  parent: 'Parent',
  sibling: 'Sibling',
  grandparent: 'Grandparent',
  grandchild: 'Grandchild',
  aunt_uncle: 'Aunt/Uncle',
  cousin: 'Cousin',
  friend: 'Trusted Friend',
  attorney: 'Attorney',
  accountant: 'Accountant',
  other: 'Other'
};

export const FAMILY_PLANS: Record<string, FamilyPlan> = {
  free: {
    type: 'free',
    maxMembers: 2,
    features: {
      unlimitedDocuments: false,
      professionalReviews: false,
      emergencyAccess: true,
      familyCalendar: false,
      advancedSharing: false,
      prioritySupport: false,
      customBranding: false
    },
    pricing: { monthly: 0, yearly: 0 }
  },
  family: {
    type: 'family',
    maxMembers: 8,
    features: {
      unlimitedDocuments: true,
      professionalReviews: true,
      emergencyAccess: true,
      familyCalendar: true,
      advancedSharing: true,
      prioritySupport: false,
      customBranding: false
    },
    pricing: { monthly: 19.99, yearly: 199.99 },
    trialDays: 14
  },
  premium: {
    type: 'premium',
    maxMembers: -1, // Unlimited
    features: {
      unlimitedDocuments: true,
      professionalReviews: true,
      emergencyAccess: true,
      familyCalendar: true,
      advancedSharing: true,
      prioritySupport: true,
      customBranding: true
    },
    pricing: { monthly: 39.99, yearly: 399.99 },
    trialDays: 30
  }
};

