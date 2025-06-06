<template>
  <div class="glassy-overlay"></div>
  <canvas id="canvas-mouse" class="bg-position" ></canvas>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BackgroundName } from '../../constants';
import { CanvasMouseAnimation } from './bg-mouse';

export default defineComponent({
  name: BackgroundName.MOUSE,
  data() {
    return {
      animation: null as CanvasMouseAnimation | null
    }
  },
  mounted() {
    const canvas = document.getElementById('canvas-mouse') as HTMLCanvasElement;
    this.animation = new CanvasMouseAnimation(canvas);
  },
  beforeUnmount() {
    this.animation?.destroy();
  }
})
</script>

<style scoped>
@import './bg-mouse.css';
</style>
