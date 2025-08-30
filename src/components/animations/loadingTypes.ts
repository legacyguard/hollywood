// Loading animation type definitions
export type LoadingAnimationType =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'skeleton'
  | 'progress'
  | 'typewriter'
  | 'firefly'
  | 'heartbeat'
  | 'wave'
  | 'bounce';

export interface LoadingAnimationProps {
  type?: LoadingAnimationType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  personalityAdapt?: boolean;
  className?: string;
  color?: string;
  duration?: number;
}

// Personality-specific loading configurations
export const PERSONALITY_LOADING_CONFIGS = {
  empathetic: {
    defaultType: 'heartbeat' as LoadingAnimationType,
    colors: ['#ec4899', '#f97316', '#8b5cf6'],
    duration: 2.0,
    easing: 'easeOut'
  },
  pragmatic: {
    defaultType: 'spinner' as LoadingAnimationType,
    colors: ['#6b7280', '#374151', '#111827'],
    duration: 1.0,
    easing: 'linear'
  },
  adaptive: {
    defaultType: 'wave' as LoadingAnimationType,
    colors: ['#3b82f6', '#10b981', '#06b6d4'],
    duration: 1.5,
    easing: 'easeInOut'
  }
};
