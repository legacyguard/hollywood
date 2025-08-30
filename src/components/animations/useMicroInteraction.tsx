import React, { useContext } from 'react';
import type { Variants } from 'framer-motion';
import { useSofia } from '../sofia/SofiaContextProvider';

// Micro-interaction animation configurations based on personality
interface PersonalityAnimationConfig {
  empathetic: {
    duration: number;
    ease: string;
    scale: number;
    bounce: number;
  };
  pragmatic: {
    duration: number;
    ease: string;
    scale: number;
    bounce: number;
  };
  adaptive: {
    duration: number;
    ease: string;
    scale: number;
    bounce: number;
  };
}

const PERSONALITY_CONFIGS: PersonalityAnimationConfig = {
  empathetic: {
    duration: 0.4,
    ease: "easeOut",
    scale: 1.05,
    bounce: 0.3
  },
  pragmatic: {
    duration: 0.2,
    ease: "easeInOut",
    scale: 1.02,
    bounce: 0
  },
  adaptive: {
    duration: 0.3,
    ease: "easeOut",
    scale: 1.03,
    bounce: 0.1
  }
};

// Context for sharing animation state
interface MicroAnimationContextType {
  reduceMotion: boolean;
  globalAnimationScale: number;
}

const MicroAnimationContext = React.createContext<MicroAnimationContextType>({
  reduceMotion: false,
  globalAnimationScale: 1
});

export const useMicroAnimation = () => useContext(MicroAnimationContext);

// Provider component for micro-animation system
interface MicroAnimationProviderProps {
  children: React.ReactNode;
  reduceMotion?: boolean;
  globalAnimationScale?: number;
}

export const MicroAnimationProvider: React.FC<MicroAnimationProviderProps> = ({
  children,
  reduceMotion = false,
  globalAnimationScale = 1
}) => {
  return (
    <MicroAnimationContext.Provider value={{ reduceMotion, globalAnimationScale }}>
      {children}
    </MicroAnimationContext.Provider>
  );
};

// Utility hook for creating custom animated components
export const usePersonalityAnimation = () => {
  const { personality } = useSofia();
  const { reduceMotion } = useMicroAnimation();

  return {
    config: PERSONALITY_CONFIGS[personality.mode],
    reduceMotion,
    createVariants: (baseVariants: Variants): Variants => {
      if (reduceMotion) return {};

      const config = PERSONALITY_CONFIGS[personality.mode];

      // Apply personality-specific timing to variants
      return Object.entries(baseVariants).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value.transition) {
          acc[key] = {
            ...value,
            transition: {
              ...value.transition,
              duration: config.duration,
              ease: config.ease
            }
          };
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Variants);
    }
  };
};
