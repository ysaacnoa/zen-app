<template>
  <div class="challenges-view">
    <div v-if="challengeStore.loading">Loading challenges...</div>
    <div v-else-if="challengeStore.error" class="error">
      {{ challengeStore.error }}
    </div>
    <div v-else class="challenges-grid">
      <div
        v-for="challenge in challengeStore.pendingChallenges"
        :key="challenge.id"
        class="challenge-card"
        :class="`type-${challenge.type.toLowerCase()}`"
      >
        <div class="card-header">
          <h3>{{ challenge.title }}</h3>
          <div class="challenge-type">{{ challenge.type }}</div>
        </div>

        <div class="card-content">
          <p>{{ challenge.instructions }}</p>
          <div class="stats">
            <div>Completions: {{ challenge.completionCount }}/{{ challenge.requiredCompletions }}</div>
            <div>XP Reward: {{ challenge.rewardXp }}</div>
          </div>
        </div>

        <div class="card-footer">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(challenge.completionCount / challenge.requiredCompletions) * 100}%` }"
            ></div>
          </div>
          <button
            class="complete-btn"
            @click="completeChallenge(challenge.id)"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengeStore } from '@/modules/gamification/challenges/stores/challenge.store'
import { onMounted } from 'vue'
import { useUserStore } from '@/modules/user/stores/user.store'

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

async function completeChallenge(challengeId: string) {
  await challengeStore.completeChallenge(challengeId)
}
</script>

<style scoped>
@import './index.css';
</style>
