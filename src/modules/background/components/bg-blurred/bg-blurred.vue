<template>
  <div class="blurred-container">
    <div class="blurred"></div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { BackgroundName } from '../../constants';

export default defineComponent({
  name: BackgroundName.BLURRED,
})
</script>

<style scoped>
@import './bg-blurred.css';
</style>
