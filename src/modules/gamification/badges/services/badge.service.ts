import { BadgeModel } from '../models/badge.model';
import { BadgeDAO} from '../dao/badge.dao';

export class BadgeService {
  private dao = BadgeDAO.getInstance()

  async getAllBadges(): Promise<BadgeModel[]> {
    const response = await this.dao.getAllBadges();
    return response.map((badge) => new BadgeModel(badge));
  }

  async getUserBadges(userId: string): Promise<BadgeModel[]> {
    const response = await this.dao.getUserBadges(userId);
    return response.map((badge) => new BadgeModel(badge));
  }
}
