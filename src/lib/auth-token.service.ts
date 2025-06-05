class AuthTokenService {
  private static TOKEN_KEY = 'zen_app_auth_token'

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }
}

export default AuthTokenService
