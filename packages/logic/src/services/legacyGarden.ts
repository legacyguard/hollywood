/**
 * LegacyGarden Service
 * Manages the growth and milestones of the user's legacy tree
 */

export interface TreeState {
  stage: 'seed' | 'sprout' | 'sapling' | 'young-tree' | 'mature-tree' | 'ancient-tree'
  height: number // 0-100
  branches: number
  leaves: number
  fruits: number
  roots: number
  health: number // 0-100
  age: number // in days
}

export interface Milestone {
  id: string
  name: string
  description: string
  icon: string
  achieved: boolean
  achievedAt?: Date
  requirement: MilestoneRequirement
  reward?: MilestoneReward
}

export interface MilestoneRequirement {
  type: 'documents' | 'days' | 'shares' | 'updates' | 'categories'
  value: number
  current?: number
}

export interface MilestoneReward {
  type: 'badge' | 'feature' | 'decoration'
  value: string
  description?: string
}

export interface GrowthFactors {
  documentsCreated: number
  daysActive: number
  documentsShared: number
  lastUpdateDays: number
  categoriesUsed: number
  completionRate: number // 0-1
}

export class LegacyGarden {
  private milestones: Milestone[] = []
  private treeState: TreeState

  constructor() {
    this.treeState = this.initializeTree()
    this.initializeMilestones()
  }

  private initializeTree(): TreeState {
    return {
      stage: 'seed',
      height: 0,
      branches: 0,
      leaves: 0,
      fruits: 0,
      roots: 1,
      health: 100,
      age: 0
    }
  }

  private initializeMilestones(): void {
    this.milestones = [
      {
        id: 'first-seed',
        name: 'First Seed',
        description: 'Create your first document',
        icon: '🌱',
        achieved: false,
        requirement: { type: 'documents', value: 1 },
        reward: { type: 'badge', value: 'seed-planter' }
      },
      {
        id: 'growing-roots',
        name: 'Growing Roots',
        description: 'Create 3 documents',
        icon: '🌿',
        achieved: false,
        requirement: { type: 'documents', value: 3 },
        reward: { type: 'decoration', value: 'golden-leaves' }
      },
      {
        id: 'first-branch',
        name: 'First Branch',
        description: 'Use 3 different document categories',
        icon: '🌳',
        achieved: false,
        requirement: { type: 'categories', value: 3 },
        reward: { type: 'feature', value: 'custom-categories' }
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Active for 7 consecutive days',
        icon: '⭐',
        achieved: false,
        requirement: { type: 'days', value: 7 },
        reward: { type: 'badge', value: 'dedicated-gardener' }
      },
      {
        id: 'sharing-sunshine',
        name: 'Sharing Sunshine',
        description: 'Share 5 documents with loved ones',
        icon: '☀️',
        achieved: false,
        requirement: { type: 'shares', value: 5 },
        reward: { type: 'decoration', value: 'sunbeam-effect' }
      },
      {
        id: 'fruit-bearer',
        name: 'Fruit Bearer',
        description: 'Create 10 documents',
        icon: '🍎',
        achieved: false,
        requirement: { type: 'documents', value: 10 },
        reward: { type: 'decoration', value: 'fruit-branches' }
      },
      {
        id: 'monthly-dedication',
        name: 'Monthly Dedication',
        description: 'Active for 30 days',
        icon: '🏆',
        achieved: false,
        requirement: { type: 'days', value: 30 },
        reward: { type: 'badge', value: 'legacy-keeper' }
      },
      {
        id: 'forest-builder',
        name: 'Forest Builder',
        description: 'Create 25 documents',
        icon: '🌲',
        achieved: false,
        requirement: { type: 'documents', value: 25 },
        reward: { type: 'feature', value: 'forest-view' }
      },
      {
        id: 'ancient-wisdom',
        name: 'Ancient Wisdom',
        description: 'Maintain your garden for 100 days',
        icon: '🦉',
        achieved: false,
        requirement: { type: 'days', value: 100 },
        reward: { type: 'badge', value: 'wisdom-keeper' }
      },
      {
        id: 'legacy-master',
        name: 'Legacy Master',
        description: 'Create 50 documents',
        icon: '👑',
        achieved: false,
        requirement: { type: 'documents', value: 50 },
        reward: { type: 'decoration', value: 'golden-tree' }
      }
    ]
  }

