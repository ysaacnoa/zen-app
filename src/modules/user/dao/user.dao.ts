import { UserProfileSchema, type UserProfile } from '../models/user-profile.schema'
import { ApiService } from '@/lib/api.service'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/user`

export class UserDAO {
  private apiService: ApiService

  constructor() {
    this.apiService = new ApiService(API_BASE_URL)
  }

  async getProfile(): Promise<UserProfile> {
    return this.apiService.get('/me', UserProfileSchema)
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      return await this.apiService.patch('/me', updates, UserProfileSchema)
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw new Error('Failed to update profile. Please try again later.')
    }
  }
}

export const userDAO = new UserDAO()
