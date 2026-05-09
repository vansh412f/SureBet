import { io } from 'socket.io-client';

// BUG-17 fix: guard against missing VITE_WEBSOCKET_URL in dev.
const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
if (!wsUrl && import.meta.env.DEV) {
  console.warn(
    '[SureBet] VITE_WEBSOCKET_URL is not set. ' +
    'Socket will connect to the current page origin. ' +
    'Create client/.env with VITE_WEBSOCKET_URL=http://localhost:5000'
  );
}

// BUG-02 fix: removed module-level socket.on('connect') and socket.on('connect_error') handlers.
// All store updates from socket events must live in useOpportunities.js (the hook) only,
// to avoid duplicate handlers racing to update the same Zustand store slices.
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
