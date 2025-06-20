<template>
  <Sidebar class="glass-light" :collapsible="'icon'" :expanded="isExpanded" @update:expanded="setExpanded($event)">
    <SidebarHeader>
      <div class="flex items-center justify-between p-4">
        <h2 v-if="isExpanded" class="text-xl font-semibold">Zen App</h2>
        <SidebarTrigger class="p-2 ml-10 rounded">
          <ChevronLeft v-if="isExpanded" class="h-5 w-5" />
          <ChevronRight v-else class="h-5 w-5" />
        </SidebarTrigger>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              class="w-full justify-start"
              :tooltip="'Feed'"
              @click="router.push({ name: 'feed' })"
            >
              <HomeIcon class="h-4 w-4" />
              <span class="ml-2 group-data-[collapsible=icon]/sidebar:hidden">Feed</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              class="w-full justify-start"
              :tooltip="'Retos'"
              @click="router.push({ name: 'challenges' })"
            >
              <TrophyIcon class="h-4 w-4" />
              <span class="ml-2 group-data-[collapsible=icon]/sidebar:hidden">Retos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              class="w-full justify-start"
              :tooltip="'Recompensas'"
              @click="router.push({ name: 'rewards' })"
            >
              <GiftIcon class="h-4 w-4" />
              <span class="ml-2 group-data-[collapsible=icon]/sidebar:hidden">Recompensas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              class="w-full justify-start"
              :tooltip="'Analítica'"
              @click="router.push({ name: 'analytics' })"
            >
              <BarChart2Icon class="h-4 w-4" />
              <span class="ml-2 group-data-[collapsible=icon]/sidebar:hidden">Analítica</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="h-14">
              <SidebarMenuButton class="w-full justify-start px-4 py-3">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="avatarUrl" />
                  <AvatarFallback>{{ initials }}</AvatarFallback>
                </Avatar>
                <div v-if="isExpanded" class="ml-3 text-left">
                  <p class="text-sm font-medium">{{ fullName }}</p>
                  <p class="text-xs">{{ email }}</p>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-56 p-1 glass-light text-foreground"
              :side="!isExpanded ? 'bottom' : 'right'"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem @click="showProfileDialog = true">
                  <UserIcon class="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="router.push({ name: 'settings' })">
                  <SettingsIcon class="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                  <LogOutIcon class="mr-2 h-4 w-4" />
                  <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>

  <UserProfileDialog v-model:open="showProfileDialog"  @close="showProfileDialog = false" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const showProfileDialog = ref(false)
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from './index'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../dropdown-menu'
import {
  HomeIcon,
  TrophyIcon,
  GiftIcon,
  BarChart2Icon,
  ChevronLeft,
  ChevronRight,
  UserIcon,
  SettingsIcon,
  LogOutIcon
} from 'lucide-vue-next'
import SidebarRail from './SidebarRail.vue'
import UserProfileDialog from '@/views/home/profile/profile.vue'


const {
  state: sidebarState,
  setOpen: setExpanded
} = useSidebar()

const isExpanded = computed(() => sidebarState.value === 'expanded')

const props = defineProps({
  avatarUrl: {
    type: String,
    required: false,
    default: 'https://www.shadcn-vue.com/avatars/shadcn.jpg'
  },
  fullName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  }
})

onMounted(()=>{
  console.debug('[PROPS]',props)
})

const initials = computed(() => {
  const [first = '', last = ''] = props.fullName.split(' ')
  return `${first.charAt(0)}${last.charAt(0)}`
})

function handleLogout() {
  // Implement logout logic here
  console.log('Logging out...')
  router.push({ name: 'landing' })
}
</script>
