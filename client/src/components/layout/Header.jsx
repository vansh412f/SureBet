// /src/components/layout/Header.js
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Chip,
  IconButton 
} from '@mui/material';
import { 
  TrendingUp, 
  Refresh,
  Settings 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { useOpportunities } from '../../hooks/useOpportunities';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
}));

const StatusChip = styled(Chip)(({ theme, connected }) => ({
  backgroundColor: connected ? theme.palette.success.main : theme.palette.error.main,
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-icon': {
    color: 'white',
  },
}));

const Header = () => {
  const { opportunities, isLoading } = useOpportunityStore();
  const { isConnected } = useOpportunities();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar>
        <LogoText variant="h5" component="div" sx={{ flexGrow: 1 }}>
          <TrendingUp sx={{ mr: 1 }} />
          SureBet Hub
        </LogoText>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {isLoading ? 'Loading...' : `${opportunities.length} opportunities`}
          </Typography>
          
          <StatusChip
            icon={<Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: 'currentColor' 
              }} 
            />}
            label={isConnected ? 'Live' : 'Disconnected'}
            size="small"
            connected={isConnected}
          />
          
          <IconButton
            color="primary"
            onClick={handleRefresh}
            title="Refresh"
            size="small"
          >
            <Refresh />
          </IconButton>
          
          <IconButton
            color="primary"
            title="Settings"
            size="small"
          >
            <Settings />
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;