/**
 * Legacy Milestone System Types
 * Interfaces for tracking legacy planning progress and celebrating achievements
 */

export interface LegacyMilestone {
  id: string;
  userId: string;
  type: 'first_document' | 'protection_threshold' | 'family_complete' | 'professional_review' | 'annual_update' | 'legacy_complete';
  title: string;
  description: string;
  category: 'foundation' | 'protection' | 'family' | 'professional' | 'maintenance' | 'mastery';

  // Milestone criteria
  criteria: {
    type: 'document_count' | 'protection_percentage' | 'family_members' | 'time_based' | 'action_completed' | 'review_score';
    threshold: number | string;
    currentValue: number | string;
    isComplete: boolean;
  };

  // Progress tracking
  progress: {
    percentage: number;
    stepsCompleted: number;
    totalSteps: number;
    nextAction?: string;
    nextActionUrl?: string;
  };

  // Celebration and messaging
  celebration: {
    shouldShow: boolean;
    celebrationText: string;
    familyImpactMessage: string;
    emotionalFraming: string;
    celebrationIcon: string;
    celebrationColor: string;
  };

  // Rewards and benefits
  rewards: {
    protectionIncrease?: number; // percentage
    timeSaved?: number; // hours
    features?: string[]; // unlocked features
    badges?: string[]; // earned badges
    insights?: string[]; // unlocked insights
  };

  // Timing and triggers
  triggers: {
    conditions: string[]; // What conditions trigger this milestone
    dependencies?: string[]; // Other milestones that must be completed first
    autoCheck: boolean; // Should this be checked automatically
    checkFrequency?: 'immediate' | 'daily' | 'weekly' | 'monthly';
  };

  metadata: {
    difficulty: 'easy' | 'medium' | 'hard' | 'epic';
    estimatedTime: string; // e.g., "5 minutes", "1 hour"
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    version: string; // for milestone definition versioning
  };

  // Timestamps
  createdAt: string;
  completedAt?: string;
  lastCheckedAt?: string;
  updatedAt: string;
}

export interface MilestoneProgress {
  userId: string;
  totalMilestones: number;
  completedMilestones: number;
  overallProgress: number; // 0-100
  currentLevel: MilestoneLevel;
  nextLevel: MilestoneLevel | null;

  // Category progress
  categoryProgress: {
    [key in LegacyMilestone['category']]: {
      completed: number;
      total: number;
      percentage: number;
    };
  };

  // Recent achievements
  recentAchievements: LegacyMilestone[];
  pendingCelebrations: LegacyMilestone[];

  // Next recommended actions
  recommendations: {
    milestone: LegacyMilestone;
    reason: string;
    estimatedImpact: string;
  }[];
}

export interface MilestoneLevel {
  level: number;
  name: string;
  description: string;
  requirements: {
    milestonesRequired: number;
    categoriesRequired?: LegacyMilestone['category'][];
    specificMilestones?: string[];
  };
  benefits: {
    title: string;
    features: string[];
    protectionLevel: string;
    statusMessage: string;
  };
  celebrationMessage: string;
  progressThreshold: number; // percentage needed to reach this level
}

export interface MilestoneTriggerEvent {
  type: 'document_uploaded' | 'document_updated' | 'family_member_added' | 'review_completed' | 'time_passed' | 'user_action';
  userId: string;
  documentId?: string;
  familyMemberId?: string;
  reviewId?: string;
  actionType?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface MilestoneCelebrationConfig {
  showModal: boolean;
  playSound: boolean;
  showAnimation: boolean;
  duration: number; // milliseconds
  style: 'subtle' | 'moderate' | 'enthusiastic';
  customMessage?: string;
  shareOptions: {
    allowSharing: boolean;
    platforms: ('email' | 'social' | 'family')[];
    template: string;
  };
}

export interface MilestoneAnalytics {
  userId: string;
  timeframe: {
    start: string;
    end: string;
  };

  // Completion metrics
  milestonesCompleted: number;
  averageCompletionTime: number; // hours
  completionRate: number; // percentage

  // Progress patterns
  mostActiveCategory: LegacyMilestone['category'];
  preferredDifficulty: LegacyMilestone['metadata']['difficulty'];
  completionTrend: 'improving' | 'stable' | 'declining';

