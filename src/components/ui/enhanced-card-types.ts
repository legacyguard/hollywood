import type * as React from "react"
import { type VariantProps } from "class-variance-authority"
import type { IconMap } from "@/components/ui/icon-library"

// Re-export cardVariants for type usage
export { cardVariants } from './enhanced-card-variants'

// Card interaction types
export type CardInteractionType =
  | 'lift'
  | 'tilt'
  | 'glow'
  | 'scale'
  | 'flip'
  | 'slide'
  | 'bounce'
  | 'shake'
  | 'pulse'
  | 'morphing';

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  // Animation props
  animationType?: CardInteractionType
  personalityAdapt?: boolean
  hoverEffect?: boolean
  clickEffect?: boolean

  // Content props
  title?: string
  subtitle?: string
  description?: string
  icon?: keyof IconMap
  image?: string

  // State props
  loading?: boolean
  disabled?: boolean
  selected?: boolean
  highlighted?: boolean

  // Interaction props
  href?: string
  onClick?: () => void
  onDoubleClick?: () => void
  onHover?: (isHovered: boolean) => void

  // Visual props
  glowColor?: string
  borderGradient?: boolean
  backgroundPattern?: boolean

  // Layout props
  expandable?: boolean
  collapsible?: boolean
  expanded?: boolean

  // Animation timing
  staggerDelay?: number
  animationDuration?: number
}
