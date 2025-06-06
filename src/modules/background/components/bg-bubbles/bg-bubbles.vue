<template>
  <div class="bg-position gradient-bg">
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
    <div class="gradients-container">
      <div class="gradient g1"></div>
      <div class="gradient g2"></div>
      <div class="gradient g3"></div>
      <div class="gradient g4"></div>
      <div class="gradient g5"></div>
      <div ref="interactive" class="gradient interactive"></div>
    </div>
  </div>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { BackgroundName } from '../../constants';
import { MouseBubbleController } from './bg-bubbles';
import type { IMouseBubbleController } from './bg-bubbles.types';

export default defineComponent({
  name: BackgroundName.BUBBLES,
  setup() {
    const interactive = ref<HTMLDivElement | null>(null);
    let mouseBubbleController: IMouseBubbleController | null = null;

    onMounted(()=>{
      if(interactive.value){
        mouseBubbleController = new MouseBubbleController({
          interactiveElement: interactive.value
        })
        mouseBubbleController.start();
      }
    })

    onUnmounted(()=> {
      if(mouseBubbleController){
        mouseBubbleController.stop();
      }
    })

    return {
      interactive,
    };
  },
});
</script>

<style scoped>
@import './bg-bubbles.css';
</style>
