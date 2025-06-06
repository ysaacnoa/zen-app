import { defineStore } from 'pinia'
import { BadgeDAO } from '../dao/badge.dao'
import { Badge } from '../models/badge.model'

export const useBadgeStore = defineStore('badge', {
  state: () => ({
    badges: [] as Badge[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchBadges() {
      this.loading = true
      this.error = null
      try {
        const dao = new BadgeDAO()
        this.badges = (await dao.getBadges()).reverse()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch badges'
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    unlockedBadges: (state) => state.badges.filter(b => b.isUnlocked),
    lockedBadges: (state) => state.badges.filter(b => !b.isUnlocked)
  }
})
