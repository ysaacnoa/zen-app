import { z } from 'zod'

export const RecommendationSchema = z.object({
  id: z.string(),
  content: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type Recommendation = z.infer<typeof RecommendationSchema>

export const RecommendationsResponseSchema = z.array(RecommendationSchema)
export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>