  calculateGrowth(factors: GrowthFactors): TreeState {
    // Base growth calculation
    const growthRate = this.calculateGrowthRate(factors)

    // Update tree height (max 100)
    this.treeState.height = Math.min(100, this.treeState.height + growthRate * 2)

    // Update stage based on height
    this.updateStage()

    // Calculate branches based on documents
    this.treeState.branches = Math.floor(factors.documentsCreated / 2)

    // Calculate leaves (more leaves with regular activity)
    const activityMultiplier = factors.lastUpdateDays < 7 ? 1.5 : 1
    this.treeState.leaves = Math.floor(factors.documentsCreated * 3 * activityMultiplier)

    // Calculate fruits (milestones achieved)
    this.treeState.fruits = this.milestones.filter(m => m.achieved).length

    // Calculate roots (based on categories and shares)
    this.treeState.roots = 1 + factors.categoriesUsed + Math.floor(factors.documentsShared / 3)

    // Calculate health (decreases with inactivity)
    const healthPenalty = Math.min(50, factors.lastUpdateDays * 2)
    this.treeState.health = Math.max(20, 100 - healthPenalty)

    // Update age
    this.treeState.age = factors.daysActive

    return this.treeState
  }

  private calculateGrowthRate(factors: GrowthFactors): number {
    let rate = 0

    // Document creation contributes most to growth
    rate += factors.documentsCreated * 2

    // Regular activity bonus
    if (factors.lastUpdateDays < 3) rate += 5
    else if (factors.lastUpdateDays < 7) rate += 3
    else if (factors.lastUpdateDays < 14) rate += 1

    // Completion rate bonus
    rate += factors.completionRate * 10

    // Category diversity bonus
    rate += factors.categoriesUsed * 1.5

    // Sharing bonus
    rate += factors.documentsShared * 0.5

    return rate
  }

  private updateStage(): void {
    const height = this.treeState.height

    if (height < 10) {
      this.treeState.stage = 'seed'
    } else if (height < 25) {
      this.treeState.stage = 'sprout'
    } else if (height < 40) {
      this.treeState.stage = 'sapling'
    } else if (height < 60) {
      this.treeState.stage = 'young-tree'
    } else if (height < 85) {
      this.treeState.stage = 'mature-tree'
    } else {
      this.treeState.stage = 'ancient-tree'
    }
  }

  checkMilestones(factors: GrowthFactors): Milestone[] {
    const newlyAchieved: Milestone[] = []

    this.milestones.forEach(milestone => {
      if (milestone.achieved) return

      let achieved = false

      switch (milestone.requirement.type) {
        case 'documents':
          achieved = factors.documentsCreated >= milestone.requirement.value
          break
        case 'days':
          achieved = factors.daysActive >= milestone.requirement.value
          break
        case 'shares':
          achieved = factors.documentsShared >= milestone.requirement.value
          break
        case 'categories':
          achieved = factors.categoriesUsed >= milestone.requirement.value
          break
      }

      if (achieved) {
        milestone.achieved = true
        milestone.achievedAt = new Date()
        newlyAchieved.push(milestone)
      }
    })

    return newlyAchieved
  }

  getMilestones(): Milestone[] {
    return this.milestones
  }

  getAchievedMilestones(): Milestone[] {
    return this.milestones.filter(m => m.achieved)
  }

  getNextMilestone(): Milestone | null {
    return this.milestones.find(m => !m.achieved) || null
  }

  getTreeState(): TreeState {
    return this.treeState
  }

  getGrowthPercentage(): number {
    return this.treeState.height
  }

  getHealthStatus(): 'excellent' | 'good' | 'fair' | 'poor' {
    const health = this.treeState.health

    if (health >= 80) return 'excellent'
    if (health >= 60) return 'good'
    if (health >= 40) return 'fair'
    return 'poor'
  }

  getStageInfo(): { name: string; description: string; nextStage?: string } {
    const stageInfo = {
      'seed': {
        name: 'Seed',
        description: 'Your legacy journey begins with a single seed of intention.',
        nextStage: 'Sprout'
      },
      'sprout': {
        name: 'Sprout',
        description: 'Your legacy is taking root and beginning to grow.',
        nextStage: 'Sapling'
      },
      'sapling': {
        name: 'Sapling',
        description: 'Your tree is gaining strength and reaching for the sky.',
        nextStage: 'Young Tree'
      },
      'young-tree': {
        name: 'Young Tree',
        description: 'Your legacy tree is flourishing with new branches and leaves.',
        nextStage: 'Mature Tree'
      },
      'mature-tree': {
        name: 'Mature Tree',
        description: 'Your tree stands strong, providing shade and bearing fruit.',
        nextStage: 'Ancient Tree'
      },
      'ancient-tree': {
        name: 'Ancient Tree',
        description: 'Your legacy has become a monument of wisdom and love.',
      }
    }

    return stageInfo[this.treeState.stage]
  }

  resetGarden(): void {
    this.treeState = this.initializeTree()
    this.initializeMilestones()
  }
}

export const createLegacyGarden = () => new LegacyGarden()
