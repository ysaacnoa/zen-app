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
    <div class="absolute right-0 bottom-0 z-50">
      <Toaster position="bottom-right" richColors :visibleToasts="6" :expand=true />
    </div>

  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeLayoutView'
})

import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/modules/user/stores/user.store'
import { useToast } from '@/composables/useToast'
import { useSocketStore } from '@/modules/socket/socket.store'
import { Toaster } from '@/components/ui/sonner'
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
const { setupToastListeners, toast } = useToast()
const socketStore = useSocketStore()

onMounted(async () => {
  // Load profile if not already loaded
  if (!userStore.profile) {
    await userStore.fetchProfile()
  }
  setupToastListeners()
})

onUnmounted(() => {
  toast.dismiss() // Clean up any active toasts
  socketStore.disconnect() // Disconnect socket when component is destroyed
})
</script>

<style scoped>
@import './home.css';
</style>
