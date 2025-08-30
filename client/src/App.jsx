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

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  marginTop: 64,
}));

const TableContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useOpportunities();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AppContainer>
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
