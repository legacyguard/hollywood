// User Preferences and Communication Style Types
// Extends the existing user preference system with Sofia's adaptive personality

import type { CommunicationStyle } from '@/lib/text-manager';

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    autoBackup: boolean;
  };
  display: {
    compactMode: boolean;
    showTips: boolean;
  };
  // New communication preferences for Sofia's adaptive personality
  communication: {
    style: CommunicationStyle;
    autoDetection: boolean; // Whether to automatically detect style from user input
    lastDetectionUpdate: string | null; // ISO timestamp of last auto-detection
  };
}

export const defaultUserPreferences: UserPreferences = {
  notifications: {
    email: true,
    push: true,
    reminders: true,
  },
  privacy: {
    shareAnalytics: false,
    autoBackup: false,
  },
  display: {
    compactMode: false,
    showTips: true,
  },
  communication: {
    style: 'default',
    autoDetection: true,
    lastDetectionUpdate: null,
  },
};

// For extending Clerk user metadata (when syncing to cloud)
export interface ClerkUserMetadata {
  communicationStyle?: CommunicationStyle;
  communicationAutoDetection?: boolean;
  preferences?: Partial<UserPreferences>;
}