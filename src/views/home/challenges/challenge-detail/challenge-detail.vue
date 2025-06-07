<template>
  <div class="challenge-detail">
    <button class="back-btn" @click="goBack">
      ← Back to Challenges
    </button>

    <div v-if="challenge" class="challenge-content">
      <div class="challenge-info">
        <h1>{{ challenge.title }}</h1>
        <div class="challenge-type">{{ challenge.type }}</div>
        <p>{{ challenge.instructions }}</p>

        <div class="stats">
          <div>Completions: {{ challenge.completionCount }}/{{ challenge.requiredCompletions }}</div>
          <div>XP Reward: {{ challenge.rewardXp }}</div>
        </div>

        <button class="complete-btn" @click="completeChallenge">
          Complete Challenge
        </button>
      </div>

      <div class="challenge-component" v-if="challenge.type === 'AUDIO'">
        <audio-challenge :challenge="challenge" />
      </div>
    </div>
    <div v-else>
      Loading challenge details...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useChallengeStore } from '@/modules/gamification/challenges/stores/challenge.store'
import type { Challenge } from '@/modules/gamification/challenges/models/challenge.model'
import AudioChallenge from './components/audio-challenge.vue'

const route = useRoute()
const router = useRouter()
const challengeStore = useChallengeStore()
const challenge = ref<Challenge | null>(null)

onMounted(async () => {
  const challenges = await challengeStore.ensureChallenges(route.params.id as string)
  challenge.value = challenges.find(c => c.id === route.params.id) || null
})

function goBack() {
  router.push({ name: 'challenges' })
}

async function completeChallenge() {
  if (typeof route.params.id === 'string') {
    await challengeStore.completeChallenge(route.params.id)
    goBack()
  }
}
</script>

<style scoped>
.challenge-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.challenge-content {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.challenge-info {
  flex: 1;
  min-width: 300px;
}

.challenge-component {
  flex: 1;
  min-width: 400px;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.back-btn:hover {
  color: #333;
}

.complete-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.complete-btn:hover {
  background-color: #45a049;
}

.stats {
  margin: 1rem 0;
  color: #666;
}

.challenge-type {
  font-weight: bold;
  color: #666;
  margin-bottom: 1rem;
}
</style>
