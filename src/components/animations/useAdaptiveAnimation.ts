import { useContext } from 'react';
import type { PersonalityMode } from '@/lib/sofia-types';
import type { AnimationSystem, AnimationConfig } from '@/lib/animation-system';

interface AnimationContextType {
  personalityMode: PersonalityMode;
  animationConfig: AnimationConfig;
  shouldReduceMotion: boolean;
  animationSystem: typeof AnimationSystem;
}

// This context is defined in AdaptiveAnimationProvider.tsx
declare const AnimationContext: {
  personalityMode: PersonalityMode;
  animationConfig: AnimationConfig;
  shouldReduceMotion: boolean;
  animationSystem: typeof AnimationSystem;
} | null;

/**
 * Hook to access animation context
 */
export const useAdaptiveAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAdaptiveAnimation must be used within an AdaptiveAnimationProvider');
  }
  return context;
};

/**
 * Hook for creating personality-aware animation variants
 */
export const useAnimationVariants = () => {
  const { personalityMode, shouldReduceMotion, animationSystem } = useAdaptiveAnimation();

  if (shouldReduceMotion) {
    return {
      pageTransition: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      staggerContainer: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      staggerItem: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
    };
  }

  return {
    pageTransition: animationSystem.createPageTransition(personalityMode),
    staggerContainer: animationSystem.createStaggerContainer(personalityMode),
    staggerItem: animationSystem.createStaggerItem(personalityMode),
    celebration: animationSystem.createCelebrationVariants(personalityMode),
  };
};
