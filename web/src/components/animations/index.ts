// Advanced Animation System - Phase 3B: Micro-Interactions & Enhanced Animations
// Provides centralized access to all animation components and utilities

// Core animation system
export { AnimationSystem, useAnimationConfig } from '@/lib/animation-system';
export type { AnimationConfig, AdaptiveAnimationConfig } from '@/lib/animation-system';

// Animation providers and wrappers
export {
  AdaptiveAnimationProvider,
  // useAdaptiveAnimation, // Not available
  // useAnimationVariants // Not available
} from './AdaptiveAnimationProvider';
export { default as AnimatedPageWrapper } from './AnimatedPageWrapper';

// Interactive animations
export {
  AdaptiveAnimatedButton,
  AdaptiveAnimatedCard,
  AdaptiveAnimatedListItem,
  AdaptivePulseAnimation,
  AdaptiveHoverScale,
  AdaptiveGlowEffect,
} from './InteractiveAnimations';

// Page transitions
export {
  PageTransition,
  RouteTransition,
  ModalTransition,
  SlideTransition,
  FadeTransition,
  BreadcrumbTransition,
} from './PageTransitions';

// Progress animations
export {
  AdaptiveProgressBar,
  AdaptiveMilestoneIndicator,
  AdaptiveStepProgress,
} from './ProgressAnimations';

// Milestone celebrations
export {
  MilestoneCelebration,
  AdaptiveProgressRing,
  AchievementBadge,
} from './MilestoneAnimations';

// Enhanced firefly (builds on existing system)
export { default as EnhancedFirefly } from './EnhancedFirefly';

// Re-export existing firefly for backward compatibility
export { default as SofiaFirefly } from './SofiaFirefly';

// Phase 3B: Advanced Micro-Interactions
export {
  MicroAnimation,
  // MicroAnimationProvider, // Not available
  AnimatedButton,
  AnimatedCard,
  AnimatedInput,
  // useMicroAnimation, // Not available
  // usePersonalityAnimation // Not available
} from './MicroInteractionSystem';

export type {
  MicroAnimationType,
  MicroAnimationProps
} from './MicroInteractionSystem';

// Loading animations
export {
  LoadingAnimation,
  PageLoader,
  ButtonLoader,
  FormLoader,
  CardLoader,
  ProgressLoader,
  // LoadingProvider, // Not available
  // useLoading // Not available
} from './LoadingAnimations';

export type {
  LoadingAnimationType,
  LoadingAnimationProps
} from './LoadingAnimations';

// Enhanced UI components with animations
export {
  EnhancedButton,
  LoadingButton,
  PersonalityButton,
  ActionButton,
  buttonVariants
} from '../ui/enhanced-button';

export type {
  EnhancedButtonProps
} from '../ui/enhanced-button';

export {
  EnhancedInput,
  PersonalityInput,
  ValidatedInput,
  inputVariants
} from '../ui/enhanced-input';

export type {
  EnhancedInputProps
  // FieldState
} from '../ui/enhanced-input';

export {
  EnhancedCard,
  PersonalityCard,
  InteractiveCard,
  ContentCard,
  cardVariants
} from '../ui/enhanced-card';

export type {
  EnhancedCardProps,
  CardInteractionType
} from '../ui/enhanced-card';

// Common animation presets
export {
  fadeInUp,
  fadeInLeft,
  scaleIn,
  slideInRight,
  ANIMATION_VARIANTS,
} from '@/lib/animation-system';

// Animation hooks and utilities
export { default as useFireflyEvents } from '@/hooks/useFireflyEvents';

import type { ReactNode } from 'react';

// Type definitions for animations
export interface AnimationComponentProps {
  children?: ReactNode;
  className?: string;
  personalityMode?: 'empathetic' | 'pragmatic' | 'adaptive';
  shouldReduceMotion?: boolean;
}

// Animation configuration presets for easy consumption
export const PERSONALITY_ANIMATIONS = {
  empathetic: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
    stagger: 0.15,
    style: 'organic',
  },
  pragmatic: {
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1],
    stagger: 0.08,
    style: 'efficient',
  },
  adaptive: {
    duration: 0.6,
    ease: [0.35, 0.23, 0.32, 0.97],
    stagger: 0.12,
    style: 'balanced',
  },
} as const;

