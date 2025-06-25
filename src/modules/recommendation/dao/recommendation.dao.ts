import { ApiService } from '@/lib/api.service'
import { RecommendationsResponseSchema, type RecommendationsResponse } from '../models/recommendation.model'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}ia`

export class RecommendationDAO {
  private apiService: ApiService

  constructor() {
    this.apiService = new ApiService(API_BASE_URL)
  }

  async getRecommendations(userId: string): Promise<RecommendationsResponse> {
    return this.apiService.get(
      `/recommendation?userId=${userId}`,
      RecommendationsResponseSchema
    )
  }
}

export const recommendationDAO = new RecommendationDAO()
