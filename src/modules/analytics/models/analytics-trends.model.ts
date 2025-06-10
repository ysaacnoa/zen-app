import type { ChallengeType } from "@/modules/gamification/challenges/models/challenge.model"
import type { ProgressStatus } from "@/modules/gamification/challenges/models/progress-status.enum"

export interface AnalyticsTrend {
  completedAt: Date
  status: ProgressStatus
  currentCompletions: number
  challengeId: string
  type: ChallengeType
  challenge: {
    title: string
    type: ChallengeType
  }
}

export type AnalyticsTrends = AnalyticsTrend[]
