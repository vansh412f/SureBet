// /src/hooks/useOpportunities.js
import { useEffect } from 'react';
import { useOpportunityStore } from '../store/opportunityStore';
import socket from '../api/socket';

export const useOpportunities = () => {
  const { setOpportunities, setApiStatus } = useOpportunityStore();

  useEffect(() => {
    // Handle new opportunities from the backend
    const handleNewOpportunities = (data) => {
      console.log('Received new opportunities from backend:', data);
      // This action now also resets apiStatus to 'ok'
      setOpportunities(data);
    };

    // Handle API error event
    const handleApiError = (errorPayload) => {
      console.error('API limit reached:', errorPayload.message);
      setApiStatus('limit_reached');
    };

    // Handle a successful connection or reconnection
    const handleConnect = () => {
      setApiStatus('ok');
    };

    // Listen for events
    socket.on('new_opportunities', handleNewOpportunities);
    socket.on('api_error', handleApiError);
    socket.on('connect', handleConnect); // Add listener for connect

    // Cleanup function to prevent memory leaks
    return () => {
      socket.off('new_opportunities', handleNewOpportunities);
      socket.off('api_error', handleApiError);
      socket.off('connect', handleConnect); // Also remove the connect listener
    };
  }, [setOpportunities, setApiStatus]);

  return {
    isConnected: socket.connected,
  };
};