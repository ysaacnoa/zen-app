import { z } from 'zod'

export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  xpRequired: z.number(),
  createdAt: z.string(),
  imagePath: z.string(),
  isActive: z.boolean()
})

export type Badge = z.infer<typeof BadgeSchema>

export class BadgeModel implements Badge {
  public id: string
  public name: string
  public description: string
  public xpRequired: number
  public createdAt: string
  public imagePath: string
  public isActive: boolean

  constructor(data: Badge) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.xpRequired = data.xpRequired
    this.createdAt = data.createdAt
    this.imagePath = data.imagePath
    this.isActive = data.isActive
  }



  get isUnlocked(): boolean {
    return this.xpRequired === 0
  }

  get formattedXp(): string {
    return this.xpRequired.toLocaleString()
  }
}
