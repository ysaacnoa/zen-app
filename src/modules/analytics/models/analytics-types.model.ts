import type { ChallengeType } from "@/modules/gamification/challenges/models/challenge.model"


export interface AnalyticsType {
  type: ChallengeType
  count: number
}

export type AnalyticsTypes = AnalyticsType[]
