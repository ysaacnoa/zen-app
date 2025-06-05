import { AuthResponseSchema, type AuthResponse } from '../models/auth-response.schema'
import { ApiService } from '@/lib/api.service'
import AuthTokenService from '@/lib/auth-token.service'
import { userDAO } from '@/modules/user/dao/user.dao'
import type { UserProfile } from '@/modules/user/models/user-profile.schema'

const API_BASE_URL = 'http://localhost:3000/auth'

export class AuthDAO {
  private apiService: ApiService

  constructor() {
    this.apiService = new ApiService(API_BASE_URL)
  }

  async login(email: string, password: string): Promise<{auth: AuthResponse, profile: UserProfile}> {
    const auth = await this.apiService.post('/login', { email, password }, AuthResponseSchema)
    AuthTokenService.setToken(auth.access_token)
    const profile = await userDAO.getProfile()
    return { auth, profile }
  }

  async register(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.apiService.post('/register', {
      firstname,
      lastname,
      email,
      password
    }, AuthResponseSchema)
    AuthTokenService.setToken(response.access_token)
    return response
  }
}

export const authDAO = new AuthDAO()
