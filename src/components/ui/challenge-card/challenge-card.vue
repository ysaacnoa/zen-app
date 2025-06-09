<template>
  <div
    class="challenge-card"
    :class="[`type-${challenge.type.toLowerCase()}`, { 'disabled': !challenge.isActive }]"
    @click="handleClick"
  >
    <div class="card-header">
      <h3>{{ challenge.title }}</h3>
      <div class="flex items-center gap-2">
        <challenge-badge :type="challenge.type" />
        <TooltipProvider>
          <Tooltip v-if="!challenge.isActive">
            <TooltipTrigger as-child>
              <CheckCircleIcon
                v-if="challenge.completionCount >= challenge.requiredCompletions"
                class="w-4 h-4 text-green-500"
              />
              <ClockIcon
                v-else
                class="w-4 h-4 text-muted-foreground"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p v-if="challenge.completionCount >= challenge.requiredCompletions">
                ¡Desafío completado!
              </p>
              <p v-else>
                Disponible nuevamente mañana
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChallengeBadge from '@/components/ui/challenge-badge'
import { ClockIcon, CheckCircleIcon } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip'

const props = defineProps<{
  challenge: {
    id: string
    title: string
    type: string
    instructions: string
    completionCount: number
    requiredCompletions: number
    rewardXp: number
    isActive: boolean
  }
}>()

const emit = defineEmits(['click'])

const progressPercentage = computed(() => {
  return Math.min(
    (props.challenge.completionCount / props.challenge.requiredCompletions) * 100,
    100
  )
})

function handleClick() {
  if (props.challenge.isActive) {
    emit('click', props.challenge.id)
  }
}
</script>

<style scoped>
@import './challenge-card.css';
</style>
