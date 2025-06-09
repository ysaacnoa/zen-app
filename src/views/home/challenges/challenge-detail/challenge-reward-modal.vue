<template>
  <Dialog :open="isOpen" @update:open="onOpenChange">
    <DialogContent class="max-w-md">
      <DialogHeader class="text-foreground">
        <DialogTitle class="">Challenge Completed!</DialogTitle>
        <DialogDescription>
          Congratulations on completing this challenge
        </DialogDescription>
      </DialogHeader>

      <div class="text-foreground space-y-4">
        <!-- Challenge Info -->
        <div class="flex items-center gap-4">
          <ChallengeBadge :type="challenge.type" />
          <h3 class="text-lg font-medium">{{ challenge.title }}</h3>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Progress</span>
            <span>{{ challenge.completionCount }}/{{ challenge.requiredCompletions }}</span>
          </div>
          <div class="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-1000 ease-out"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>

        <!-- Reward Info -->
        <div class="p-4 rounded-lg">
          <h4 class="font-medium mb-2">Rewards Earned</h4>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <StarIcon class="w-3 h-3 text-yellow-800" />
            </div>
            <span>+{{ challenge.rewardXp }} XP</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="onClose" class="w-full">
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { StarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ChallengeBadge from '@/components/ui/challenge-badge'
interface Challenge {
  id: string
  title: string
  type: string
  completionCount: number
  requiredCompletions: number
  rewardXp: number
}
import confetti from 'canvas-confetti'

const props = defineProps<{
  challenge: Challenge
  isOpen: boolean
}>()

const emit = defineEmits(['update:open'])

const progressPercentage = computed(() => {
  return Math.min(
    (props.challenge.completionCount / props.challenge.requiredCompletions) * 100,
    100
  )
})

function onOpenChange(open: boolean) {
  emit('update:open', open)
}

const router = useRouter()

function onClose() {
  emit('update:open', false)
  router.push({name: 'challenges'})
}

// Create confetti canvas outside dialog
const confettiCanvas = document.createElement('canvas')
confettiCanvas.style.position = 'fixed'
confettiCanvas.style.top = '0'
confettiCanvas.style.left = '0'
confettiCanvas.style.width = '100vw'
confettiCanvas.style.height = '100vh'
confettiCanvas.style.pointerEvents = 'none'
confettiCanvas.style.zIndex = '999999'
document.body.appendChild(confettiCanvas)

onMounted(() => {
  if (props.isOpen) {
    const myConfetti = confetti.create(confettiCanvas, {
      resize: true,
      useWorker: true
    })

    myConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Clean up after 3 seconds
    setTimeout(() => {
      confettiCanvas.remove()
    }, 3000)
  }
})

onBeforeUnmount(() => {
  if (confettiCanvas.parentNode) {
    confettiCanvas.remove()
  }
})
</script>
