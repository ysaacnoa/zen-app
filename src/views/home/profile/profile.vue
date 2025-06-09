<template>
  <Dialog :open="true">
    <DialogContent>
      <DialogHeader class="text-foreground">
        <DialogTitle>Profile</DialogTitle>
        <DialogDescription>
          Update your profile information
        </DialogDescription>
      </DialogHeader>

      <Form @submit="handleSubmit">
        <div class="text-foreground grid gap-4 py-4">
          <!-- User Info Section -->
          <div class="flex items-center gap-6 mb-6">
            <div class="flex-1">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="email" class="text-right">Email</Label>
                <Input id="email" :modelValue="profile.email" disabled class="col-span-3" />
              </div>

              <div class="grid grid-cols-4 items-center gap-4 mt-4">
                <Label for="firstName" class="text-right">First Name</Label>
                <Input id="firstName" v-model="form.firstName" class="col-span-3" />
              </div>

              <div class="grid grid-cols-4 items-center gap-4 mt-4">
                <Label for="lastName" class="text-right">Last Name</Label>
                <Input id="lastName" v-model="form.lastName" class="col-span-3" />
              </div>
            </div>

            <!-- Progress and Badges -->
            <div class="flex-1 space-y-4">
              <div>
                <Label>Level: {{ profile.level }}</Label>
                <div class="mt-1 h-2 w-full bg-gray-200 rounded-full">
                  <div
                    class="h-full bg-primary rounded-full"
                    :style="{ width: `${(profile.xp % 1000) / 10}%` }"
                  ></div>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ profile.xp }} XP</p>
              </div>

              <div>
                <Label>Badges Earned</Label>
                <div v-for="badge in badgeStore.userBadges" :key="badge.id" class="flex flex-row items-center flex-wrap gap-2 mt-2">
                  <div class="h-4.5 w-4.5">
                    <img :src="badge.imagePath" :alt="`badge-${badge.id}`">
                  </div>
                  <Badge   variant="secondary">
                    {{ badge.name }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Optional Fields (2 columns) -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div>
                <Label for="bio">Bio</Label>
                <Textarea id="bio" v-model="form.bio" class="mt-1 w-full" />
              </div>
              <div>
                <Label for="location">Location</Label>
                <Input id="location" v-model="form.location" class="mt-1 w-full" />
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <Label for="birthDate">Birth Date</Label>
                <Input id="birthDate" v-model="form.birthDate" type="date" class="mt-1 w-full" />
              </div>
              <div>
                <Label for="phoneNumber">Phone</Label>
                <Input id="phoneNumber" v-model="form.phoneNumber" class="mt-1 w-full" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button  class="text-foreground" variant="outline" @click="handleClose">Cancel</Button>
          <Button class="bg-gradient" type="submit">Save</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/modules/user/stores/user.store'
import { useBadgeStore } from '@/modules/gamification/badges/stores/badge.store'
import { UserProfileSchema } from '@/modules/user/models/user-profile.schema'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

defineOptions({
  name: 'UserProfileDialog'
})

const router = useRouter()
const userStore = useUserStore()
const badgeStore = useBadgeStore()

const profile = ref<typeof UserProfileSchema._type>({
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  xp: 0,
  level: 1,
  authProvider: ''
})

const form = ref({
  firstName: '',
  lastName: '',
  bio: '',
  location: '',
  birthDate: '',
  phoneNumber: ''
})

onMounted(async () => {
  await userStore.fetchProfile()
  if (userStore.profile) {
    profile.value = userStore.profile
    form.value = {
      firstName: userStore.profile.firstName || '',
      lastName: userStore.profile.lastName || '',
      bio: userStore.profile.bio || '',
      location: userStore.profile.location || '',
      birthDate: userStore.profile.birthDate ? userStore.profile.birthDate.split('T')[0] : '',
      phoneNumber: userStore.profile.phoneNumber || ''
    }

    // Load user badges
    await badgeStore.fetchUserBadges(userStore.profile.id)
  }
})

function handleClose() {
  router.back()
}

async function handleSubmit() {
  try {
    await userStore.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      bio: form.value.bio || null,
      location: form.value.location || null,
      birthDate: form.value.birthDate ? `${form.value.birthDate}T00:00:00` : null,
      phoneNumber: form.value.phoneNumber || null
    })
    handleClose()
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}
</script>
