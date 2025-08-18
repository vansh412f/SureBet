// /src/hooks/useOpportunities.js
import { useEffect } from 'react';
import { useOpportunityStore } from '../store/opportunityStore';
import socket from '../api/socket';

export const useOpportunities = () => {
  const setOpportunities = useOpportunityStore((state) => state.setOpportunities);

  useEffect(() => {
    // Handle new opportunities data
    const handleNewOpportunities = (data) => {
      console.log('Received new opportunities:', data.length, 'opportunities');
      setOpportunities(data);
    };

    // Handle real-time updates for individual opportunities
    const handleOpportunityUpdate = (updatedOpportunity) => {
      console.log('Opportunity updated:', updatedOpportunity.id);
      // Update individual opportunity in the store
      useOpportunityStore.setState((state) => ({
        opportunities: state.opportunities.map(opp =>
          opp.id === updatedOpportunity.id ? updatedOpportunity : opp
        ),
      }));
    };

    // Handle opportunity removal
    const handleOpportunityRemoved = (opportunityId) => {
      console.log('Opportunity removed:', opportunityId);
      useOpportunityStore.setState((state) => ({
        opportunities: state.opportunities.filter(opp => opp.id !== opportunityId),
      }));
    };

    // Register event listeners
    socket.on('new_opportunities', handleNewOpportunities);
    socket.on('opportunity_update', handleOpportunityUpdate);
    socket.on('opportunity_removed', handleOpportunityRemoved);

    // Request initial data on connection
    if (socket.connected) {
      socket.emit('request_opportunities');
    } else {
      socket.on('connect', () => {
        socket.emit('request_opportunities');
      });
    }

    // Cleanup function
    return () => {
      socket.off('new_opportunities', handleNewOpportunities);
      socket.off('opportunity_update', handleOpportunityUpdate);
      socket.off('opportunity_removed', handleOpportunityRemoved);
    };
  }, [setOpportunities]);

  return {
    socket,
    isConnected: socket.connected,
  };
};