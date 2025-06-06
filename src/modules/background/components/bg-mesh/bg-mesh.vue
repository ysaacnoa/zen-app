<template>
  <div class="bg-position mesh">
    <div v-for="(shape, index) in shapes" :key="index" :class="shape.classes"></div>
  </div>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BackgroundName } from '../../constants';

export default defineComponent({
  name: BackgroundName.MESH,
  data() {
    return {
      shapes: [
        { classes: [ 'bg-shape','bg-shape1','bg-style', 'bg-colors-primary'] },
        { classes: ['bg-shape', 'bg-shape2','bg-style', 'bg-colors-teal'] },
        { classes: ['bg-shape', 'bg-shape1','bg-style', 'bg-colors-purple'] },
      ],
    };
  },
})
</script>

<style scoped>
@import './bg-mesh.css';
</style>
