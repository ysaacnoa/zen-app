import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recommendation } from '../models/recommendation.model'
import { recommendationDAO } from '../dao/recommendation.dao'

export const useRecommendationStore = defineStore('recommendation', () => {
  const recommendations = ref<Recommendation[]>([])
  const isLoading = ref(false)

  async function getRecommendations(userId: string) {
    isLoading.value = true
    // Only fetch if we don't already have data
    if (recommendations.value.length === 0) {
      recommendations.value = await recommendationDAO.getRecommendations(userId)
    }
    isLoading.value = false
  }

  function clearRecommendations() {
    recommendations.value = []
  }

  return {
    recommendations,
    isLoading,
    getRecommendations,
    clearRecommendations
  }
})
