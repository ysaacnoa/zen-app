<template>
  <div class="content-layout">
    <!-- Sidebar -->
    <SidebarProvider>
      <SidebarApp
        :avatar-url="userStore.profile?.avatarUrl ?? ''"
        :full-name="`${userStore.profile?.firstName} ${userStore.profile?.lastName}`"
        :email="userStore.profile?.email"
      />
    </SidebarProvider>

    <!-- Header -->
    <header class="main-header glass-light">
        <div>

        </div>
        <DropdownMenu >
        <DropdownMenuTrigger as-child>
          <Button class="glass-light text-foreground">
            <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="glass-light text-foreground" align="end">
          <DropdownMenuItem @click="mode = 'light'">
            Light
          </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'dark'">
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'auto'">
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


    </header>

    <!-- Main Content -->
    <div class="main-content glass-dense">
      <router-view />
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
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const userStore = useUserStore()
const mode = useColorMode()

onMounted(async () => {
  // Load profile if not already loaded
  if (!userStore.profile) {
    await userStore.fetchProfile()
  }
})
</script>

<style scoped>
@import './home.css';
</style>
