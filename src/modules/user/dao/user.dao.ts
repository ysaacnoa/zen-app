import { UserProfileSchema, type UserProfile } from '../models/user-profile.schema'
import { ApiService } from '@/lib/api.service'
import AuthTokenService from '@/lib/auth-token.service'

const API_BASE_URL = 'http://localhost:3000/user'

export class UserDAO {
  private apiService: ApiService

  constructor() {
    this.apiService = new ApiService(API_BASE_URL)
  }

  async getProfile(): Promise<UserProfile> {
    try {
      return await this.apiService.get('/me', UserProfileSchema)
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        AuthTokenService.clearToken()
        throw new Error('Session expired. Please login again.')
      }
      throw error
    }
  }
}

export const userDAO = new UserDAO()
