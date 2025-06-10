import type { AnalyticsStats } from '../models/analytics-stats.model'
import type { AnalyticsTypes } from '../models/analytics-types.model'
import type { AnalyticsTrends } from '../models/analytics-trends.model'
import { ApiService } from '@/lib/api.service'
import {
  AnalyticsStatsSchema,
  AnalyticsTypesSchema,
  AnalyticsTrendsSchema,
  AnalyticsDistributionSchema
} from '../models/analytics-schemas'
import type { AnalyticsDistribution } from '../models/analytics-distribution.model'

const api = new ApiService('http://localhost:3000')

export class AnalyticsDao {
  async getStats(userId: string): Promise<AnalyticsStats> {
    return api.get(`/analytics/stats?userId=${userId}`, AnalyticsStatsSchema)
  }

  async getTypes(userId: string): Promise<AnalyticsTypes> {
    return api.get(`/analytics/types?userId=${userId}`, AnalyticsTypesSchema)
  }

  async getTrends(userId: string): Promise<AnalyticsTrends> {
    return api.get(`/analytics/trends?userId=${userId}`, AnalyticsTrendsSchema)
  }

  async getDistribution(userId: string): Promise<AnalyticsDistribution> {
    return api.get(`/analytics/distribution?userId=${userId}`, AnalyticsDistributionSchema)
  }
}

export default new AnalyticsDao()
