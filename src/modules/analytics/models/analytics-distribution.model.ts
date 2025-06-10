import type { ChallengeType } from "@/modules/gamification/challenges/models/challenge.model"

export interface AnalyticDistribution {
  date: string
  types: {
    type: ChallengeType
    count: number
  }[]
}

export type AnalyticsDistribution = AnalyticDistribution[]