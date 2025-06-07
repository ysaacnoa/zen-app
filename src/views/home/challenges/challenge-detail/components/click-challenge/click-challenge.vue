<template>
  <div class="click-challenge">
    <div class="motivation-message">
      <p>🎉 ¡Confiamos en ti! 🎉</p>
      <p>Sabemos que estás cumpliendo este reto con dedicación 💪</p>
      <p>No necesitamos evidencias, solo tu honestidad al completarlo ✨</p>
    </div>

    <button
      @click="completeChallenge"
      class="complete-btn"
    >
      Completar Desafío
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

async function completeChallenge() {
  if (typeof route.params.id === 'string') {
    console.debug('desafio completado')
    router.push({ name: 'challenges' })
  }
}
</script>

<style scoped>
@import './click-challenge.css';
</style>
