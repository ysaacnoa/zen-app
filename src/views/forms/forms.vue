<template>
  <div class="forms-container">
    <GAD7Form />
  </div>
</template>

<script setup lang="ts">
import GAD7Form from '@/views/landing/GAD7Form.vue'
defineOptions({
  name: 'FormsView'
})
</script>

<style scoped>
.forms-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
