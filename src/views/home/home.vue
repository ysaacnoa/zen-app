<template>
  <div class="home-layout">
    <!-- Sidebar -->
    <SidebarProvider>
      <Sidebar class="glass-card" :expanded="isExpanded" @update:expanded="isExpanded = $event">
        <SidebarHeader>
          <div class="flex items-center justify-center p-4">
            <h2 class="text-xl font-semibold">Zen App</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full justify-start">
                  <HomeIcon class="h-4 w-4" />
                  <span class="ml-2">Feed</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full justify-start">
                  <TrophyIcon class="h-4 w-4" />
                  <span class="ml-2">Retos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full justify-start">
                  <GiftIcon class="h-4 w-4" />
                  <span class="ml-2">Recompensas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton class="w-full justify-start">
                  <BarChart2Icon class="h-4 w-4" />
                  <span class="ml-2">Analítica</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div class="user-section">
            <div class="user-info">
              <Avatar>
                <AvatarImage :src="userStore.profile?.avatarUrl || 'https://www.shadcn-vue.com/avatars/shadcn.jpg'" />
                <AvatarFallback>
                  {{ userStore.profile?.firstName?.charAt(0) }}{{ userStore.profile?.lastName?.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <div v-if="userStore.profile" class="user-details">
                <h3>{{ userStore.profile.firstName }} {{ userStore.profile.lastName }}</h3>
                <p class="text-sm text-gray-600">{{ userStore.profile.email }}</p>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
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

import { ref, onMounted } from 'vue'
import { useUserStore } from '@/modules/user/stores/user.store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HomeIcon,
  TrophyIcon,
  GiftIcon,
  BarChart2Icon
} from 'lucide-vue-next'

const userStore = useUserStore()
const isExpanded = ref(true)

onMounted(async () => {
  await userStore.loadProfile()
  console.debug('STORE USER', userStore.profile)
})
</script>

<style scoped>
@import './home.css';
</style>
