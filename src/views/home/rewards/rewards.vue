<template>
  <div class="rewards-view">
    <div v-if="badgeStore.loading">Loading badges...</div>
    <div v-else-if="badgeStore.error" class="error">
      {{ badgeStore.error }}
    </div>
    <div v-else class="badges-grid">
      <div
        v-for="badge in badgeStore.badges"
        :key="badge.id"
        class="badge-card"
        :class="{ 'unlocked': badge.isUnlocked }"
      >
        <img
          :src="badge.imagePath"
          :alt="badge.name"
          class="badge-image"
        >
        <div class="badge-info">
          <h3>{{ badge.name }}</h3>
          <p>{{ badge.description }}</p>
          <div class="xp-required" v-if="!badge.isUnlocked">
            XP Required: {{ badge.formattedXp }}
          </div>
          <div class="unlocked-label" v-else>
            Unlocked!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBadgeStore } from '@/modules/gamification/badges/stores/badge.store'
import { onMounted } from 'vue'
import { defineOptions } from 'vue'

defineOptions({
  name: 'RewardsView'
})

const badgeStore = useBadgeStore()

onMounted(() => {
  badgeStore.fetchBadges()
})
</script>

<style scoped>
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.badge-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
}

.badge-card.unlocked {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.badge-image {
  width: 100%;
  height: auto;
  max-width: 100px;
  margin: 0 auto;
  display: block;
  /* filter: grayscale(100%); */
  opacity: 0.7;
}

.badge-card.unlocked .badge-image {
  filter: none;
  opacity: 1;
}

.badge-info {
  margin-top: 1rem;
  text-align: center;
}

.xp-required {
  color: var(--color-primary);
  font-weight: bold;
  margin-top: 0.5rem;
}

.unlocked-label {
  color: var(--color-tertiary);
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
