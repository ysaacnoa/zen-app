<template>
  <Dialog :open="true" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Profile</DialogTitle>
        <DialogDescription>
          Update your profile information
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- Profile form content here -->
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UserProfileDialog'
})
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const router = useRouter()

function handleClose() {
  router.back()
}
</script>
