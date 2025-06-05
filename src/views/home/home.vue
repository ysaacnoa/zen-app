<template>
  <div class="home-view" data-test="home-view">
    <h1>Bienvenido a Zen App</h1>
    <p>Tu aplicación para el bienestar mental</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeView'
})
</script>

<style scoped>
.home-view {
  text-align: center;
  padding: 2rem;
}
</style>
