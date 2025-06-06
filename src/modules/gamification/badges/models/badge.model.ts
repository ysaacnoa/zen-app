export class Badge {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public xpRequired: number,
    public createdAt: string,
    public imagePath: string,
    public isActive: boolean
  ) {}

  get isUnlocked(): boolean {
    return this.xpRequired === 0
  }

  get formattedXp(): string {
    return this.xpRequired.toLocaleString()
  }
}
