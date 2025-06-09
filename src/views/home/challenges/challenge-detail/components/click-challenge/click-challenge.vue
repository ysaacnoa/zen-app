<template>
  <div class="text-foreground click-challenge">
    <div class="motivation-message">
      <p>🎉 ¡Confiamos en ti! 🎉</p>
      <p>Sabemos que estás cumpliendo este reto con dedicación 💪</p>
      <p>No necesitamos evidencias, solo tu honestidad al completarlo ✨</p>
    </div>

    <button
      @click="$emit('open-complete-challenge')"
      class="complete-btn bg-gradient"
    >
      Completar Desafío
    </button>
  </div>
</template>

<script setup lang="ts">
// Completion is handled by parent component via emit
</script>

<style scoped>
@import './click-challenge.css';
</style>
