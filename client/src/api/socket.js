import { io } from 'socket.io-client';

const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
if (!wsUrl && import.meta.env.DEV) {
  console.warn(
    '[SureBet] VITE_WEBSOCKET_URL is not set. ' +
    'Socket will connect to the current page origin. ' +
    'Create client/.env with VITE_WEBSOCKET_URL=http://localhost:5000'
  );
}

export const socket = io(wsUrl, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from backend:', reason);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected to backend after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error);
});

export default socket;
