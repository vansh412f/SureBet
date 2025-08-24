import { io } from 'socket.io-client';
import { useOpportunityStore } from '../store/opportunityStore';

// socket connection to backend port
export const socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('connect', () => {
  console.log('Connected to SureBet Hub backend:', socket.id);
  // On successful connection, clear any previous error
  useOpportunityStore.getState().setConnectionError(null);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from backend:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // If a connection error occurs, set the error state in our store
  useOpportunityStore.getState().setConnectionError(error.message);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected to backend after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error);
});

export default socket;
