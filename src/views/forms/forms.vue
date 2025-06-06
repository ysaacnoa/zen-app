<template>
  <div class="forms-view">
    <div class="glass-card forms-header">
      <h1>Formularios</h1>
    </div>
    <div class="glass-card forms-content">
      <GAD7Form />
    </div>
  </div>
</template>

<script setup lang="ts">
import GAD7Form from '@/views/landing/GAD7Form.vue'
defineOptions({
  name: 'FormsView'
})
</script>

<style scoped>
.forms-view {
  width: 100%;
  min-height: 100vh;
}

.forms-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.forms-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.forms-content {
  border-radius: 1.5rem;
  margin-top: 3rem;
  max-width: 800px;
  margin-inline: auto;
  padding: 2rem;
}
</style>
