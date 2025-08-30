import type { CommunicationStyle } from '@/types/user-preferences';

export type FireflyEventType =
  | 'milestone'
  | 'document_upload'
  | 'guardian_added'
  | 'will_completed'
  | 'time_capsule_created'
  | 'emergency_activated'
  | 'challenge_started'
  | 'achievement_unlocked'
  | null;

export interface FireflyState {
  isVisible: boolean;
  mode?: CommunicationStyle;
  targetElement?: string;
  celebrateEvent?: FireflyEventType;
  interactionCount: number;
}

export interface FireflyContextValue {
  // State
  state: FireflyState;

  // Actions
  showFirefly: () => void;
  hideFirefly: () => void;
  setMode: (mode: CommunicationStyle) => void;
  guideToElement: (selector: string, duration?: number) => void;
  celebrate: (event: FireflyEventType, duration?: number) => void;
  onInteraction: () => void;

  // Utilities
  isGuidingToTarget: boolean;
  isCelebrating: boolean;
}

export interface FireflyProviderProps {
  children: React.ReactNode;
  initialMode?: CommunicationStyle;
  autoShow?: boolean;
}
