import { ref } from 'vue'
import { router } from '@/modules/routes'
import { useSocketStore, type NotificationData } from '@/modules/socket'
import { toast } from 'vue-sonner'


export function useToast() {
  const socketStore = useSocketStore()
  const hasActiveToasts = ref(false)
  const setupToastListeners = () => {
    // Ensure socket is connected
    socketStore.connect()

    socketStore.on('notification', (data: NotificationData) => {
      if (data.type === 'LEVEL_UP' && data.data.level) {
        hasActiveToasts.value = true
        toast.success('Level Up!', {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px'
          },
          description: `You've reached level ${data.data.level}`,
          duration: 5000,
          onAutoClose: () => { hasActiveToasts.value = false }
        })
      } else if (data.type === 'BADGE_UNLOCKED' && data.data.badgeName) {
        hasActiveToasts.value = true
        toast.success('Badge Unlocked!', {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px'
          },
          actionButtonStyle: {
            backgroundColor: 'white',
            color: 'black',
            paddingInline: '8px',
            paddingBlock: '4px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginLeft: 'auto'
          },
          description: `You've earned: ${data.data.badgeName}`,
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => router.push({ name: 'rewards' })
          },
          onAutoClose: () => { hasActiveToasts.value = false }
        })
      }
    })
  }

  return {
    toast,
    setupToastListeners,
    hasActiveToasts
  }
}
