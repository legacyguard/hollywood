import React, { useContext, createContext, ReactNode } from 'react';
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion';
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

// Context for sharing animation state
interface MicroAnimationContextType {
  reduceMotion: boolean;
  globalAnimationScale: number;
}

const MicroAnimationContext = createContext<MicroAnimationContextType>({
  reduceMotion: false,
  globalAnimationScale: 1
});

export const useMicroAnimation = () => useContext(MicroAnimationContext);

// Provider component for micro-animation system
interface MicroAnimationProviderProps {
  children: ReactNode;
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

// Main micro-animation component
export const MicroAnimation: React.FC<MicroAnimationProps> = ({
  type,
  children,
  disabled = false,
  delay = 0,
  className = "",
  onAnimationComplete
}) => {
  const { personality } = useSofia();
  const { reduceMotion, globalAnimationScale } = useMicroAnimation();
  
  if (disabled || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const config = PERSONALITY_CONFIGS[personality.mode];
  const adjustedDuration = config.duration * globalAnimationScale;

  const getAnimationVariants = (): Variants => {
    const baseTransition = {
      duration: adjustedDuration,
      ease: config.ease,
      delay
    };

    switch (type) {
      case 'hover-lift':
        return {
          initial: { scale: 1, y: 0 },
          hover: { 
            scale: config.scale, 
            y: -2,
            transition: baseTransition
          },
          tap: { scale: 0.98 }
        };

      case 'hover-glow':
        return {
          initial: { 
            scale: 1,
            boxShadow: '0 0 0 rgba(var(--primary), 0)'
          },
          hover: { 
            scale: config.scale,
            boxShadow: `0 0 20px rgba(var(--primary), 0.3)`,
            transition: baseTransition
          }
        };

      case 'tap-bounce':
        return {
          initial: { scale: 1 },
          tap: { 
            scale: 0.95,
            transition: { 
              ...baseTransition, 
              duration: adjustedDuration * 0.5 
            }
          },
          hover: {
            scale: config.scale,
            transition: baseTransition
          }
        };

      case 'focus-ring':
        return {
          initial: { 
            scale: 1,
            boxShadow: '0 0 0 0 rgba(var(--primary), 0)'
          },
          focus: { 
            scale: 1.02,
            boxShadow: '0 0 0 3px rgba(var(--primary), 0.3)',
            transition: baseTransition
          }
        };

      case 'loading-pulse':
        return {
          initial: { opacity: 1, scale: 1 },
          animate: {
            opacity: [1, 0.7, 1],
            scale: [1, 1.05, 1],
            transition: {
              duration: adjustedDuration * 2,
              repeat: Infinity,
              ease: config.ease
            }
          }
        };

      case 'success-checkmark':
        return {
          initial: { scale: 0, rotate: -180 },
          animate: {
            scale: [0, 1.2, 1],
            rotate: 0,
            transition: {
              ...baseTransition,
              duration: adjustedDuration * 1.5
            }
          }
        };

      case 'error-shake':
        return {
          initial: { x: 0 },
          animate: {
            x: [-10, 10, -10, 10, 0],
            transition: {
              duration: adjustedDuration * 1.5,
              ease: "easeInOut"
            }
          }
        };

      case 'slide-reveal':
        return {
          initial: { 
            opacity: 0, 
            x: -20,
            scale: 0.95
          },
          animate: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: baseTransition
          },
          exit: {
            opacity: 0,
            x: 20,
            scale: 0.95,
            transition: baseTransition
          }
        };

      case 'fade-in-up':
        return {
          initial: { 
            opacity: 0, 
            y: 20,
            scale: 0.95
          },
          animate: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: baseTransition
          },
          exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: baseTransition
          }
        };

      case 'scale-in':
        return {
          initial: { 
            scale: 0,
            opacity: 0
          },
          animate: { 
            scale: 1,
            opacity: 1,
            transition: {
              ...baseTransition,
              type: "spring",
              damping: 15,
              stiffness: 300
            }
          },
          exit: {
            scale: 0,
            opacity: 0,
            transition: baseTransition
          }
        };

      case 'card-flip':
        return {
          initial: { rotateY: 0 },
          hover: {
            rotateY: 5,
            scale: config.scale,
            transition: baseTransition
          },
          tap: {
            rotateY: 10,
            scale: 0.98,
            transition: { duration: adjustedDuration * 0.5 }
          }
        };

      case 'button-press':
        return {
          initial: { 
            scale: 1,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          },
          hover: { 
            scale: config.scale,
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            y: -1,
            transition: baseTransition
          },
          tap: { 
            scale: 0.98,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            y: 0,
            transition: { duration: adjustedDuration * 0.5 }
          }
        };

      default:
        return {
          initial: { scale: 1 },
          hover: { scale: config.scale }
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      whileFocus="focus"
      exit="exit"
      onAnimationComplete={onAnimationComplete}
      style={{
        transformOrigin: 'center',
        backfaceVisibility: 'hidden', // Prevent flickering
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

// Specialized animation components for common use cases
export const AnimatedButton: React.FC<{
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ 
  children, 
  variant = 'primary', 
  className = "", 
  onClick, 
  disabled = false 
}) => (
  <MicroAnimation 
    type="button-press" 
    disabled={disabled}
    className={className}
  >
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} transition-colors duration-200`}
    >
      {children}
    </button>
  </MicroAnimation>
);

export const AnimatedCard: React.FC<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}> = ({ 
  children, 
  className = "", 
  onClick,
  hoverable = true 
}) => (
  <MicroAnimation 
    type={hoverable ? "card-flip" : "fade-in-up"} 
    className={className}
  >
    <div
      onClick={onClick}
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </div>
  </MicroAnimation>
);

export const AnimatedInput: React.FC<{
  children: ReactNode;
  className?: string;
  focused?: boolean;
  error?: boolean;
}> = ({ 
  children, 
  className = "", 
  focused = false,
  error = false 
}) => (
  <MicroAnimation 
    type={error ? "error-shake" : "focus-ring"}
    className={className}
  >
    {children}
  </MicroAnimation>
);

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

export default MicroAnimation;