import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Clear,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 320,
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.05)',
  borderRight: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  position: 'relative',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
  },
}));

const CollapsedSidebar = styled(Box)(({ theme }) => ({
  width: 24,
  height: 'calc(100vh - 64px)',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 0),
  position: 'relative',
}));

const BrandText = styled(Typography)(({ theme }) => ({
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.875rem',
  letterSpacing: '0.1em',
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const HeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StatsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StatBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: 4,
  backgroundColor: theme.palette.action.selected,
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginLeft: theme.spacing(0.5),
  color: theme.palette.primary.main,
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
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const FilterOptions = styled(Box)(({ theme }) => ({
  maxHeight: 200,
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const FilterSidebar = ({ isOpen, onToggle }) => {
  const {
    stats,
    updateFilter,
    getAvailableLeagues,
    getAvailableBookmakers,
    getFilteredOpportunities,
    resetFilters,
    getCurrentFilters,
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

  const filters = getCurrentFilters();
  const availableLeagues = getAvailableLeagues();
  const availableBookmakers = getAvailableBookmakers();
  const filteredOpportunities = getFilteredOpportunities();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLeagueChange = (league, checked) => {
    const newLeagues = checked
      ? [...filters.leagues, league]
      : filters.leagues.filter((l) => l !== league);
    updateFilter('leagues', newLeagues);
  };

  const handleBookmakerChange = (bookmaker, checked) => {
    const newBookmakers = checked
      ? [...filters.bookmakers, bookmaker]
      : filters.bookmakers.filter((b) => b !== bookmaker);
    updateFilter('bookmakers', newBookmakers);
  };

  const handleProfitChange = (event, newValue) => {
    updateFilter('minProfit', newValue);
  };

  const handleSelectAll = (type, items) => {
    if (type === 'leagues') {
      updateFilter(
        'leagues',
        filters.leagues.length === items.length ? [] : items
      );
    } else if (type === 'bookmakers') {
      updateFilter(
        'bookmakers',
        filters.bookmakers.length === items.length ? [] : items
      );
    }
  };

  const handleClearAll = () => {
    resetFilters();
    setSearchTerms({
      leagues: '',
      bookmakers: '',
    });
  };

  const filterItems = (items, searchTerm) =>
    items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredLeagues = filterItems(availableLeagues, searchTerms.leagues);
  const filteredBookmakers = filterItems(
    availableBookmakers,
    searchTerms.bookmakers
  );

  if (!isOpen) {
    return (
      <CollapsedSidebar>
        <BrandText>SureBet</BrandText>
        <ToggleButton onClick={onToggle} size="small">
          <ChevronRight />
        </ToggleButton>
      </CollapsedSidebar>
    );
  }

  return (
    <SidebarContainer>
      {/* Toggle Button */}
      <ToggleButton 
        onClick={onToggle} 
        size="small"
        sx={{ 
          position: 'absolute',
          top: '50%',
          right: -20,
          zIndex: 1000,
        }}
      >
        <ChevronLeft />
      </ToggleButton>

      {/* Header */}
      <HeaderBar>
        <HeaderTop>
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <Button
            size="small"
            onClick={handleClearAll}
            startIcon={<Clear />}
            color="error"
            sx={{ fontWeight: 600 }}
          >
            Clear All
          </Button>
        </HeaderTop>
        
        <StatsRow>
          <StatBlock>
            <Typography variant="body2" color="text.secondary">
              Matches:
            </Typography>
            <StatNumber variant="body2">
              {stats.matchesScanned}
            </StatNumber>
          </StatBlock>
          
          <Typography variant="body2" color="text.secondary">
            Showing{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              {filteredOpportunities.length}
            </Typography>{' '}
            opportunities
          </Typography>
        </StatsRow>
      </HeaderBar>

      <Divider />

      {/* Leagues Filter */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('leagues')}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
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
              onChange={(e) =>
                setSearchTerms((prev) => ({ ...prev, leagues: e.target.value }))
              }
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
          <Button
            size="small"
            onClick={() => handleSelectAll('leagues', availableLeagues)}
            sx={{ mb: 1 }}
          >
            {filters.leagues.length === availableLeagues.length
              ? 'Deselect All'
              : 'Select All'}
          </Button>

          <FilterOptions>
            {filteredLeagues.map((league) => (
              <FormControlLabel
                key={league}
                control={
                  <Checkbox
                    checked={filters.leagues.includes(league)}
                    onChange={(e) =>
                      handleLeagueChange(league, e.target.checked)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{league}</Typography>}
                sx={{ width: '100%', mr: 0, mb: 0.5 }}
              />
            ))}
            {filteredLeagues.length === 0 && searchTerms.leagues && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ p: 1, fontStyle: 'italic' }}
              >
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
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
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
              onChange={(e) =>
                setSearchTerms((prev) => ({
                  ...prev,
                  bookmakers: e.target.value,
                }))
              }
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
          <Button
            size="small"
            onClick={() =>
              handleSelectAll('bookmakers', availableBookmakers)
            }
            sx={{ mb: 1 }}
          >
            {filters.bookmakers.length === availableBookmakers.length
              ? 'Deselect All'
              : 'Select All'}
          </Button>

          <FilterOptions>
            {filteredBookmakers.map((bookmaker) => (
              <FormControlLabel
                key={bookmaker}
                control={
                  <Checkbox
                    checked={filters.bookmakers.includes(bookmaker)}
                    onChange={(e) =>
                      handleBookmakerChange(bookmaker, e.target.checked)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{bookmaker}</Typography>}
                sx={{ width: '100%', mr: 0, mb: 0.5 }}
              />
            ))}
            {filteredBookmakers.length === 0 && searchTerms.bookmakers && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ p: 1, fontStyle: 'italic' }}
              >
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
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
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
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'primary.main',
                },
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              {filters.minProfit.toFixed(1)}%
            </Typography>
          </Box>
        </Collapse>
      </FilterSection>
    </SidebarContainer>
  );
};

export default FilterSidebar;