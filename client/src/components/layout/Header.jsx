import React from 'react';
import {AppBar,Toolbar,Typography,Box,Chip,IconButton,Button,ButtonGroup,Tooltip,Fade,Slide} from '@mui/material';
import { TrendingUp, InfoOutlined, FiberManualRecordRounded } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useCountdown } from '../../hooks/useCountdown';

// ---------------- Animations ----------------

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ---------------- Styled Components ----------------

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
  border: `2px solid ${theme.palette.primary.main}20`,
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 24px ${theme.palette.primary.main}25`,
    '& .logo-icon': {
      animation: `${pulseAnimation} 1s ease-in-out`,
    }
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-200px',
    width: '200px',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
    animation: `${shimmerAnimation} 3s ease-in-out infinite`,
  }
}));

const LogoIcon = styled(TrendingUp)(({ theme }) => ({
  fontSize: '28px',
  color: theme.palette.primary.main,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Segoe UI", sans-serif',
  fontWeight: 700,
  fontSize: '1.4rem',
  letterSpacing: '-0.02em',
  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
}));

const ViewSwitcher = styled(ButtonGroup)(({ theme }) => ({
  background: `${theme.palette.background.paper}95`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  
  '& .MuiButton-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2.5),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      padding: theme.spacing(0.8, 1.5),
    },
    
    '&.active': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
      color: '#fff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
    },
    
    '&:not(.active)': {
      color: theme.palette.text.secondary,
      '&:hover': {
        background: theme.palette.action.hover,
        transform: 'translateY(-1px)',
      }
    }
  }
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-end',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const StatusInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.2),
  animation: `${fadeInUp} 0.6s ease-out`,
  minWidth: '140px',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
  },
}));

const StatusText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
  fontFamily: '"JetBrains Mono", "Consolas", monospace',
  letterSpacing: '0.02em',
}));

const LiveIndicator = styled(Box)(({ theme, isconnected, apistatus }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.8),
  padding: theme.spacing(0.6, 1.2),
  background: 
    apistatus === 'limit_reached' 
      ? `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.light}10)`
      : isconnected 
        ? `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.light}10)`
        : `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.light}10)`,
  border: `1px solid ${
    apistatus === 'limit_reached' 
      ? theme.palette.warning.main
      : isconnected 
        ? theme.palette.success.main 
        : theme.palette.error.main
  }30`,
  borderRadius: '20px',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 6px 16px ${
      apistatus === 'limit_reached' 
        ? theme.palette.warning.main
        : isconnected 
          ? theme.palette.success.main 
          : theme.palette.error.main
    }25`,
  }
}));

const StatusDot = styled(FiberManualRecordRounded)(({ theme, isconnected, apistatus }) => ({
  fontSize: '10px',
  color: 
    apistatus === 'limit_reached' 
      ? theme.palette.warning.main
      : isconnected 
        ? theme.palette.success.main 
        : theme.palette.error.main,
  animation: 
    apistatus === 'limit_reached'
      ? `${pulseAnimation} 1.5s ease-in-out infinite`
      : isconnected 
        ? `${pulseAnimation} 2s ease-in-out infinite` 
        : 'none',
}));

const StatusLabel = styled(Typography)(({ theme, isconnected, apistatus }) => ({
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 
    apistatus === 'limit_reached' 
      ? theme.palette.warning.main
      : isconnected 
        ? theme.palette.success.main 
        : theme.palette.error.main,
  letterSpacing: '0.02em',
}));

const InfoButton = styled(IconButton)(({ theme }) => ({
  background: `${theme.palette.background.paper}80`,
  backdropFilter: 'blur(8px)',
  border: `1px solid ${theme.palette.divider}`,
  width: 44,
  height: 44,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
  },
  
  '&:hover': {
    background: theme.palette.primary.main,
    color: '#fff',
    transform: 'translateY(-2px) rotate(5deg)',
    boxShadow: `0 8px 20px ${theme.palette.primary.main}30`,
  }
}));

// Mobile View Switcher
const MobileViewSwitcher = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  [theme.breakpoints.down('sm')]: {
    position: 'static',
    transform: 'none',
    order: 2,
    width: '100%',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
}));

// ---------------- Header Component ----------------

