import React from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton,
  Button, ButtonGroup, Tooltip, Fade, Slide,
} from '@mui/material';
import { TrendingUp, InfoOutlined, FiberManualRecordRounded, AccessTime } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { useCountdown } from '../../hooks/useCountdown';

// ──────────────────────── Animations ────────────────────────

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.75; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ──────────────────────── Styled Components ────────────────────────

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 1.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
  border: `1px solid ${theme.palette.primary.main}25`,
  borderRadius: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 10px 24px ${theme.palette.primary.main}25`,
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-200px',
    width: '200px',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}18, transparent)`,
    animation: `${shimmerAnimation} 3s ease-in-out infinite`,
  },
}));

const LogoIcon = styled(TrendingUp)(({ theme }) => ({
  fontSize: '22px',
  color: theme.palette.primary.main,
  filter: 'drop-shadow(0 2px 6px rgba(0,123,255,0.35))',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Segoe UI", sans-serif',
  fontWeight: 800,
  fontSize: '1.25rem',
  letterSpacing: '-0.03em',
  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const ViewSwitcher = styled(ButtonGroup)(({ theme }) => ({
  background: `${theme.palette.background.paper}95`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',

  '& .MuiButton-root': {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.8rem',
    padding: theme.spacing(1, 2.5),
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
      padding: theme.spacing(0.8, 1.8),
    },

    '&.active': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark || theme.palette.primary.main})`,
      color: '#fff',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    },

    '&:not(.active)': {
      color: theme.palette.text.secondary,
      '&:hover': {
        background: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
    },
  },
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.2),
}));

const ScanBadge = styled(Box)(({ theme, scanning }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.7),
  padding: theme.spacing(0.6, 1.2),
  background: scanning
    ? 'rgba(16,185,129,0.1)'
    : 'rgba(59,130,246,0.08)',
  border: `1px solid ${
    scanning ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.2)'
  }`,
  borderRadius: 20,
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: { display: 'none' },
}));

const LiveIndicator = styled(Box)(({ theme, isconnected, apistatus }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.8),
  padding: theme.spacing(0.7, 1.2),
  background:
    apistatus === 'limit_reached'
      ? `linear-gradient(135deg, ${theme.palette.warning.main}18, ${theme.palette.warning.light}10)`
      : isconnected
        ? `linear-gradient(135deg, ${theme.palette.success.main}18, ${theme.palette.success.light}10)`
        : `linear-gradient(135deg, ${theme.palette.error.main}18, ${theme.palette.error.light}10)`,
  border: `1px solid ${
    apistatus === 'limit_reached'
      ? theme.palette.warning.main
      : isconnected
        ? theme.palette.success.main
        : theme.palette.error.main
  }35`,
  borderRadius: '20px',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default',

  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 5px 14px ${
      apistatus === 'limit_reached'
        ? theme.palette.warning.main
        : isconnected
          ? theme.palette.success.main
          : theme.palette.error.main
    }28`,
  },
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
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  color:
    apistatus === 'limit_reached'
      ? theme.palette.warning.main
      : isconnected
        ? theme.palette.success.main
        : theme.palette.error.main,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const InfoButton = styled(IconButton)(({ theme }) => ({
  background: `${theme.palette.background.paper}80`,
  backdropFilter: 'blur(8px)',
  border: `1px solid ${theme.palette.divider}`,
  width: 40,
  height: 40,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  '&:hover': {
    background: theme.palette.primary.main,
    color: '#fff',
    transform: 'translateY(-2px) rotate(8deg)',
    boxShadow: `0 8px 20px ${theme.palette.primary.main}35`,
  },
}));

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
    justifyContent: 'center',
  },
}));

// ──────────────────────── Component ────────────────────────

const Header = () => {
  // Bug 7 fix: read isConnected from store — NOT via useOpportunities()
  // useOpportunities() is called once in App.jsx and updates the store on connect/disconnect.
  const {
    viewMode,
    setViewMode,
    apiStatus,
    stats,
    isConnected,
  } = useOpportunityStore();

  const handleScrollToFooter = () => {
    const footer = document.getElementById('app-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
  };

  const countdown = useCountdown(stats?.nextRunTimestamp);
  const isScanning = !countdown; // null means the timer has expired → scan is in progress

  const lastScanLabel = stats?.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  const tooltipContent =
    apiStatus === 'limit_reached' ? (
      <Box sx={{ p: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: 'warning.main' }}>
          ⚠️ API Keys Exhausted
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          All API keys have been used up. Scans will resume automatically after a 6-hour cooldown.
        </Typography>
        <Typography variant="caption" sx={{ color: 'success.main', fontSize: '0.7rem' }}>
          ✓ Historical data is still available
        </Typography>
      </Box>
    ) : isConnected ? (
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: 'success.main' }}>
          🟢 System Operational
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Real-time data streaming active
        </Typography>
      </Box>
    ) : (
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: 'error.main' }}>
          🔴 Connection Lost
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Unable to reach data servers
        </Typography>
      </Box>
    );

  return (
    <Fade in timeout={800}>
      <StyledAppBar position="fixed" elevation={0}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: 64, sm: 70 },
            px: { xs: 1.5, sm: 2, md: 3 },
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            gap: { xs: 1, sm: 0 },
          }}
        >
          {/* Logo */}
          <Slide in timeout={600} direction="right">
            <LogoContainer>
              <LogoIcon />
              <LogoText variant="h6" component="div">
                SureBet
              </LogoText>
            </LogoContainer>
          </Slide>

          {/* Desktop centred view switcher */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: { xs: 'none', md: 'block' },
            }}
          >
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

          {/* Mobile view switcher */}
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

          {/* Right controls */}
          <Slide in timeout={1000} direction="left">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StatusContainer>
                  {/* Scan countdown badge */}
                  <ScanBadge scanning={isScanning ? 1 : 0}>
                    <AccessTime sx={{
                      fontSize: 13,
                      color: isScanning ? 'secondary.main' : 'primary.light',
                      animation: isScanning ? `${pulseAnimation} 1.5s ease-in-out infinite` : 'none',
                    }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.62rem', color: 'text.disabled', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isScanning ? 'Scanning' : 'Next scan'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2, color: isScanning ? 'secondary.light' : 'primary.light', fontVariantNumeric: 'tabular-nums' }}>
                        {isScanning ? 'Now…' : countdown}
                      </Typography>
                      {!isScanning && stats?.nextRunTimestamp && (
                        <Typography sx={{ fontSize: '0.62rem', color: 'text.disabled', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                          at {new Date(stats.nextRunTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      )}
                    </Box>
                  </ScanBadge>

                {/* Connection badge */}
                <Tooltip title={tooltipContent} placement="bottom-end" arrow>
                  <LiveIndicator isconnected={isConnected ? 1 : 0} apistatus={apiStatus}>
                    <StatusDot isconnected={isConnected ? 1 : 0} apistatus={apiStatus} />
                    <StatusLabel isconnected={isConnected ? 1 : 0} apistatus={apiStatus}>
                      {apiStatus === 'limit_reached' ? 'Limited' : isConnected ? 'Live' : 'Offline'}
                    </StatusLabel>
                  </LiveIndicator>
                </Tooltip>
              </StatusContainer>

              {/* Info button */}
              <InfoButton onClick={handleScrollToFooter} title="About this application">
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
