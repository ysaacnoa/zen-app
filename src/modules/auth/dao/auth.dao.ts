import { AuthResponseSchema, type AuthResponse } from '../models/auth-response.schema';
import { ApiService } from '@/lib/api.service';
import AuthTokenService from '@/lib/auth-token.service';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}auth`;

export class AuthDAO {
  isAuthenticated(): boolean {
    return !!AuthTokenService.getToken();
  }
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService(API_BASE_URL);
  }

  async login(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const auth = await this.apiService.post('/login', { email, password }, AuthResponseSchema);
    AuthTokenService.setToken(auth.access_token);
    return auth;
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await this.apiService.post(
      '/register',
      {
        firstName,
        lastName,
        email,
        password,
      },
      AuthResponseSchema,
    );
    AuthTokenService.setToken(response.access_token);
    return response;
  }
}

export const authDAO = new AuthDAO();
