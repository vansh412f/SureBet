// /src/hooks/useOpportunities.js
import { useEffect } from 'react';
import { useOpportunityStore } from '../store/opportunityStore';
import socket from '../api/socket';

export const useOpportunities = () => {
  const { setOpportunities, setApiStatus, updateStatus } = useOpportunityStore();

  useEffect(() => {
    updateStatus({ message: 'Connecting to server...' });
    // Handle new opportunities from the backend
    const handleNewOpportunities = (data) => {
      console.log('Received new opportunities from backend:', data);
      setOpportunities(data);
    };

    // Handle API error event
    const handleApiError = (errorPayload) => {
      console.error('API limit reached:', errorPayload.message);
      setApiStatus('limit_reached');
    };

    // Handle status update stream
    const handleStatusUpdate = (statusPayload) => {
      console.log('Status update:', statusPayload);
      updateStatus(statusPayload);
    };

    // Handle a successful connection or reconnection
    const handleConnect = () => {
      setApiStatus('ok');
    };

    // Listen for events
    socket.on('new_opportunities', handleNewOpportunities);
    socket.on('api_error', handleApiError);
    socket.on('status_update', handleStatusUpdate);
    socket.on('connect', handleConnect);

    // Cleanup function to prevent memory leaks
    return () => {
      socket.off('new_opportunities', handleNewOpportunities);
      socket.off('api_error', handleApiError);
      socket.off('status_update', handleStatusUpdate);
      socket.off('connect', handleConnect);
    };
  }, [setOpportunities, setApiStatus, updateStatus]);

  return {
    isConnected: socket.connected,
  };
};