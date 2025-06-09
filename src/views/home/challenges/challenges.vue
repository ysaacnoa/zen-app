<template>
  <div class="challenges-view">
    <router-view v-if="$route.name === 'challenge-detail'"/>
    <template v-else>
      <div v-if="challengeStore.loading">Loading challenges...</div>
      <div v-else-if="challengeStore.error" class="error">
        {{ challengeStore.error }}
      </div>
      <div v-else class="challenges-grid">
        <challenge-card
          v-for="challenge in challengeStore.pendingChallenges"
          :key="challenge.id"
          :challenge="challenge"
          @click="viewChallenge"
        />
        <challenge-card
          v-for="challenge in challengeStore.completedChallenges"
          :key="challenge.id"
          :challenge="challenge"
          @click="viewChallenge"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useChallengeStore } from '@/modules/gamification/challenges/stores/challenge.store'
import { onMounted } from 'vue'
import { useUserStore } from '@/modules/user/stores/user.store'
import { router } from '@/modules/routes'
import ChallengeCard from '@/components/ui/challenge-card'

const userStore = useUserStore()
const challengeStore = useChallengeStore()

defineOptions({
  name: 'ChallengesView'
})

onMounted(async () => {
  const profile = await userStore.ensureProfile()
  if (profile) {
    await challengeStore.ensureChallenges(profile.id)
  }
})

// Watcher removed - store updates are handled by the store's actions

async function viewChallenge(challengeId: string) {
  await router.push({name: 'challenge-detail', params:{id: challengeId}})
}
</script>

<style scoped>
@import './challenges.css';
</style>
