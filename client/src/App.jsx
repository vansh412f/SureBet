import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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

const MainContent = styled(Box)(() => ({
  display: 'flex',
  flex: 1,
  marginTop: 64,
}));

const TableContainer = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Single call site for the WebSocket hook (Bug 7 fix — prevents double listeners)
  useOpportunities();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AppContainer>
      {/* CssBaseline only here — removed duplicate from main.jsx (Bug 12 fix) */}
      <CssBaseline />
      <Header />
      <MainContent>
        <FilterSidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <TableContainer>
          <SportFilterBar />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <OpportunityTable />
          </Box>
        </TableContainer>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
