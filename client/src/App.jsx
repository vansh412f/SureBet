// /src/App.js
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './components/layout/Header';
import SportFilterBar from './components/filters/SportFilterBar';
import FilterSidebar from './components/filters/FilterSidebar';
import OpportunityTable from './components/table/OpportunityTable';
import { useOpportunities } from './hooks/useOpportunities';

const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  marginTop: 64, // Account for fixed header height
}));

const TableContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

function App() {
  // Initialize WebSocket connection and handle real-time data
  useOpportunities();

  return (
    <AppContainer>
      <CssBaseline />
      
      {/* Fixed Header */}
      <Header />
      
      {/* Main Layout */}
      <MainContent>
        {/* Left Sidebar - Filters */}
        <FilterSidebar />
        
        {/* Right Side - Sports Filter + Table */}
        <TableContainer>
          {/* Sports Filter Bar */}
          <SportFilterBar />
          
          {/* Main Opportunities Table */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <OpportunityTable />
          </Box>
        </TableContainer>
      </MainContent>
    </AppContainer>
  );
}

export default App;