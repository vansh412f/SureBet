import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';

const FilterBarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'center',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    height: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const StatBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginLeft: theme.spacing(0.5),
  color: theme.palette.primary.main,
}));

const SportButton = styled(Button)(({ theme, selected }) => ({
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  textTransform: 'capitalize',
  borderRadius: 20,
  padding: theme.spacing(0.5, 2),
  fontWeight: 600,
  transition: 'all 0.25s ease',
  ...(selected
    ? {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }
    : {
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
        },
      }),
}));

const CountChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: '0.75rem',
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  marginLeft: theme.spacing(0.5),
  fontWeight: 600,
}));

const SportFilterBar = () => {
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
    // Then, count within that view-specific list
    return viewOpportunities.filter((opp) => opp.sport_title === sport).length;
  };

  return (
    <FilterBarContainer>
      {/* Matches Scanned Block */}
      <StatBlock>
        <Typography variant="body2" color="text.secondary" >
          Matches Scanned:
        </Typography>
        <StatNumber variant="body2">
          {stats.matchesScanned}
        </StatNumber>
      </StatBlock>

      {/* Sports Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* All Sports */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SportButton
            selected={selectedSport === 'All'}
            onClick={() => handleSportChange('All')}
          >
            All Sports
          </SportButton>
          <CountChip label={getSportOpportunityCount('All')} size="small" />
        </Box>

        {/* Individual Sports */}
        {availableSports.map((sport) => (
          <Box key={sport} sx={{ display: 'flex', alignItems: 'center' }}>
            <SportButton
              selected={selectedSport === sport}
              onClick={() => handleSportChange(sport)}
            >
              {sport}
            </SportButton>
            <CountChip label={getSportOpportunityCount(sport)} size="small" />
          </Box>
        ))}
      </Box>
    </FilterBarContainer>
  );
};

export default SportFilterBar;