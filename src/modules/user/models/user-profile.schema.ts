import { z } from 'zod'

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
  xp: z.number(),
  level: z.number(),
  authProvider: z.string()
})

export type UserProfile = z.infer<typeof UserProfileSchema>
