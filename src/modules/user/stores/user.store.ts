import { defineStore } from 'pinia'
import type { UserProfile } from '@/modules/user/models/user-profile.schema'
import { userDAO } from '@/modules/user/dao/user.dao'

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
    error: null
  }),

  actions: {
    async loadProfile(this: UserState) {
      this.loading = true
      this.profile = await userDAO.getProfile()
      this.loading = false
    },

    clearProfile(this: UserState) {
      this.profile = null
    }
  },

  getters: {
    isAuthenticated(state: UserState): boolean {
      return !!state.profile
    },
    fullName(state: UserState): string {
      return state.profile ? `${state.profile.firstName} ${state.profile.lastName}` : ''
    }
  }
})
