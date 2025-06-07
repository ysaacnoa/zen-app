import { ChallengeDAO } from '../dao/challenge.dao'
import { ConcreteChallengeFactory } from '../models/challenge.model'
import type { Challenge } from '../models/challenge.model'

export class ChallengeService {
  private dao = ChallengeDAO.getInstance()
  private factory = new ConcreteChallengeFactory()

  async getChallenges(userId: string): Promise<Challenge[]> {
    const data = await this.dao.getChallenges(userId)
    return data.map(challenge => this.factory.createChallenge(challenge))
  }

  async completeChallenge(challengeId: string): Promise<Challenge> {
    const data = await this.dao.completeChallenge(challengeId)
    return this.factory.createChallenge(data)
  }
}
