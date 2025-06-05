export interface AuthResponse {
  access_token: string
  user: {
    sub: string
    email: string
  }
}
