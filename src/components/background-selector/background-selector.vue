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
        class="menu-item"
      >
        <div class="flex items-center gap-3">
          <component
            :is="getIcon(option)"
            class="w-4 h-4 "
          />
          <span class="">{{ formatOptionName(option) }}</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Palette,
  Sparkles,
  Droplets,
  CircleDot,
  Cpu,
  MousePointerClick
} from 'lucide-vue-next'

const iconMap: Record<BackgroundType, Component> = {
  [BackgroundType.BLURRED]: Sparkles,
  [BackgroundType.BUBBLES]: Droplets,
  [BackgroundType.CURSOR]: MousePointerClick,
  [BackgroundType.GRADIENT]: CircleDot,
  [BackgroundType.MESH]: Cpu,
  [BackgroundType.MOTES]: Sparkles,
  [BackgroundType.MOUSE]: MousePointerClick
}

function getIcon(option: BackgroundType) {
  return iconMap[option] || Sparkles
}

function formatOptionName(option: BackgroundType) {
  return option
}
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
