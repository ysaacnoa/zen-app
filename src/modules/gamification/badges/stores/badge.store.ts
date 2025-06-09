import { defineStore } from 'pinia'
import { BadgeService } from '../services/badge.service'
import { BadgeModel } from '../models/badge.model'

const badgeService = new BadgeService();

export const useBadgeStore = defineStore('badge', {
  state: () => ({
    badges: [] as BadgeModel[],
    loading: false,
    error: null as string | null,
    userBadges: [] as BadgeModel[]
  }),

  actions: {
    async fetchAllBadges() {
      this.loading = true
      this.error = null
      try {
        this.badges = (await badgeService.getAllBadges()).reverse()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch badges'
      } finally {
        this.loading = false
      }
    },

    async fetchUserBadges(userId: string) {
      this.loading = true
      this.error = null
      try {
        this.userBadges = await badgeService.getUserBadges(userId)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch user badges'
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
