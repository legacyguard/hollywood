export interface LegacyGardenProps {
  milestonesUnlocked: number
  documentsCreated?: number
  daysActive?: number
  interactive?: boolean
  showLabels?: boolean
  onMilestoneClick?: (milestone: { id: string; name: string; achieved: boolean }) => void
}
