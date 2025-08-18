// /src/components/filters/FilterSidebar.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Paper,
  Divider,
  IconButton,
  Collapse,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Clear,
  FilterList,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';

const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: 'calc(100vh - 128px)', // Account for header and sport filter bar
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  marginBottom: theme.spacing(1),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const FilterOptions = styled(Box)(({ theme }) => ({
  maxHeight: 200,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const FilterSidebar = () => {
  const {
    filters,
    updateFilter,
    getAvailableLeagues,
    getAvailableBookmakers,
    getFilteredOpportunities,
    resetFilters,
  } = useOpportunityStore();

  const [expandedSections, setExpandedSections] = useState({
    leagues: true,
    bookmakers: true,
    profit: true,
  });

  const [searchTerms, setSearchTerms] = useState({
    leagues: '',
    bookmakers: '',
  });

  const availableLeagues = getAvailableLeagues();
  const availableBookmakers = getAvailableBookmakers();
  const filteredOpportunities = getFilteredOpportunities();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLeagueChange = (league, checked) => {
    const newLeagues = checked
      ? [...filters.leagues, league]
      : filters.leagues.filter(l => l !== league);
    updateFilter('leagues', newLeagues);
  };

  const handleBookmakerChange = (bookmaker, checked) => {
    const newBookmakers = checked
      ? [...filters.bookmakers, bookmaker]
      : filters.bookmakers.filter(b => b !== bookmaker);
    updateFilter('bookmakers', newBookmakers);
  };

  const handleProfitChange = (event, newValue) => {
    updateFilter('minProfit', newValue);
  };
  
  const handleSelectAll = (type, items) => {
    if (type === 'leagues') {
        updateFilter('leagues', filters.leagues.length === items.length ? [] : items);
    } else if (type === 'bookmakers') {
        updateFilter('bookmakers', filters.bookmakers.length === items.length ? [] : items);
    }
  }


  const filterItems = (items, searchTerm) => {
    return items.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredLeagues = filterItems(availableLeagues, searchTerms.leagues);
  const filteredBookmakers = filterItems(availableBookmakers, searchTerms.bookmakers);

  return (
    <SidebarContainer elevation={0}>
      {/* Header */}
      <FilterSection>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Filters
          </Typography>
          <Button
            size="small"
            onClick={resetFilters}
            startIcon={<Clear />}
            color="secondary"
          >
            Clear All
          </Button>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Showing {filteredOpportunities.length} opportunities
        </Typography>
      </FilterSection>

      <Divider />

      {/* Leagues Filter */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('leagues')}>
          <Typography variant="subtitle1" component="h6" color="textPrimary">
            Leagues ({availableLeagues.length})
          </Typography>
          {expandedSections.leagues ? <ExpandLess /> : <ExpandMore />}
        </SectionHeader>

        <Collapse in={expandedSections.leagues}>
          <Box sx={{ mb: 1 }}>
            <TextField
              size="small"
              placeholder="Search leagues..."
              value={searchTerms.leagues}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, leagues: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Box>
          <Button size="small" onClick={() => handleSelectAll('leagues', availableLeagues)} sx={{ mb: 1 }}>
            {filters.leagues.length === availableLeagues.length ? 'Deselect All' : 'Select All'}
          </Button>

          <FilterOptions>
            {filteredLeagues.map((league) => (
              <FormControlLabel
                key={league}
                control={
                  <Checkbox
                    checked={filters.leagues.includes(league)}
                    onChange={(e) => handleLeagueChange(league, e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {league}
                  </Typography>
                }
                sx={{ width: '100%', mr: 0, mb: 0.5 }}
              />
            ))}
            {filteredLeagues.length === 0 && searchTerms.leagues && (
              <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                No leagues found
              </Typography>
            )}
          </FilterOptions>
        </Collapse>
      </FilterSection>

      <Divider />

      {/* Bookmakers Filter */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('bookmakers')}>
          <Typography variant="subtitle1" component="h6" color="textPrimary">
            Bookmakers ({availableBookmakers.length})
          </Typography>
          {expandedSections.bookmakers ? <ExpandLess /> : <ExpandMore />}
        </SectionHeader>

        <Collapse in={expandedSections.bookmakers}>
          <Box sx={{ mb: 1 }}>
            <TextField
              size="small"
              placeholder="Search bookmakers..."
              value={searchTerms.bookmakers}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, bookmakers: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Box>
          <Button size="small" onClick={() => handleSelectAll('bookmakers', availableBookmakers)} sx={{ mb: 1 }}>
            {filters.bookmakers.length === availableBookmakers.length ? 'Deselect All' : 'Select All'}
          </Button>

          <FilterOptions>
            {filteredBookmakers.map((bookmaker) => (
              <FormControlLabel
                key={bookmaker}
                control={
                  <Checkbox
                    checked={filters.bookmakers.includes(bookmaker)}
                    onChange={(e) => handleBookmakerChange(bookmaker, e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {bookmaker}
                  </Typography>
                }
                sx={{ width: '100%', mr: 0, mb: 0.5 }}
              />
            ))}
            {filteredBookmakers.length === 0 && searchTerms.bookmakers && (
              <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                No bookmakers found
              </Typography>
            )}
          </FilterOptions>
        </Collapse>
      </FilterSection>

      <Divider />

      {/* Profit Filter */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('profit')}>
          <Typography variant="subtitle1" component="h6" color="textPrimary">
            Min. Profit (%)
          </Typography>
          {expandedSections.profit ? <ExpandLess /> : <ExpandMore />}
        </SectionHeader>
        <Collapse in={expandedSections.profit}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.minProfit}
              onChange={handleProfitChange}
              aria-labelledby="profit-slider"
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0}
              max={10}
            />
            <Typography variant="body2" color="textSecondary" align="center">
              {filters.minProfit.toFixed(1)}%
            </Typography>
          </Box>
        </Collapse>
      </FilterSection>
    </SidebarContainer>
  );
};

export default FilterSidebar;