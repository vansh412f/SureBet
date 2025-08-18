// /src/components/filters/SportFilterBar.js
import React from 'react';
import { Box, Button, Chip } from '@mui/material';
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
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const SportButton = styled(Button)(({ theme, selected }) => ({
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  textTransform: 'capitalize',
  borderRadius: 20,
  padding: theme.spacing(0.5, 2),
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? 'white' : theme.palette.text.primary,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  '&:hover': {
    backgroundColor: selected 
      ? theme.palette.primary.dark 
      : theme.palette.primary.main + '20',
  },
}));

const CountChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: '0.75rem',
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  marginLeft: theme.spacing(0.5),
}));

const SportFilterBar = () => {
  const { 
    opportunities, 
    filters, 
    updateFilter, 
    getAvailableSports 
  } = useOpportunityStore();

  const availableSports = getAvailableSports();
  const selectedSport = filters.sport;

  const handleSportChange = (sport) => {
    updateFilter('sport', sport);
    // Reset dependent filters when sport changes
    if (sport !== selectedSport) {
      updateFilter('leagues', []);
      updateFilter('bookmakers', []);
    }
  };

  const getSportOpportunityCount = (sport) => {
    if (sport === 'All') {
      return opportunities.length;
    }
    return opportunities.filter(opp => opp.sport === sport).length;
  };

  return (
    <FilterBarContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* All Sports Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SportButton
            selected={selectedSport === 'All'}
            onClick={() => handleSportChange('All')}
          >
            All Sports
          </SportButton>
          <CountChip 
            label={getSportOpportunityCount('All')} 
            size="small" 
          />
        </Box>

        {/* Individual Sport Buttons */}
        {availableSports.map((sport) => (
          <Box key={sport} sx={{ display: 'flex', alignItems: 'center' }}>
            <SportButton
              selected={selectedSport === sport}
              onClick={() => handleSportChange(sport)}
            >
              {sport}
            </SportButton>
            <CountChip 
              label={getSportOpportunityCount(sport)} 
              size="small" 
            />
          </Box>
        ))}
      </Box>

      {/* Active Filters Summary */}
      {(filters.leagues.length > 0 || filters.bookmakers.length > 0 || filters.minProfit > 0) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          {filters.leagues.length > 0 && (
            <Chip
              label={`${filters.leagues.length} league${filters.leagues.length > 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {filters.bookmakers.length > 0 && (
            <Chip
              label={`${filters.bookmakers.length} bookmaker${filters.bookmakers.length > 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {filters.minProfit > 0 && (
            <Chip
              label={`Min ${filters.minProfit}% profit`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Box>
      )}
    </FilterBarContainer>
  );
};

export default SportFilterBar;