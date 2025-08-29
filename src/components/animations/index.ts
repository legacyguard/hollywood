// Animation System - Main exports for Phase 1B Animation Foundation
// Provides centralized access to all animation components and utilities

// Core animation system
export { AnimationSystem, useAnimationConfig } from '@/lib/animation-system';
export type { AnimationConfig, AdaptiveAnimationConfig } from '@/lib/animation-system';

// Animation providers and wrappers
export {
  AdaptiveAnimationProvider,
  useAdaptiveAnimation,
  useAnimationVariants
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

// Type definitions for animations
export interface AnimationComponentProps {
  children?: React.ReactNode;
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

// Animation system status
export const ANIMATION_SYSTEM_INFO = {
  version: '1.0.0',
  phase: '1B',
  features: [
    'Personality-aware animations',
    'Accessibility compliance',
    'Performance optimization',
    'Responsive behavior',
    'Reduced motion support',
  ],
  components: [
    'AdaptiveAnimationProvider',
    'PageTransitions',
    'InteractiveAnimations',
    'ProgressAnimations',
    'MilestoneAnimations',
    'EnhancedFirefly',
  ],
} as const;
