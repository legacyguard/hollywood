import type * as React from "react"

import type { IconMap } from "@/components/ui/icon-library"

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  // Enhanced animation props
  animationType?: 'hover-lift' | 'hover-glow' | 'tap-bounce' | 'button-press'
  personalityAdapt?: boolean
  // Loading and state props
  loading?: boolean
  success?: boolean
  error?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  // Icon props
  leftIcon?: keyof IconMap
  rightIcon?: keyof IconMap
  loadingIcon?: keyof IconMap
  successIcon?: keyof IconMap
  errorIcon?: keyof IconMap
  // Animation props
  staggerDelay?: number
  rippleEffect?: boolean
}

// Re-export buttonVariants for type usage
export { buttonVariants } from './enhanced-button-variants'
