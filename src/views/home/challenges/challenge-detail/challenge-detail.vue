<template>
  <div class="challenge-detail">
    <button class="back-btn" @click="goBack">
      ← Back to Challenges
    </button>

    <div v-if="challenge" class="challenge-content">
      <div class="challenge-info">
        <h1>{{ challenge.title }}</h1>
        <challenge-badge class="my-2" :type="challenge.type"/>
        <p>{{ challenge.instructions }}</p>

        <div class="stats">
          <div>Completions: {{ challenge.completionCount }}/{{ challenge.requiredCompletions }}</div>
          <div>XP Reward: {{ challenge.rewardXp }}</div>
        </div>
      </div>

      <div class="challenge-component">
        <component
          :is="challengeComponents[challenge.type]"
          :challenge="challenge"
          @open-complete-challenge="handleCompleteChallenge"
        />
      </div>
    </div>
    <div v-else>
      Loading challenge details...
    </div>

    <ChallengeRewardModal
      v-if="challenge"
      :challenge="challenge"
      :isOpen="showRewardModal"
      @update:open="showRewardModal = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import ChallengeRewardModal from './challenge-reward-modal.vue'
import { useChallengeStore } from '@/modules/gamification/challenges/stores/challenge.store'
import type { Challenge } from '@/modules/gamification/challenges/models/challenge.model'
import ChallengeBadge from '@/components/ui/challenge-badge'
import { defineAsyncComponent } from 'vue'

const challengeComponents = {
  AUDIO: defineAsyncComponent(() => import('./components/audio-challenge')),
  TEXT: defineAsyncComponent(() => import('./components/text-challenge')),
  FORM: defineAsyncComponent(() => import('./components/form-challenge')),
  TIMER: defineAsyncComponent(() => import('./components/timer-challenge')),
  CLICK: defineAsyncComponent(() => import('./components/click-challenge'))
}

const route = useRoute()
const router = useRouter()
const challengeStore = useChallengeStore()
const challenge = ref<Challenge | null>(null)
const showRewardModal = ref(false)

onMounted(async () => {
  const challenges = await challengeStore.ensureChallenges(route.params.id as string)
  challenge.value = challenges.find(c => c.id === route.params.id) || null
})

function goBack() {
  router.push({ name: 'challenges' })
}

function handleCompleteChallenge(payload: unknown) {
  const data = payload as object;
  if (challenge.value) {
    console.log('Challenge completed:', {
      type: challenge.value.type,
      data,
      timestamp: new Date().toISOString()
    })

    // Increment completion count for the progress animation
    challenge.value.completionCount = Math.min(
      challenge.value.completionCount + 1,
      challenge.value.requiredCompletions
    )
    showRewardModal.value = true
  }
}

</script>

<style scoped>
@import './challenge.detail.css';
</style>
