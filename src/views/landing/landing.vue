<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="glass-card hero-content">
        <h1 class="text-6xl font-bold mb-6 text-white">Zen-App</h1>
        <p class="text-2xl mb-10 text-gray-200">
          Transforma tu rutina, encuentra tu equilibrio
        </p>
        <Button size="lg" class="px-10 py-6 text-lg">
          Comenzar el viaje
        </Button>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">Beneficios</h2>
      <div class="features-grid">
        <Card class="glass-card feature-card">
          <CardHeader>
            <CardTitle class="text-center">Reducción de estrés</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Técnicas probadas para calmar tu mente</p>
          </CardContent>
        </Card>

        <Card class="glass-card feature-card">
          <CardHeader>
            <CardTitle class="text-center">Hábitos saludables</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rutinas para mejorar tu bienestar</p>
          </CardContent>
        </Card>

        <Card class="glass-card feature-card">
          <CardHeader>
            <CardTitle class="text-center">Seguimiento personal</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Monitoriza tu progreso</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

defineOptions({
  name: 'LandingPage'
})
</script>



<style scoped>
@import './landing.css';
</style>
