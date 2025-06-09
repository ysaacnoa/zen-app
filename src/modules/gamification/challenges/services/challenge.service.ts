import { ChallengeDAO } from '../dao/challenge.dao'
import { ConcreteChallengeCompletionFactory, type ChallengeCompletion } from '../models/challenge-completion.model'
import { ConcreteChallengeFactory } from '../models/challenge.model'
import type { Challenge } from '../models/challenge.model'

export class ChallengeService {
  private dao = ChallengeDAO.getInstance()
  private factoryChallenge = new ConcreteChallengeFactory()
  private factoryChallengeCompletion = new ConcreteChallengeCompletionFactory()

  async getChallenges(userId: string): Promise<Challenge[]> {
    const data = await this.dao.getChallenges(userId)
    return data.map(challenge => this.factoryChallenge.createChallenge(challenge))
  }

  async completeChallenge(userId: string, challengeId: string, metadata: object[] ): Promise<ChallengeCompletion> {
    const data = await this.dao.completeChallenge(userId, challengeId, metadata)
    console.debug('[CHALLENGE COMPLETION RESPONSE]', data)
    return this.factoryChallengeCompletion.createCompletion(data)
  }
}
