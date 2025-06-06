import { z } from 'zod'
import { ApiService } from '@/lib/api.service'
import { Badge } from '../models/badge.model'

const BadgeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  xpRequired: z.number(),
  createdAt: z.string(),
  imagePath: z.string(),
  isActive: z.boolean()
})

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

export class BadgeDAO {
  private apiService = new ApiService(API_BASE_URL)

  async getBadges(): Promise<Badge[]> {
    const response = await this.apiService.get('/badges', z.array(BadgeResponseSchema))
    return response.map(badge => new Badge(
      badge.id,
      badge.name,
      badge.description,
      badge.xpRequired,
      badge.createdAt,
      badge.imagePath,
      badge.isActive
    ))
  }
}
