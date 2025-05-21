<template>
  <div class="cursor-container">
    <div class="cursor">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { BackgroundName } from '../../constants';
import { SmoothCursor } from './bg-cursor';

export default defineComponent({
  name: BackgroundName.CURSOR,
  setup() {
    let cursor: SmoothCursor;

    onMounted(() => {
      cursor = new SmoothCursor();
    });

    onBeforeUnmount(() => {
      cursor.destroy();
    });
  },
});
</script>

<style scoped>
@import './bg-cursor.css';
</style>
