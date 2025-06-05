<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="glass-card hero-content">
        <h1>
          Encuentra tu <span class="gradient-text">paz interior</span>
        </h1>
        <p>
          Zen-App te guía en un viaje de mindfulness y hábitos saludables para reducir el estrés y mejorar tu bienestar diario.
        </p>
        <Dialog>
          <DialogTrigger as-child>
            <Button class="cta-button">
              🚀 Empieza ahora
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <DialogHeader>
              <DialogTitle class="gradient-text">{{ isLoginView ? 'Iniciar sesión' : 'Registrarse' }}</DialogTitle>
              <DialogDescription>
                {{ isLoginView ? 'Accede a tu cuenta para comenzar' : 'Crea una cuenta para comenzar' }}
              </DialogDescription>
            </DialogHeader>

            <SignIn v-if="isLoginView" @toggle-view="toggleView" />
            <SignUp v-else @toggle-view="toggleView" />
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">Beneficios</h2>
      <div class="features-grid">
        <Card class="glass-card feature-card">
          <CardHeader>
            <div class="emoji">🧘‍♂️</div>
            <CardTitle>
              Reducción de estrés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aprende técnicas de respiración, meditación guiada y mindfulness para reducir el estrés diario y encontrar calma interior.</p>
          </CardContent>
        </Card>

        <Card class="glass-card feature-card">
          <CardHeader>
            <div class="emoji">🌿</div>
            <CardTitle>
              Hábitos saludables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Descubre rutinas diarias para mejorar tu sueño, alimentación y actividad física, diseñadas para tu bienestar integral.</p>
          </CardContent>
        </Card>

        <Card class="glass-card feature-card">
          <CardHeader>
            <div class="emoji">📊</div>
            <CardTitle>
              Seguimiento personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Registra tu progreso, establece metas y recibe insights personalizados para mantener tu motivación y crecimiento continuo.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import SignIn from '../../modules/auth/components/SignIn.vue'
import SignUp from '../../modules/auth/components/SignUp.vue'

const isLoginView = ref(true)

const toggleView = () => {
  isLoginView.value = !isLoginView.value
}

defineOptions({
  name: 'LandingPage'
})
</script>

<style scoped>
@import './landing.css';
</style>
