<template>
  <Badge :variant="variant" :class="`type-${type.toLowerCase()}`">
    {{ type }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

defineProps<{
  type: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}>()
</script>

<style scoped>
.type-click {
  --glow-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.type-form {
  --glow-color: var(--color-tertiary);
  background-color: var(--color-tertiary);
  color: white;
}

.type-audio {
  --glow-color: oklch(70% 0.2 50);
  background-color: oklch(70% 0.2 50);
  color: white;
}

.type-timer {
  --glow-color: oklch(60% 0.25 30);
  background-color: oklch(60% 0.25 30);
  color: white;
}

.type-text {
  --glow-color: var(--color-secondary);
  background-color: var(--color-secondary);
  color: white;
}
</style>
