import { defineStore } from 'pinia';
import { useSocket } from './useSocket';
import type { NotificationData } from './useSocket';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    socket: null as ReturnType<typeof useSocket> | null
  }),

  actions: {
    connect() {
      if (this.socket) return;

      this.socket = useSocket();
      this.isConnected = true;
    },

    disconnect() {
      if (!this.socket) return;

      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    },

    on(event: string, callback: (data: NotificationData) => void) {
      if (!this.socket) return;
      this.socket.on(event, callback);
    }
  }
});
