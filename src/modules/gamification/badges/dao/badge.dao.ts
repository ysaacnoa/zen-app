import { z } from 'zod'
import { ApiService } from '@/lib/api.service'
import { BadgeSchema } from '@/modules/gamification/badges/models/badge.model'

export class BadgeDAO {
  private static instance: BadgeDAO
  private apiService: ApiService

  private constructor() {
    this.apiService = new ApiService(`${import.meta.env.VITE_API_BASE_URL}`)
  }

  public static getInstance(): BadgeDAO {
    if (!BadgeDAO.instance) {
      BadgeDAO.instance = new BadgeDAO()
    }
    return BadgeDAO.instance
  }

  async getAllBadges() {
    try {
      return await this.apiService.get('badges', z.array(BadgeSchema))
    } catch (error) {
      console.error('Error fetching all badges:', error)
      throw error
    }
  }

  async getUserBadges(userId: string) {
    try {
      return await this.apiService.get(`badges/user?userId=${userId}`, z.array(BadgeSchema))
    } catch (error) {
      console.error(`Error fetching badges for user ${userId}:`, error)
      throw error
    }
  }
}
