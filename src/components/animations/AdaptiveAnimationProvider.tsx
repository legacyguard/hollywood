// Adaptive Animation Provider - Provides animation context based on Sofia's personality
// Centralizes animation behavior and adapts to user preferences

import React, { createContext, useContext, type ReactNode } from 'react';
import { usePersonalityManager } from '@/components/sofia/SofiaContextProvider';
import { AnimationSystem, useAnimationConfig, type AnimationConfig } from '@/lib/animation-system';
import type { PersonalityMode } from '@/lib/sofia-types';

interface AnimationContextType {
  personalityMode: PersonalityMode;
  animationConfig: AnimationConfig;
  shouldReduceMotion: boolean;
  animationSystem: typeof AnimationSystem;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

interface AdaptiveAnimationProviderProps {
  children: ReactNode;
  forceMode?: PersonalityMode;
}

export const AdaptiveAnimationProvider: React.FC<AdaptiveAnimationProviderProps> = ({
  children,
  forceMode,
}) => {
  const personalityManager = usePersonalityManager();

  // Determine personality mode for animations
  const detectedMode = personalityManager?.getCurrentStyle() || 'adaptive';
  const personalityMode = forceMode || (detectedMode === 'balanced' ? 'adaptive' : detectedMode);

  // Get animation configuration
  const animationConfig = useAnimationConfig(personalityMode);
  const shouldReduceMotion = AnimationSystem.shouldReduceMotion();

  const contextValue: AnimationContextType = {
    personalityMode,
    animationConfig,
    shouldReduceMotion,
    animationSystem: AnimationSystem,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

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

export default AdaptiveAnimationProvider;