const Header = () => {
  const {
    viewMode,
    setViewMode,
    apiStatus,
    stats,
  } = useOpportunityStore();
  const { isConnected } = useOpportunities();

  const handleScrollToFooter = () => {
    const footer = document.getElementById('app-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const nextScanTime = stats?.nextRunTimestamp;
  const isNextScanInFuture = nextScanTime && new Date(nextScanTime) > new Date();
  
  const countdown = useCountdown(isNextScanInFuture ? nextScanTime : null);
  const lastScanLabel = stats?.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    : '—';

  return (
    <Fade in timeout={800}>
      <StyledAppBar position="fixed" elevation={0}>
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          minHeight: { xs: 64, sm: 72 },
          padding: (theme) => ({ 
            xs: theme.spacing(0, 1.5), 
            sm: theme.spacing(0, 2), 
            md: theme.spacing(0, 3) 
          }),
          position: 'relative',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1, sm: 0 }
        }}>
          {/* Logo */}
          <Slide in timeout={600} direction="right">
            <LogoContainer sx={{ 
              order: { xs: 1, sm: 0 },
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}>
              <LogoIcon className="logo-icon" />
              <LogoText variant="h6" component="div">
                SureBet
              </LogoText>
            </LogoContainer>
          </Slide>

          {/* Centered View Switcher - Desktop */}
          <Box sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: { xs: 'none', md: 'block' }
          }}>
            <ViewSwitcher disableElevation>
              <Button
                className={viewMode === 'live' ? 'active' : ''}
                onClick={() => setViewMode('live')}
              >
                Live
              </Button>
              <Button
                className={viewMode === 'past' ? 'active' : ''}
                onClick={() => setViewMode('past')}
              >
                History
              </Button>
            </ViewSwitcher>
          </Box>

          {/* Mobile View Switcher */}
          <MobileViewSwitcher>
            <ViewSwitcher disableElevation>
              <Button
                className={viewMode === 'live' ? 'active' : ''}
                onClick={() => setViewMode('live')}
              >
                Live
              </Button>
              <Button
                className={viewMode === 'past' ? 'active' : ''}
                onClick={() => setViewMode('past')}
              >
                History
              </Button>
            </ViewSwitcher>
          </MobileViewSwitcher>

          {/* Right Controls */}
          <Slide in timeout={1000} direction="left">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              order: { xs: 3, sm: 0 },
              alignSelf: { xs: 'flex-end', sm: 'center' },
              width: { xs: 'auto', sm: 'auto' }
            }}>
              {/* Status Info */}
              <StatusContainer>
                <StatusInfo>
                  <StatusText>Last Scan:&nbsp;&nbsp;{lastScanLabel}</StatusText>
                  <StatusText>Next Scan:&nbsp;&nbsp;{isNextScanInFuture ? countdown : '...'}</StatusText>
                </StatusInfo>
                
                <Tooltip
                  title={
                    apiStatus === 'limit_reached' ? (
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'warning.main' }}>
                          ⚠️ API Quota Exceeded
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Daily request limit has been reached
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'success.main', fontSize: '0.7rem' }}>
                          ✓ System operational • Data may be cached
                        </Typography>
                      </Box>
                    ) : isConnected ? (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'success.main' }}>
                          🟢 System Operational
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Real-time data streaming active
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'error.main' }}>
                          🔴 Connection Lost
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Unable to reach data servers
                        </Typography>
                      </Box>
                    )
                  }
                  placement="bottom-end"
                  arrow
                >
                  <LiveIndicator isconnected={isConnected} apistatus={apiStatus}>
                    <StatusDot isconnected={isConnected} apistatus={apiStatus} />
                    <StatusLabel isconnected={isConnected} apistatus={apiStatus}>
                      {apiStatus === 'limit_reached' ? 'Limited' : isConnected ? 'Live' : 'Offline'}
                    </StatusLabel>
                  </LiveIndicator>
                </Tooltip>
              </StatusContainer>

              {/* Info Button */}
              <InfoButton
                onClick={handleScrollToFooter}
                title="About this application"
              >
                <InfoOutlined fontSize="small" />
              </InfoButton>
            </Box>
          </Slide>
        </Toolbar>
      </StyledAppBar>
    </Fade>
  );
};

export default Header;
