import type * as React from "react"

import type { IconMap } from "@/components/ui/icon-library"

// Re-export inputVariants for type usage
export { inputVariants } from './enhanced-input-variants'

// Field state types
export type FieldState = 'idle' | 'focused' | 'filled' | 'success' | 'error' | 'warning' | 'loading'

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Animation props
  personalityAdapt?: boolean
  animateOnFocus?: boolean
  animateOnError?: boolean
  animateLabel?: boolean

  // Field state props
  state?: FieldState
  loading?: boolean
  success?: boolean
  error?: boolean | string
  warning?: boolean | string

  // Icon props
  leftIcon?: keyof typeof IconMap
  rightIcon?: keyof typeof IconMap
  loadingIcon?: keyof typeof IconMap
  successIcon?: keyof typeof IconMap
  errorIcon?: keyof typeof IconMap
  warningIcon?: keyof typeof IconMap

  // Enhanced label and help text
  label?: string
  helpText?: string
  successText?: string
  errorText?: string
  warningText?: string

  // Visual enhancements
  showCharacterCount?: boolean
  maxLength?: number
  rippleEffect?: boolean
  glowEffect?: boolean

  // Stagger animation delay
  staggerDelay?: number
}
