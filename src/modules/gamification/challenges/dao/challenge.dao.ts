import { ApiService } from '@/lib/api.service'
import type { Challenge } from '../models/challenge.model'
import { z } from 'zod'

const apiService = new ApiService(import.meta.env.VITE_API_BASE_URL)

const challengeArraySchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  rewardXp: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  instructions: z.string(),
  requiredCompletions: z.number(),
  type: z.enum(['CLICK', 'FORM', 'AUDIO', 'TIMER', 'TEXT']),
  completionCount: z.number(),
  userId: z.string()
}))

const challengeSchema = challengeArraySchema.element

export const challengeDAO = {
  async getChallenges(userId: string): Promise<Challenge[]> {
    return apiService.get(`/challenges?userId=${userId}`, challengeArraySchema)
  },

  async completeChallenge(challengeId: string): Promise<Challenge> {
    return apiService.post(`/challenges/${challengeId}/complete`, {}, challengeSchema)
  }
}
