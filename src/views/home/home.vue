<template>
  <div class="home-layout">
    <!-- Sidebar -->
    <SidebarProvider>
      <SidebarApp
        :avatar-url="userStore.profile?.avatarUrl ?? ''"
        :full-name="`${userStore.profile?.firstName} ${userStore.profile?.lastName}`"
        :email="userStore.profile?.email"
      />
    </SidebarProvider>

    <!-- Main Content -->
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeLayoutView'
})

import { onMounted } from 'vue'
import { useUserStore } from '@/modules/user/stores/user.store'
import SidebarApp from '@/components/ui/sidebar/SidebarApp.vue'
import { SidebarProvider } from '@/components/ui/sidebar'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.loadProfile()
  console.debug('STORE USER', userStore.profile)
})
</script>

<style scoped>
@import './home.css';
</style>