// Quick access to common animation combinations
export const COMMON_ANIMATIONS = {
  // Card hover effects
  cardHover: (mode: 'empathetic' | 'pragmatic' | 'adaptive' = 'adaptive') => ({
    whileHover: {
      scale: mode === 'empathetic' ? 1.03 : mode === 'pragmatic' ? 1.01 : 1.02,
      y: mode === 'empathetic' ? -8 : -4,
      boxShadow: mode === 'empathetic'
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    transition: {
      duration: mode === 'pragmatic' ? 0.2 : 0.3,
    },
  }),

  // Button press effects
  buttonPress: (mode: 'empathetic' | 'pragmatic' | 'adaptive' = 'adaptive') => ({
    whileTap: {
      scale: mode === 'empathetic' ? 0.95 : 0.98,
    },
    transition: {
      duration: 0.1,
    },
  }),

  // List item stagger
  listItemStagger: (mode: 'empathetic' | 'pragmatic' | 'adaptive' = 'adaptive') => ({
    initial: { opacity: 0, y: mode === 'empathetic' ? 20 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: PERSONALITY_ANIMATIONS[mode].duration,
      ease: PERSONALITY_ANIMATIONS[mode].ease,
    },
  }),
} as const;

// Animation performance utilities
export const ANIMATION_PERFORMANCE = {
  // Optimize for performance
  getOptimizedProps: () => ({
    style: { willChange: 'transform, opacity' },
    viewport: { once: true, margin: '0px 0px -50px 0px' },
  }),

  // Check if animations should be disabled
  shouldReduceMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get responsive animation settings
  getResponsiveConfig: (isMobile: boolean) => ({
    duration: isMobile ? 0.3 : 0.5,
    stagger: isMobile ? 0.05 : 0.1,
  }),
} as const;

// Phase 3B Animation System Constants
export const MICRO_ANIMATION_CONFIG = {
  empathetic: {
    defaultType: 'glow',
    colors: ['#ec4899', '#f97316', '#8b5cf6'],
    duration: 0.4,
    easing: 'easeOut',
    scale: 1.05,
    bounce: 0.3
  },
  pragmatic: {
    defaultType: 'lift',
    colors: ['#6b7280', '#374151', '#111827'],
    duration: 0.2,
    easing: 'easeInOut',
    scale: 1.02,
    bounce: 0
  },
  adaptive: {
    defaultType: 'tilt',
    colors: ['#3b82f6', '#10b981', '#06b6d4'],
    duration: 0.3,
    easing: 'easeOut',
    scale: 1.03,
    bounce: 0.1
  }
} as const;

// Animation system status
export const ANIMATION_SYSTEM_INFO = {
  version: '3.0.0',
  phase: '3B',
  name: 'Advanced Micro-Interactions',
  features: [
    'Personality-aware animations',
    'Micro-interaction framework',
    'Enhanced button hover effects',
    'Advanced form field animations',
    'Loading state animations',
    'Card interaction animations',
    'Accessibility compliance',
    'Performance optimization',
    'Responsive behavior',
    'Reduced motion support',
  ],
  components: [
    'AdaptiveAnimationProvider',
    'MicroAnimationProvider',
    'PageTransitions',
    'InteractiveAnimations',
    'ProgressAnimations',
    'MilestoneAnimations',
    'EnhancedFirefly',
    'EnhancedButton',
    'EnhancedInput',
    'EnhancedCard',
    'LoadingAnimations',
  ],
} as const;

// Utility functions for advanced animations
export const ANIMATION_UTILS = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Create staggered animation delays for lists
   */
  createStaggerDelays: (count: number, baseDelay: number = 0.05): number[] => {
    return Array.from({ length: count }, (_, i) => i * baseDelay);
  },

  /**
   * Get personality-specific animation timing
   */
  getPersonalityTiming: (personality: 'empathetic' | 'pragmatic' | 'adaptive') => {
    return MICRO_ANIMATION_CONFIG[personality];
  }
};
