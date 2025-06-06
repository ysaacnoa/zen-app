<template>
  <canvas id="canvas-gradient" class="bg-position canvas-gradient" width="32" height="32"></canvas>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BackgroundName } from '../../constants';
import { CanvasGradientController } from './bg-gradient';

export default defineComponent({
  name: BackgroundName.GRADIENT,
  mounted(){
    const canvas = document.getElementById('canvas-gradient') as HTMLCanvasElement;
    const gradient = new CanvasGradientController(canvas);
    gradient.start();
  },
})
</script>
<style scoped>
@import './bg-gradient.css';
</style>
