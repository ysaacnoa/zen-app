<template>
  <div class="feed-view">
    <div v-if="userStore.loading || recommendationStore.isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div
        v-for="recommendation in recommendationStore.recommendations"
        :key="recommendation.id"
        class="recommendation"
        v-html="renderMarkdown(recommendation.content)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { useUserStore } from '@/modules/user/stores/user.store'
import { useRecommendationStore } from '@/modules/recommendation/stores/recommendation.store'

defineOptions({
  name: 'FeedView'
})

const userStore = useUserStore()
const recommendationStore = useRecommendationStore()
const error = ref('')

const renderMarkdown = (content: string) => {
  return marked.parse(content)
}

onMounted(async () => {
  try {
    const profile = await userStore.ensureProfile()
    if (!profile) throw new Error('Failed to load user profile')
    await recommendationStore.getRecommendations(profile.id)
  } catch (err) {
    error.value = String(err)
  }
})
</script>

<style scoped>
@import './feed.css';
</style>
