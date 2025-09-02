import type { SofiaMode } from '@legacyguard/logic'

export interface SofiaFireflyProps {
  mode?: SofiaMode
  isActive?: boolean
  message?: string
  onInteraction?: () => void
  startPosition?: { x: number; y: number }
}
