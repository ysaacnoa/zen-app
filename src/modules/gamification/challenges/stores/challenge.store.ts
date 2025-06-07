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
    async fetchChallenges(userId: string) {
      if (this.initialized) return
      if (this.loading) return

      this.loading = true
      this.error = null
      try {

        this.challenges = await service.getChallenges(userId)
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

    async completeChallenge(challengeId: string) {
      this.loading = true
      try {
        const updatedChallenge = await service.completeChallenge(challengeId)
        this.challenges = this.challenges.map(c =>
          c.id === challengeId ? updatedChallenge : c
        )
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