  // Impact metrics
  totalProtectionIncrease: number;
  totalTimeSaved: number;
  featuresUnlocked: string[];

  // Behavioral insights
  celebrationEngagement: number; // 0-1
  recommendationFollowRate: number; // 0-1
  averageGapBetweenMilestones: number; // days
}

export interface MilestoneTemplate {
  id: string;
  name: string;
  description: string;
  category: LegacyMilestone['category'];
  triggers: LegacyMilestone['triggers'];
  criteria: Omit<LegacyMilestone['criteria'], 'currentValue' | 'isComplete'>;
  celebration: LegacyMilestone['celebration'];
  rewards: LegacyMilestone['rewards'];
  metadata: LegacyMilestone['metadata'];
}

// Predefined milestone levels
export const MILESTONE_LEVELS: MilestoneLevel[] = [
  {
    level: 1,
    name: "Guardian Awakening",
    description: "You've begun your journey as a Guardian of Memories",
    requirements: {
      milestonesRequired: 1,
      specificMilestones: ['first_document']
    },
    benefits: {
      title: "Legacy Foundation",
      features: ["Basic document upload", "Simple encryption", "Family notifications"],
      protectionLevel: "25%",
      statusMessage: "Your first stone is placed in the family mosaic"
    },
    celebrationMessage: "Welcome, Guardian! Your family's story begins with this first precious memory.",
    progressThreshold: 0
  },
  {
    level: 2,
    name: "Memory Keeper",
    description: "You're actively building your family's protective foundation",
    requirements: {
      milestonesRequired: 3,
      categoriesRequired: ['foundation', 'protection']
    },
    benefits: {
      title: "Enhanced Security",
      features: ["Document templates", "Basic insights", "Progress tracking"],
      protectionLevel: "50%",
      statusMessage: "Your family's foundation grows stronger"
    },
    celebrationMessage: "You're becoming a true Memory Keeper! Your dedication protects those you love.",
    progressThreshold: 20
  },
  {
    level: 3,
    name: "Legacy Architect",
    description: "You're designing comprehensive protection for your family",
    requirements: {
      milestonesRequired: 6,
      categoriesRequired: ['foundation', 'protection', 'family']
    },
    benefits: {
      title: "Comprehensive Planning",
      features: ["Advanced insights", "Family collaboration", "Professional network access"],
      protectionLevel: "75%",
      statusMessage: "Your legacy architecture takes beautiful shape"
    },
    celebrationMessage: "Magnificent work, Architect! Your family's future is secure in your careful planning.",
    progressThreshold: 50
  },
  {
    level: 4,
    name: "Heritage Guardian",
    description: "You've achieved mastery in legacy protection and family care",
    requirements: {
      milestonesRequired: 10,
      categoriesRequired: ['foundation', 'protection', 'family', 'professional', 'maintenance']
    },
    benefits: {
      title: "Master Protection",
      features: ["All premium features", "Priority support", "Advanced analytics"],
      protectionLevel: "95%",
      statusMessage: "You've mastered the art of legacy protection"
    },
    celebrationMessage: "You are now a Heritage Guardian! Your family's story will inspire generations.",
    progressThreshold: 90
  }
];

export const DEFAULT_MILESTONE_TEMPLATES: MilestoneTemplate[] = [
  {
    id: 'first_document',
    name: 'First Document Upload',
    description: 'Upload your first important document to begin your legacy journey',
    category: 'foundation',
    triggers: {
      conditions: ['document_uploaded'],
      autoCheck: true,
      checkFrequency: 'immediate'
    },
    criteria: {
      type: 'document_count',
      threshold: 1
    },
    celebration: {
      shouldShow: true,
      celebrationText: 'Congratulations! You\'ve planted the first seed in your Garden of Legacy!',
      familyImpactMessage: 'Your family now has secure access to this important document',
      emotionalFraming: 'This moment marks the beginning of your family\'s protected future',
      celebrationIcon: '🌱',
      celebrationColor: 'emerald'
    },
    rewards: {
      protectionIncrease: 15,
      timeSaved: 2,
      features: ['basic_insights'],
      badges: ['first_steps']
    },
    metadata: {
      difficulty: 'easy',
      estimatedTime: '5 minutes',
      priority: 'high',
      tags: ['beginner', 'foundation', 'important'],
      version: '1.0'
    }
  }
];
