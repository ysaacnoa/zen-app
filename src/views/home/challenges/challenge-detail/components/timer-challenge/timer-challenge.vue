<template>
  <div class="timer-container">
    <div
      class="timer-circle"
      :class="{ 'completed': isCompleted, 'active': isActive }"
      @click="toggleTimer"
    >
      <div class="timer-display">
        {{ formattedTime }}
      </div>
    </div>

    <div class="timer-controls">
      <button v-if="!isCompleted && !isActive" @click="startTimer" class="timer-btn start">
        <PlayIcon class="h-4 w-4" />
      </button>
      <button v-if="!isCompleted && isActive" @click="pauseTimer" class="timer-btn pause">
        <PauseIcon class="h-4 w-4" />
      </button>
      <button @click="resetTimer" class="timer-btn reset">
        <RefreshCwIcon class="h-4 w-4" />
      </button>
      <button
        v-if="isCompleted"
        @click="completeChallenge"
        class="timer-btn complete bg-gradient"
      >
        Complete Challenge
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'open-complete-challenge', payload: object): void
}>()
import { TimerChallenge } from '@/modules/gamification/challenges/models/challenge.model'
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-vue-next'

const props = defineProps<{
  challenge: object
}>()

const timerChallenge = ref(props.challenge as TimerChallenge)

const targetSeconds = ref(timerChallenge.value.metadata.seconds)
const elapsedSeconds = ref(0)
const timerInterval = ref<number | null>(null)
const isActive = ref(false)
const isCompleted = ref(false)
const distractions = ref(0)

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60)
  const seconds = elapsedSeconds.value % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

// Progress is handled by CSS via --progress variable

function startTimer() {
  if (timerInterval.value) return

  isActive.value = true
  timerInterval.value = setInterval(() => {
    elapsedSeconds.value++
    const progress = (elapsedSeconds.value / targetSeconds.value) * 100
    document.documentElement.style.setProperty('--progress', progress.toString())

    if (elapsedSeconds.value >= targetSeconds.value) {
      isCompleted.value = true
      pauseTimer()
    }
  }, 1000)
}

function pauseTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
    // Count as distraction if timer was active
    if (isActive.value && elapsedSeconds.value < targetSeconds.value) {
      distractions.value++
    }
  }
  isActive.value = false
}

function resetTimer() {
  pauseTimer()
  elapsedSeconds.value = 0
  isCompleted.value = false
  distractions.value = 0
}

function toggleTimer() {
  if (isActive.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function completeChallenge() {
  console.log(`Challenge completed in ${formattedTime.value}`)
  emit('open-complete-challenge', {
    timeMetrics: {
      completionRatio: elapsedSeconds.value / targetSeconds.value,
      startTime: new Date(Date.now() - (elapsedSeconds.value * 1000)).toISOString(),
      endTime: new Date().toISOString()
    },
    performance: {
      consistencyScore: calculateConsistencyScore(),
      distractions: distractions.value
    }
  })
}

function calculateConsistencyScore(): number {
  if (elapsedSeconds.value >= targetSeconds.value) {
    return 1.0
  }
  return elapsedSeconds.value / targetSeconds.value
}

onUnmounted(() => {
  pauseTimer()
})
</script>

<style scoped>
@import './timer-challenge.css';
</style>
