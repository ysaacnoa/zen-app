import { io, Socket } from 'socket.io-client';

export type NotificationData = {
  type: 'LEVEL_UP' | 'BADGE_UNLOCKED';
  userId: string;
  data: {
    level?: number;
    badgeName?: string;
  };
};

export function useSocket() {
  const socket: Socket = io('http://localhost:3000', {
    transports: ['websocket'],
    reconnection: true
  });

  const on = (event: string, callback: (data: NotificationData) => void) => {
    socket.on(event, callback);
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return {
    on,
    disconnect,
    socket
  };
}
