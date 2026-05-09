import { useEffect } from 'react';
import { useOpportunityStore } from '../store/opportunityStore';
import socket from '../api/socket';

export const useOpportunities = () => {
  // BUG-07 fix: removed local useState for isConnected — it was dead code because
  // App.jsx discards the hook's return value. All connection state lives in the Zustand store.
  const { setOpportunities, setApiStatus, updateStatus, setIsConnected } = useOpportunityStore();

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
      setIsConnected(true);
      setApiStatus('ok');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('new_opportunities', handleNewOpportunities);
    socket.on('api_error', handleApiError);
    socket.on('status_update', handleStatusUpdate);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Sync initial connection state with socket
    setIsConnected(socket.connected);

    return () => {
      socket.off('new_opportunities', handleNewOpportunities);
      socket.off('api_error', handleApiError);
      socket.off('status_update', handleStatusUpdate);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [setOpportunities, setApiStatus, updateStatus, setIsConnected]);
};
