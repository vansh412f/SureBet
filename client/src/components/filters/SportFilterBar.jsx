import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Chip, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { SportsBaseball, Assessment } from '@mui/icons-material';

// Animations
const slideIn = keyframes`
  from { transform: translateY(-5px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const countUp = keyframes`
  from { transform: scale(0.9); }
  to { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -100px 0; }
  100% { background-position: calc(100px + 100%) 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(25, 118, 210, 0.3); }
  50% { box-shadow: 0 0 16px rgba(25, 118, 210, 0.5); }
`;

// Styled Components
const FilterBarContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper}98 0%, ${theme.palette.background.default}95 100%)`,
  backdropFilter: 'blur(20px)',
  padding: theme.spacing(1.2, 2),
  borderBottom: `1px solid ${theme.palette.divider}25`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.2),
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  position: 'relative',
  minHeight: 44,
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
    gap: theme.spacing(1),
    minHeight: 40,
  },
  
  '&::-webkit-scrollbar': {
    height: 3,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main}60, ${theme.palette.secondary.main}60)`,
    borderRadius: 1.5,
  },
  
  // Subtle scroll indicators
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    background: `linear-gradient(90deg, ${theme.palette.background.paper}, transparent)`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    background: `linear-gradient(-90deg, ${theme.palette.background.paper}, transparent)`,
    pointerEvents: 'none',
    zIndex: 1,
  },
}));

const StatsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.6, 1.2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}06, ${theme.palette.secondary.main}03)`,
  borderRadius: 10,
  border: `1px solid ${theme.palette.primary.main}15`,
  minWidth: 'fit-content',
  animation: `${slideIn} 0.5s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    gap: theme.spacing(1),
    borderRadius: 8,
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100px',
    width: '100px',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}10, transparent)`,
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const StatBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.8),
  
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.6),
  },
}));

const StatIcon = styled(Assessment)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.primary.main,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.6rem',
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '0.8rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${countUp} 0.4s ease-out`,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const SportsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: 'fit-content',
  paddingLeft: theme.spacing(1.5),
  
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    gap: theme.spacing(0.8),
  },
}));

const SportButton = styled(Button)(({ theme, selected }) => ({
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  borderRadius: 20,
  padding: theme.spacing(0.6, 1.8),
  fontWeight: 700,
  fontSize: '0.75rem',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1.4),
    fontSize: '0.7rem',
    borderRadius: 16,
  },
  
  ...(selected
    ? {
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: '#fff',
        boxShadow: `0 4px 16px ${theme.palette.primary.main}35`,
        transform: 'translateY(-1px)',
        animation: `${pulseGlow} 2s ease-in-out infinite`,
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
          transition: 'left 0.6s',
        },
        '&:hover::before': {
          left: '100%',
        },
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          transform: 'translateY(-1.5px)',
          boxShadow: `0 6px 20px ${theme.palette.primary.main}45`,
        },
      }
    : {
        background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.default}90)`,
        border: `1px solid ${theme.palette.divider}25`,
        color: theme.palette.text.secondary,
        backdropFilter: 'blur(8px)',
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}04)`,
          border: `1px solid ${theme.palette.primary.main}35`,
          color: theme.palette.primary.main,
          transform: 'translateY(-0.5px)',
          boxShadow: `0 3px 12px ${theme.palette.primary.main}15`,
        },
      }),
}));

const CountChip = styled(Chip)(({ theme, selected }) => ({
  height: 16,
  fontSize: '0.6rem',
  fontWeight: 700,
  marginLeft: theme.spacing(0.8),
  transition: 'all 0.3s ease',
  
  [theme.breakpoints.down('sm')]: {
    height: 14,
    fontSize: '0.55rem',
    marginLeft: theme.spacing(0.6),
  },
  
  ...(selected
    ? {
        background: 'rgba(255, 255, 255, 0.25)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }
    : {
        background: `linear-gradient(135deg, ${theme.palette.secondary.main}90, ${theme.palette.secondary.dark}90)`,
        color: '#fff',
        border: 'none',
        boxShadow: `0 1px 6px ${theme.palette.secondary.main}25`,
      }),
}));

const Divider = styled(Box)(({ theme }) => ({
  width: 1,
  height: 24,
  background: `linear-gradient(180deg, transparent, ${theme.palette.divider}60, transparent)`,
  flexShrink: 0,
  
  [theme.breakpoints.down('sm')]: {
    height: 20,
  },
}));

const SportFilterBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = useRef(null);
  const [showScrollIndicators, setShowScrollIndicators] = useState(false);

  const {
    opportunities,
    updateFilter,
    getAvailableSports,
    getCurrentFilters,
    stats,
    viewMode,
  } = useOpportunityStore();

  const availableSports = getAvailableSports();
  const filters = getCurrentFilters();
  const selectedSport = filters.sport;

  const handleSportChange = (sport) => {
    updateFilter('sport', sport);
    if (sport !== selectedSport) {
      updateFilter('leagues', []);
    }
  };

  const getSportOpportunityCount = (sport) => {
    const viewOpportunities = opportunities.filter(op => op.status === viewMode);
    if (sport === 'All') {
      return viewOpportunities.length;
    }
    return viewOpportunities.filter((opp) => opp.sport_title === sport).length;
  };

  // Handle scroll indicators
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollIndicators(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [availableSports]);

  return (
    <FilterBarContainer ref={scrollRef}>
      {/* Statistics Section */}
      <StatsSection>
        <StatBlock>
          <StatIcon />
          <Box>
            <StatLabel>Matches Scanned</StatLabel>
            <StatNumber>{stats.matchesScanned}</StatNumber>
          </Box>
        </StatBlock>
      </StatsSection>

      <Divider />

      {/* Sports Section */}
      <SportsSection>
        {/* All Sports Button */}
        <SportButton
          selected={selectedSport === 'All'}
          onClick={() => handleSportChange('All')}
          startIcon={!isMobile ? <SportsBaseball fontSize="small" /> : null}
        >
          All Sports
          <CountChip 
            label={getSportOpportunityCount('All')} 
            size="small"
            selected={selectedSport === 'All'}
          />
        </SportButton>

        {/* Individual Sports */}
        {availableSports.map((sport) => {
          const count = getSportOpportunityCount(sport);
          const isSelected = selectedSport === sport;
          
          return (
            <SportButton
              key={sport}
              selected={isSelected}
              onClick={() => handleSportChange(sport)}
            >
              {sport}
              <CountChip 
                label={count} 
                size="small"
                selected={isSelected}
              />
            </SportButton>
          );
        })}
      </SportsSection>
    </FilterBarContainer>
  );
};

export default SportFilterBar;

