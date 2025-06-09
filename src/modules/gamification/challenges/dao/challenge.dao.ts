import { ApiService } from '@/lib/api.service'
import { ChallengeType } from '../models/challenge.model'
import { z } from 'zod'

const challengeResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  rewardXp: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  instructions: z.string(),
  requiredCompletions: z.number(),
  type: z.nativeEnum(ChallengeType),
  completionCount: z.number(),
  userId: z.string(),
  metadata: z.record(z.unknown()).optional(),
  isActive: z.boolean(),
  lastCompletionDate: z.string().nullable(),
  isCompleted: z.boolean()
})

export class ChallengeDAO {
  private static instance: ChallengeDAO
  private apiService = new ApiService(import.meta.env.VITE_API_BASE_URL)

  public static getInstance(): ChallengeDAO {
    if (!ChallengeDAO.instance) {
      ChallengeDAO.instance = new ChallengeDAO()
    }
    return ChallengeDAO.instance
  }

  async getChallenges(userId: string) {
    try {
      return await this.apiService.get(
        `/challenges?userId=${userId}`,
        z.array(challengeResponseSchema))
    } catch (error) {
      console.error('Failed to fetch challenges:', error)
      throw error
    }
  }

  async completeChallenge(challengeId: string) {
    try {
      return await this.apiService.post(
        `/challenges/${challengeId}/complete`,
        {},
        challengeResponseSchema
      )
    } catch (error) {
      console.error('Failed to complete challenge:', error)
      throw error
    }
  }
}
