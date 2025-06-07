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

        <button v-if="challenge.type === 'CLICK'" class="complete-btn" @click="completeChallenge">
          Complete Challenge
        </button>
      </div>

      <div class="challenge-component">
        <audio-challenge v-if="challenge.type === 'AUDIO'" :challenge="challenge" />
        <text-challenge v-else-if="challenge.type === 'TEXT'" :challenge="challenge" />
        <form-challenge v-else-if="challenge.type === 'FORM'" :challenge="challenge" />
        <timer-challenge v-else-if="challenge.type === 'TIMER'" :challenge="challenge" />
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
import TextChallenge from './components/text-challenge.vue'
import FormChallenge from './components/form-challenge.vue'
import TimerChallenge from './components/timer-challenge.vue'

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
@import './challenge.detail.css';
</style>
