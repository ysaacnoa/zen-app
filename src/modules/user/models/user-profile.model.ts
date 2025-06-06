export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  xp: number
  level: number
  authProvider: string
}
