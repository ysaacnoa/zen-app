import { defineStore } from 'pinia';
import { useSocketStore } from '../socket/socket.store';
import type { NotificationData } from '../socket/useSocket';

type Notification = {
  id: string;
  type: NotificationData['type'];
  message: string;
  timestamp: Date;
  read: boolean;
};

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0
  }),

  actions: {
    init() {
      const socketStore = useSocketStore();
      socketStore.connect();

      socketStore.on('notification', (data: NotificationData) => {
        this.addNotification(data);
      });
    },

    addNotification(data: NotificationData) {
      let message = '';

      switch(data.type) {
        case 'LEVEL_UP':
          message = `¡Nuevo nivel alcanzado! Nivel ${data.data.level}`;
          break;
        case 'BADGE_UNLOCKED':
          message = `¡Insignia desbloqueada: ${data.data.badgeName}`;
          break;
      }

      this.notifications.unshift({
        id: Date.now().toString(),
        type: data.type,
        message,
        timestamp: new Date(),
        read: false
      });

      this.unreadCount++;
    },

    markAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        notification.read = true;
        this.unreadCount--;
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => {
        if (!n.read) {
          n.read = true;
          this.unreadCount--;
        }
      });
    }
  }
});
