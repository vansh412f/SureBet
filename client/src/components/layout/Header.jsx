import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Button,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import { TrendingUp, Refresh, InfoOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { useOpportunities } from '../../hooks/useOpportunities';

// ---------------- Styled Components ----------------

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
  padding: theme.spacing(0, 2),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", "Segoe UI", sans-serif',
  fontWeight: 800,
  fontSize: '1.5rem',
  letterSpacing: '0.8px',
  color: theme.palette.text.primary, // offWhite (#F1F1F1)
  padding: theme.spacing(0.5, 1.2),
  border: `1px solid ${theme.palette.divider}`, // subtle slate border
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, connected }) => ({
  backgroundColor: connected ? theme.palette.secondary.main : theme.palette.error.main, 
  // vibrantGreen if live, warningRed if disconnected
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: '12px',
  padding: '0 6px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 6,
  padding: theme.spacing(0.8, 3),
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
}));

const StatsBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.6, 1.2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
}));

// ---------------- Header Component ----------------

const Header = () => {
  const { opportunities, isLoading, viewMode, setViewMode, apiStatus } = useOpportunityStore();
  const { isConnected } = useOpportunities();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleScrollToFooter = () => {
    const footer = document.getElementById('app-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, position: 'relative' }}>
        
        {/* Logo (left) */}
        <LogoText variant="h6" component="div">
          <TrendingUp sx={{ fontSize: 26 }} />
          SureBet
        </LogoText>

        {/* Centered View Switcher */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <ButtonGroup
            disableElevation
            sx={{
              border: `1px solid ${theme => theme.palette.divider}`, // slate
              borderRadius: 6,
              backgroundColor: theme => theme.palette.background.default, // charcoal
              overflow: 'hidden',
            }}
          >
            <StyledButton
              variant={viewMode === 'live' ? 'contained' : 'text'}
              onClick={() => setViewMode('live')}
              sx={(theme) => ({
                backgroundColor: viewMode === 'live' ? theme.palette.primary.main : 'transparent',
                color: viewMode === 'live' ? '#fff' : theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: viewMode === 'live' ? theme.palette.primary.dark : 'transparent',
                },
              })}
            >
              Live Opportunities
            </StyledButton>
            <StyledButton
              variant={viewMode === 'past' ? 'contained' : 'text'}
              onClick={() => setViewMode('past')}
              sx={(theme) => ({
                backgroundColor: viewMode === 'past' ? theme.palette.primary.main : 'transparent',
                color: viewMode === 'past' ? '#fff' : theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: viewMode === 'past' ? theme.palette.primary.dark : 'transparent',
                },
              })}
            >
              Past Opportunities
            </StyledButton>
          </ButtonGroup>
        </Box>

        {/* Right Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Stats block groups count + live chip */}
          <StatsBlock>
            <Typography 
              variant="body2" 
              sx={{ fontWeight: 500, color: 'text.secondary' }}
            >
              {isLoading ? 'Loading...' : `${opportunities.length} opportunities`}
            </Typography>
            
            <Tooltip
              title={
                apiStatus === 'limit_reached' ? (
                  <>
                    <Typography variant="subtitle1">
                      Do you see that green live button? That means everything is working fine, dont stress
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'error.main', mt: 1 }}>
                      Problem: Api limit reached! Im poor :(
                    </Typography>
                  </>
                ) : (
                  'Connection is live'
                )
              }
              open={apiStatus === 'limit_reached'}
              placement="bottom-end"
            >
              <StatusChip
                label={isConnected ? 'Live' : 'Disconnected'}
                size="small"
                connected={isConnected}
              />
            </Tooltip>
          </StatsBlock>

          {/* Info button */}
          <IconButton
            onClick={handleScrollToFooter}
            title="About this site"
            size="medium"
            sx={{ color: 'text.secondary' }}
          >
            <InfoOutlined />
          </IconButton>
          
          {/* Refresh button */}
          <IconButton
            onClick={handleRefresh}
            title="Refresh"
            size="medium"
            sx={{ color: 'text.secondary' }}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;