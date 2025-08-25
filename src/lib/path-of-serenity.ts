// Path of Serenity - Milestone System
// Tracks user's journey toward family security and peace of mind

import { textManager } from './text-manager';
import type { CommunicationStyle } from './text-manager';

export interface SerenityMilestone {
  id: string;
  name: string;
  description: string;
  completedDescription: string;
  category: 'foundation' | 'protection' | 'growth' | 'legacy' | 'mastery';
  unlockCondition: {
    type: 'documents_uploaded' | 'guardians_added' | 'categories_filled' | 'expiry_tracking' | 'legacy_created';
    value: number | string[];
    details?: Record<string, unknown>;
  };
  visualPosition: {
    x: number; // 0-100 percentage on the serenity map
    y: number; // 0-100 percentage on the serenity map
  };
  rewards?: {
    title: string;
    description: string;
    sofiaMessage?: string;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  icon: string;
  // Text manager keys for adaptive messaging
  textKeys?: {
    name?: string;
    description?: string;
    completedDescription?: string;
    rewardTitle?: string;
    rewardDescription?: string;
  };
}

export interface FiveMinuteChallenge {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  actionType: 'upload_document' | 'add_guardian' | 'organize_category' | 'set_reminders' | 'create_legacy';
  navigationTarget: string;
  prerequisites?: string[]; // milestone IDs that must be completed first
  sofiaGuidance: string;
  completionMessage: string;
}

// The Sacred Milestones of the Path of Serenity
export const SERENITY_MILESTONES: SerenityMilestone[] = [
  {
    id: 'foundation_stone',
    name: 'Foundation Stone',
    description: 'Upload your first important document to begin your journey toward family security',
    completedDescription: 'Excellent! You have laid the foundation stone. Your loved ones now know where to find the first important information.',
    category: 'foundation',
    unlockCondition: {
      type: 'documents_uploaded',
      value: 1
    },
    visualPosition: { x: 15, y: 85 }, // Start of the path
    rewards: {
      title: 'First Step to Certainty',
      description: 'You have secured the first important information for your family',
      sofiaMessage: 'Congratulations on your first step! You have just begun building a digital vault of certainty for your family. Each additional document adds a new layer of protection and peace.'
    },
    isUnlocked: false,
    icon: 'foundation',
    textKeys: {
      completedDescription: 'milestone_first_document_uploaded'
    }
  },

  {
    id: 'circle_of_trust',
    name: 'Circle of Trust',
    description: 'Designate your first trusted guardian who will know about your digital legacy',
    completedDescription: 'You have created a Circle of Trust. Your family will have someone to turn to in difficult times.',
    category: 'protection',
    unlockCondition: {
      type: 'guardians_added',
      value: 1
    },
    visualPosition: { x: 35, y: 70 },
    rewards: {
      title: 'Safety Network',
      description: 'Your family now has someone they can rely on',
      sofiaMessage: 'Beautiful! Creating a Circle of Trust is one of the most important steps. In difficult times, your family will know exactly who to turn to for help.'
    },
    isUnlocked: false,
    icon: 'users',
    textKeys: {
      completedDescription: 'milestone_guardian_assigned'
    }
  },

  {
    id: 'digital_vault',
    name: 'Digital Sanctuary',
    description: 'Secure five different types of documents for comprehensive protection',
    completedDescription: 'Your Digital Sanctuary is now active. Key documents are safely stored and protected.',
    category: 'foundation',
    unlockCondition: {
      type: 'documents_uploaded',
      value: 5
    },
    visualPosition: { x: 55, y: 60 },
    rewards: {
      title: 'Solid Foundation',
      description: 'You now have a robust collection of protected documents',
      sofiaMessage: 'Your Digital Sanctuary is now truly functional! Five documents create a solid foundation of security. Your family has access to important information when they need it.'
    },
    isUnlocked: false,
    icon: 'vault'
  },

  {
    id: 'time_guardian',
    name: 'Eternal Vigilance',
    description: 'Upload your first document with an expiration date - never forget an important deadline',
    completedDescription: 'You have activated Eternal Vigilance. I will now watch over all your important dates.',
    category: 'protection',
    unlockCondition: {
      type: 'expiry_tracking',
      value: 1
    },
    visualPosition: { x: 45, y: 40 },
    rewards: {
      title: 'Never Forget',
      description: 'Automatic tracking of document expirations',
      sofiaMessage: 'Eternal Vigilance is active! I will now monitor expiration dates and notify you in time. Your family no longer needs to worry about outdated documents.'
    },
    isUnlocked: false,
    icon: 'clock'
  },

  {
    id: 'treasure_map',
    name: 'Organized Legacy',
    description: 'Create documents in at least three different categories for comprehensive organization',
    completedDescription: 'You have created a clear map to your assets. Your loved ones will easily navigate through it.',
    category: 'growth',
    unlockCondition: {
      type: 'categories_filled',
      value: ['financial', 'legal', 'personal'], // at least 3 categories
      details: { minimumCategories: 3 }
    },
    visualPosition: { x: 75, y: 50 },
    rewards: {
      title: 'Systematic Order',
      description: 'Methodical arrangement of all important documents',
      sofiaMessage: 'Fantastic! Your Organized Legacy is complete. Documents are systematically arranged and your family will be able to navigate through them easily.'
    },
    isUnlocked: false,
    icon: 'map'
  },

  {
    id: 'legacy_foundation',
    name: 'Personal Legacy',
    description: 'This special milestone awaits the creation of your first personal legacy',
    completedDescription: 'You have unlocked a key Milestone of Peace: Personal Legacy. Your voice will be heard even when you are no longer here.',
    category: 'legacy',
    unlockCondition: {
      type: 'legacy_created',
      value: 1
    },
    visualPosition: { x: 85, y: 25 },
    rewards: {
      title: 'Timeless Gift',
      description: 'Your values and wisdom for future generations',
      sofiaMessage: 'You have just begun creating something immensely valuable - your legacy for future generations. This is perhaps the most beautiful gift you can give to your family.'
    },
    isUnlocked: false,
    icon: 'heart',
    textKeys: {
      completedDescription: 'milestone_time_capsule_unlocked'
    }
  },

  // Future milestones (locked, creating infinite growth potential)
  {
    id: 'master_guardian',
    name: 'Guardian Mastery',
    description: 'This milestone unlocks when you have all fundamental areas covered',
    completedDescription: 'You have achieved mastery in securing peace for your family.',
    category: 'mastery',
    unlockCondition: {
      type: 'documents_uploaded',
      value: 20 // High threshold for mastery
    },
    visualPosition: { x: 95, y: 15 },
    isUnlocked: false,
    icon: 'crown'
  }
];

// 5-Minute Challenges - Gentle guidance for next steps
export const FIVE_MINUTE_CHALLENGES: FiveMinuteChallenge[] = [
  {
    id: 'first_document_challenge',
    title: 'Lay Your Foundation Stone',
    description: 'Upload one important document, like your ID card. This is the first and most important step.',
    estimatedTime: 5,
    actionType: 'upload_document',
    navigationTarget: '/vault',
    sofiaGuidance: 'Start with a document you have at hand - ID card, passport, or driver\'s license. Simply photograph it with your phone and upload.',
    completionMessage: 'Congratulations! You have just laid the first stone of your journey to peace.',
  },

  {
    id: 'first_guardian_challenge',
    title: 'Create Your Circle of Trust',
    description: 'Designate at least one person you trust. They don\'t need access to anything, they just need to know there\'s a place to look for help.',
    estimatedTime: 3,
    actionType: 'add_guardian',
    navigationTarget: '/guardians',
    prerequisites: ['foundation_stone'],
    sofiaGuidance: 'Choose someone close - your partner, adult child, sibling, or good friend. Just enter their name and email.',
    completionMessage: 'Excellent! Your family now has someone to turn to.',
  },

  {
    id: 'organize_categories_challenge',
    title: 'Organize Your Digital World',
    description: 'Upload documents into different categories - Finance, Healthcare, Housing. You\'ll create a clear map.',
    estimatedTime: 7,
    actionType: 'organize_category',
    navigationTarget: '/vault',
    prerequisites: ['digital_vault'],
    sofiaGuidance: 'I\'ll help you choose the most important documents from each category. Let\'s start with those you already have at home.',
    completionMessage: 'Fantastic! Your digital map is now clear and organized.',
  },

  {
    id: 'expiry_protection_challenge',
    title: 'Activate Eternal Vigilance',
    description: 'Upload a document with an expiration date - passport, driver\'s license, or insurance. Sofia will start tracking important dates.',
    estimatedTime: 4,
    actionType: 'set_reminders',
    navigationTarget: '/vault',
    prerequisites: ['foundation_stone'],
    sofiaGuidance: 'Choose a document whose validity you want to track. Enter the expiration date and I\'ll take care of timely reminders.',
    completionMessage: 'Eternal Vigilance is active! You\'ll never forget an important date.',
  }
];

/**
 * Interface for milestone calculation result
 */
export interface MilestoneCalculationResult {
  milestones: SerenityMilestone[];
  newlyUnlocked: SerenityMilestone[];
}

/**
 * Get adaptive milestone text based on user's communication style
 */
export function getAdaptiveMilestoneText(
  milestone: SerenityMilestone, 
  field: 'name' | 'description' | 'completedDescription',
  userId?: string,
  style?: CommunicationStyle
): string {
  // Check if milestone has text keys for adaptive messaging
  const textKey = milestone.textKeys?.[field];
  if (textKey && userId) {
    return textManager.getText(textKey, style || 'default', userId);
  }
  
  // Fallback to default milestone text
  return milestone[field];
}

/**
 * Calculate which milestones should be unlocked based on user's current state
 */
export function calculateUnlockedMilestones(
  userStats: {
    documentsCount: number;
    guardiansCount: number;
    categoriesWithDocuments: string[];
    hasExpiryTracking: boolean;
    legacyItemsCount: number;
  },
  previousMilestones?: SerenityMilestone[]
): MilestoneCalculationResult {
  const currentMilestones = SERENITY_MILESTONES.map(milestone => {
    let isUnlocked = false;

    switch (milestone.unlockCondition.type) {
      case 'documents_uploaded':
        isUnlocked = userStats.documentsCount >= (milestone.unlockCondition.value as number);
        break;

      case 'guardians_added':
        isUnlocked = userStats.guardiansCount >= (milestone.unlockCondition.value as number);
        break;

      case 'categories_filled': {
        const requiredCategories = milestone.unlockCondition.value as string[];
        isUnlocked = requiredCategories.every(cat =>
          userStats.categoriesWithDocuments.includes(cat)
        );
        break;
      }

      case 'expiry_tracking':
        isUnlocked = userStats.hasExpiryTracking;
        break;

      case 'legacy_created':
        isUnlocked = userStats.legacyItemsCount >= (milestone.unlockCondition.value as number);
        break;
    }

    return {
      ...milestone,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    };
  });

  // Find newly unlocked milestones
  const newlyUnlocked: SerenityMilestone[] = [];
  if (previousMilestones) {
    currentMilestones.forEach(current => {
      const previous = previousMilestones.find(p => p.id === current.id);
      if (current.isUnlocked && (!previous || !previous.isUnlocked)) {
        newlyUnlocked.push(current);
      }
    });
  }

  return {
    milestones: currentMilestones,
    newlyUnlocked
  };
}

/**
 * Get the next recommended 5-minute challenge based on user's progress
 */
export function getNextChallenge(
  unlockedMilestones: SerenityMilestone[],
  userStats: {
    documentsCount: number;
    guardiansCount: number;
    categoriesWithDocuments: string[];
  }
): FiveMinuteChallenge | null {
  // If no documents yet, start with first document
  if (userStats.documentsCount === 0) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'first_document_challenge') || null;
  }

  // If no guardians yet, suggest adding guardian
  if (userStats.guardiansCount === 0) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'first_guardian_challenge') || null;
  }

  // If less than 3 categories, suggest organizing
  if (userStats.categoriesWithDocuments.length < 3) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'organize_categories_challenge') || null;
  }

  // If no expiry tracking, suggest it
  const hasExpiryMilestone = unlockedMilestones.find(m => m.id === 'time_guardian')?.isUnlocked;
  if (!hasExpiryMilestone) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'expiry_protection_challenge') || null;
  }

  return null; // No active challenge
}

/**
 * Generate inspirational message based on user's progress
 */
export function generateSerenityMessage(unlockedMilestones: SerenityMilestone[]): string {
  const unlockedCount = unlockedMilestones.filter(m => m.isUnlocked).length;

  if (unlockedCount === 0) {
    return "Vítajte na Ceste Pokoja. Každý krok, ktorý urobíte, prinesie vašej rodine väčšiu istotu a pokoj.";
  } else if (unlockedCount === 1) {
    return "Výborne! Urobili ste prvý krok. Vaša rodina už má o niečo väčšiu istotu vďaka vám.";
  } else if (unlockedCount <= 3) {
    return `Krásne! Odomkli ste už ${unlockedCount} míľniky pokoja. Vaša rodina sa môže cítiť stále istejšie.`;
  } else if (unlockedCount <= 5) {
    return `Fantastické! S ${unlockedCount} míľnikmi ste vytvorili skutočne solídny základ istoty pre svoju rodinu.`;
  } else {
    return `Úžasné! ${unlockedCount} míľnikov pokoja - ste skutočným majstrom zabezpečovania pokoja a istoty.`;
  }
}
