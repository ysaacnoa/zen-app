<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group glass-light text-foreground mx-8 mb-20 px-4 py-4 rounded-xl"
    v-bind="props"
    :style="{
    }"
  />
</template>
