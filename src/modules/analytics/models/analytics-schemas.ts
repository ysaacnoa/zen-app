import { z } from 'zod'

import type { AnalyticsStats } from './analytics-stats.model'
import type { AnalyticsType } from './analytics-types.model'
import type { AnalyticsTrend } from './analytics-trends.model'
import { ChallengeType } from '@/modules/gamification/challenges/models/challenge.model'
import { ProgressStatus } from '@/modules/gamification/challenges/models/progress-status.enum'
import type { AnalyticDistribution } from './analytics-distribution.model'

export const AnalyticsStatsSchema = z.object({
  completed: z.number(),
  inProgress: z.number(),
  pending: z.number(),
  total: z.number(),
  completionRate: z.number(),
  progressRate: z.number()
}) satisfies z.ZodType<AnalyticsStats>

export const AnalyticsTypeSchema = z.object({
  type: z.nativeEnum(ChallengeType),
  count: z.number()
}) satisfies z.ZodType<AnalyticsType>

export const AnalyticsTypesSchema = z.array(AnalyticsTypeSchema)

export const AnalyticsTrendSchema = z.object({
  completedAt: z.coerce.date(),
  status: z.nativeEnum(ProgressStatus),
  currentCompletions: z.number(),
  challengeId: z.string(),
  type: z.nativeEnum(ChallengeType),
  challenge: z.object({
    title: z.string(),
    type: z.nativeEnum(ChallengeType)
  })
}) satisfies z.ZodType<AnalyticsTrend>

export const AnalyticsTrendsSchema = z.array(AnalyticsTrendSchema)

export const DailyDistributionSchema = z.object({
  date: z.string(),
  types: z.array(
    z.object({
      type: z.nativeEnum(ChallengeType),
      count: z.number()
    })
  )
}) satisfies z.ZodType<AnalyticDistribution>

export const AnalyticsDistributionSchema = z.array(DailyDistributionSchema)
