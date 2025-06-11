<template>
  <div class="loader-container">
    <div class="text-center ml-30 mb-40 text-foreground text-2xl">
      <slot>{{ label }}</slot>
    </div>
    <div class="container-loader">
      <article
        v-for="(ball, index) in balls"
        :key="index"
        class="ball"
        :style="ball.style"
      ></article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Loading...'
  },
  size: {
    type: Number,
    default: 300
  },
  zoom: {
    type: Number,
    default: 0.5
  }
})

const colors = [
  '#ff6347', '#00ced1', '#adff2f', '#9370db', '#ff1493',
  '#00bfff', '#7fff00', '#dc143c', '#8a2be2', '#48d1cc',
  '#ff4500', '#00ff7f', '#ba55d3', '#1e90ff', '#ffa500',
  '#ff69b4', '#00fa9a', '#9400d3', '#ffb6c1', '#20b2aa'
]

const balls = computed(() => {
  return colors.map((color, index) => ({
    style: {
      '--color': color,
      '--i': `${10 + (index % 10)}px`,
      '--d': `${3 + (index % 7)}s`
    }
  }))
})
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.container-loader {
  --size: v-bind('props.size + "px"');
  width: var(--size);
  height: var(--size);
  position: relative;
  zoom: v-bind('props.zoom');
}

.ball {
  position: absolute;
  width: calc(var(--size) + var(--i));
  height: calc(var(--size) + var(--i));
  background-color: var(--color);
  border-radius: 50%;
  animation: move 5s linear infinite;
  transform-origin: var(--size);
  mix-blend-mode: hard-light;
  animation-duration: var(--d);
  filter: blur(58px);
}

.ball:nth-child(even) {
  animation-direction: reverse;
}

@keyframes move {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>
