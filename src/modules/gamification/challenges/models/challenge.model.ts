export type ChallengeType = 'CLICK' | 'FORM' | 'AUDIO' | 'TIMER' | 'TEXT'

export interface Challenge {
  id: string
  title: string
  rewardXp: number
  createdAt: string
  updatedAt: string
  instructions: string
  requiredCompletions: number
  type: ChallengeType
  completionCount: number
  userId: string
}
