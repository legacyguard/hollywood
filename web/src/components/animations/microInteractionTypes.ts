import type { ReactNode } from 'react';

// Animation type definitions
export type MicroAnimationType =
  | 'hover-lift'
  | 'hover-glow'
  | 'tap-bounce'
  | 'focus-ring'
  | 'loading-pulse'
  | 'success-checkmark'
  | 'error-shake'
  | 'slide-reveal'
  | 'fade-in-up'
  | 'scale-in'
  | 'card-flip'
  | 'button-press';

export interface MicroAnimationProps {
  type: MicroAnimationType;
  children: ReactNode;
  disabled?: boolean;
  delay?: number;
  className?: string;
  onAnimationComplete?: () => void;
}
