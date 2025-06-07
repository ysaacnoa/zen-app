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
  }
  isActive.value = false
}

function resetTimer() {
  pauseTimer()
  elapsedSeconds.value = 0
  isCompleted.value = false
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
}

onUnmounted(() => {
  pauseTimer()
})
</script>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.timer-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.timer-circle {
  --progress: 0;
}

.timer-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: conic-gradient(
    var(--color-primary) 0%,
    var(--color-primary) calc(var(--progress) * 1%),
    #f0f0f0 calc(var(--progress) * 1%),
    #f0f0f0 100%
  );
  opacity: 0.2;
}

.timer-circle.active {
  animation: pulse 1.5s infinite;
}

.timer-circle.completed {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  color: white;
}

.timer-display {
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 1;
}

.timer-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.timer-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start {
  background-color: var(--color-primary);
  color: white;
}

.pause {
  background-color: #ff9800;
  color: white;
}

.reset {
  background-color: #f44336;
  color: white;
}

.complete {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  color: white;
}

.timer-btn svg,
.timer-btn .lucide-icon {
  width: 1rem;
  height: 1rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--color-primary);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 77, 77, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
  }
}
</style>
