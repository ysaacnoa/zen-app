<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="bg-selector-trigger">
        <Palette class="w-5 h-5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="bg-selector-content">
      <DropdownMenuItem
        v-for="(option, index) in options"
        :key="index"
        @click="$emit('update:modelValue', option)"
      >
        {{ option }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Palette } from 'lucide-vue-next'
import { BackgroundType } from '@/modules/background/constants'

defineProps<{
  modelValue: BackgroundType
  options: BackgroundType[]
}>()

defineEmits(['update:modelValue'])
</script>


<style scoped>
@import './background-selector.css';
</style>
