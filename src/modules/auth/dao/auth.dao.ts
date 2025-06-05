import { AuthResponseSchema, type AuthResponse } from '../models/auth-response.schema'
import { ApiService } from '@/lib/api.service'

const API_BASE_URL = 'http://localhost:3000/auth'

export class AuthDAO {
  private apiService: ApiService

  constructor() {
    this.apiService = new ApiService(API_BASE_URL)
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.apiService.post('/login', { email, password }, AuthResponseSchema)
  }

  async register(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.apiService.post('/register', {
      firstname,
      lastname,
      email,
      password
    }, AuthResponseSchema)
  }
}

export const authDAO = new AuthDAO()
