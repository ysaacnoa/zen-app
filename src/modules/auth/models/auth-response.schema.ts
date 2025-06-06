import { z } from 'zod'

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    sub: z.string(),
    email: z.string()
  })
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>
