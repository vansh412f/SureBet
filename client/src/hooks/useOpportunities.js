import { useEffect, useState } from 'react';
import { useOpportunityStore } from '../store/opportunityStore';
import socket from '../api/socket';

export const useOpportunities = () => {
  const { setOpportunities, setApiStatus, updateStatus, setIsConnected } = useOpportunityStore();

  // Reactive connection state (Bug 10 fix) — driven by socket events, not a one-time snapshot
  const [isConnected, setLocalConnected] = useState(socket.connected);

  useEffect(() => {
    const handleNewOpportunities = (data) => {
      setOpportunities(data);
    };

    const handleApiError = (errorPayload) => {
      console.error('API error from backend:', errorPayload.message);
      setApiStatus('limit_reached');
    };

    const handleStatusUpdate = (statusPayload) => {
      updateStatus(statusPayload);
    };

    const handleConnect = () => {
      setLocalConnected(true);
      setIsConnected(true);
      setApiStatus('ok');
    };

    const handleDisconnect = () => {
      setLocalConnected(false);
      setIsConnected(false);
    };

    socket.on('new_opportunities', handleNewOpportunities);
    socket.on('api_error', handleApiError);
    socket.on('status_update', handleStatusUpdate);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Sync initial connection state with socket
    setLocalConnected(socket.connected);
    setIsConnected(socket.connected);

    return () => {
      socket.off('new_opportunities', handleNewOpportunities);
      socket.off('api_error', handleApiError);
      socket.off('status_update', handleStatusUpdate);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [setOpportunities, setApiStatus, updateStatus, setIsConnected]);

  return { isConnected };
};
