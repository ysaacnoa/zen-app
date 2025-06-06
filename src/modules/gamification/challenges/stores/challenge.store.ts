import { defineStore } from 'pinia'
import { challengeDAO } from '../dao/challenge.dao'
import type { Challenge } from '../models/challenge.model'

interface ChallengeState {
  challenges: Challenge[]
  loading: boolean
  error: string | null
  initialized: boolean
}

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
        this.challenges = await challengeDAO.getChallenges(userId)
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
        const updatedChallenge = await challengeDAO.completeChallenge(challengeId)
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
