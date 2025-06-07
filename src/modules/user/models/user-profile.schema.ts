import { z } from 'zod'

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  socialMediaLinks: z.record(z.string()).nullable().optional(),
  xp: z.number(),
  level: z.number(),
  authProvider: z.string()
})

export type UserProfile = z.infer<typeof UserProfileSchema>
