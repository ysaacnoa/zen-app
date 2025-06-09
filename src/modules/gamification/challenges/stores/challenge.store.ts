import { defineStore } from 'pinia'
import { ChallengeService } from '../services/challenge.service'
import type { Challenge } from '../models/challenge.model'

interface ChallengeState {
  challenges: Challenge[]
  loading: boolean
  error: string | null
  initialized: boolean
}

const service = new ChallengeService()

export const useChallengeStore = defineStore('challenge', {
  state: (): ChallengeState => ({
    challenges: [],
    loading: false,
    error: null,
    initialized: false
  }),

  actions: {
    async fetchChallenges(userId: string, forceRefresh = false) {
      if (this.initialized && !forceRefresh) return
      if (this.loading) return

      this.loading = true
      this.error = null
      try {
        if (forceRefresh) {
          this.initialized = false
        }

        this.challenges = await service.getChallenges(userId)
        console.log('Challenges received:', JSON.stringify(this.challenges, null, 2))
        console.debug('[CHALLENGES]', this.challenges)
        this.initialized = true
      } catch (err) {
        this.error = String(err)
      } finally {
        this.loading = false
      }
    },

    async ensureChallenges(userId: string) {
      if (!this.initialized) {
        await this.fetchChallenges(userId)
      }
      return this.challenges
    },

    async completeChallenge(userId: string, challengeId: string, metadata: object[]) {
      this.loading = true
      try {
        return await service.completeChallenge(userId, challengeId, metadata)
      } catch (err) {
        this.error = String(err)
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    completedChallenges: (state) => state.challenges.filter(
      c => c.completionCount >= c.requiredCompletions
    ),
    pendingChallenges: (state) => state.challenges.filter(
      c => c.completionCount < c.requiredCompletions
    )
  }
})
