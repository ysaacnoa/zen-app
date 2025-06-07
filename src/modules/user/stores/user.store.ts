import { defineStore } from 'pinia'
import type { UserProfile } from '@/modules/user/models/user-profile.schema'
import { userDAO } from '@/modules/user/dao/user.dao'

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  initialized: boolean
}

interface UserActions {
  fetchProfile: () => Promise<void>
  ensureProfile: () => Promise<UserProfile | null>
  clearProfile: () => void
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
    error: null,
    initialized: false
  }),

  actions: {
    async fetchProfile(this: UserState & UserActions) {
      if (this.initialized) return
      if (this.loading) return

      this.loading = true
      try {
        this.profile = await userDAO.getProfile()
        this.initialized = true
      } catch (err) {
        this.error = String(err)
      } finally {
        this.loading = false
      }
    },

    async ensureProfile(this: UserState & UserActions) {
      if (!this.initialized) {
        await this.fetchProfile()
      }
      return this.profile
    },

    clearProfile(this: UserState) {
      this.profile = null
    },

    async updateProfile(this: UserState, updates: Partial<UserProfile>) {
      if (!this.profile) return

      this.loading = true
      const updatedProfile = await userDAO.updateProfile(updates)
      this.profile = updatedProfile
      this.loading = false
    }
  },

  getters: {
    isAuthenticated(state: UserState): boolean {
      return !!state.profile
    },
    fullName(state: UserState): string {
      return state.profile ? `${state.profile.firstName} ${state.profile.lastName}` : ''
    },
    getProfile(state: UserState): UserProfile | null {
      return state.profile
    }
  }
})
