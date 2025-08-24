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
  Drawer,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Clear,
  ChevronLeft,
  ChevronRight,
  FilterList,
  TuneRounded,
  CheckCircleRounded,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';

// Animations
const slideIn = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -100px 0; }
  100% { background-position: calc(100px + 100%) 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(25, 118, 210, 0.2); }
  50% { box-shadow: 0 0 15px rgba(25, 118, 210, 0.4); }
`;

// Styled Components
const SidebarContainer = styled(Box)(({ theme, isOpen }) => ({
  width: isOpen ? 320 : 0,
  height: 'calc(100vh - 64px)',
  background: `linear-gradient(180deg, ${theme.palette.background.paper}98 0%, ${theme.palette.background.default}95 100%)`,
  backdropFilter: 'blur(20px)',
  borderRight: `1px solid ${theme.palette.divider}40`,
  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const CollapsedSidebar = styled(Box)(({ theme }) => ({
  width: 48,
  height: 'calc(100vh - 64px)',
  background: `linear-gradient(180deg, ${theme.palette.background.paper}98 0%, ${theme.palette.background.default}95 100%)`,
  backdropFilter: 'blur(20px)',
  borderRight: `1px solid ${theme.palette.divider}40`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 0),
  position: 'relative',
}));

const CollapsedText = styled(Typography)(({ theme }) => ({
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '0.8rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: '50%',
  width: 36,
  height: 36,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}05)`,
    transform: 'translateY(-1px) scale(1.02)',
    boxShadow: `0 4px 15px ${theme.palette.primary.main}20`,
  },
}));

// FIXED: Made header sticky/fixed
const StickyHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}06, ${theme.palette.secondary.main}03)`,
  backdropFilter: 'blur(15px)',
  padding: theme.spacing(1.2),
  borderBottom: `1px solid ${theme.palette.divider}30`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100px',
    width: '100px',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}08, transparent)`,
    animation: `${shimmer} 4s ease-in-out infinite`,
  },
}));

const HeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.9rem',
  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.8),
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(0.8),
  marginTop: theme.spacing(1),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.8),
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  border: `1px solid ${theme.palette.divider}25`,
  borderRadius: 6,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 15px ${theme.palette.primary.main}10`,
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginTop: theme.spacing(0.2),
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}));

const ClearButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.error.main}10, ${theme.palette.error.light}05)`,
  border: `1px solid ${theme.palette.error.main}25`,
  color: theme.palette.error.main,
  borderRadius: 16,
  padding: theme.spacing(0.6, 1.2),
  fontSize: '0.7rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.error.main}20, ${theme.palette.error.light}10)`,
    transform: 'translateY(-0.5px)',
    boxShadow: `0 3px 12px ${theme.palette.error.main}20`,
  },
}));

// FIXED: Made scrollable content area independent
const ScrollableContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: `linear-gradient(180deg, ${theme.palette.primary.main}60, ${theme.palette.primary.dark}60)`,
    borderRadius: 2,
    '&:hover': {
      background: `linear-gradient(180deg, ${theme.palette.primary.main}80, ${theme.palette.primary.dark}80)`,
    },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 1.2, 0.8, 1.2),
  animation: `${slideIn} 0.5s ease-out`,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  padding: theme.spacing(0.8, 0, 0.6, 0),
  borderBottom: `1px solid transparent`,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderBottomColor: `${theme.palette.primary.main}30`,
    '& .section-title': {
      color: theme.palette.primary.main,
    },
    '& .section-icon': {
      transform: 'rotate(180deg)',
      color: theme.palette.primary.main,
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.8rem',
  color: theme.palette.text.primary,
  transition: 'color 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.8),
}));

const SectionBadge = styled(Chip)(({ theme }) => ({
  height: 18,
  fontSize: '0.6rem',
  fontWeight: 600,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}25`,
}));

const ExpandIcon = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: theme.palette.text.secondary,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(0.8),
  '& .MuiOutlinedInput-root': {
    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
    borderRadius: 6,
    border: `1px solid ${theme.palette.divider}25`,
    transition: 'all 0.3s ease',
    '& input': {
      padding: theme.spacing(0.6, 0.8),
      fontSize: '0.75rem',
    },
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}40`,
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.primary.main}`,
      animation: `${pulseGlow} 2s ease-in-out infinite`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
  },
}));

const FilterOptions = styled(Box)(({ theme }) => ({
  maxHeight: 180,
  overflowY: 'auto',
  paddingRight: theme.spacing(0.5),
  '&::-webkit-scrollbar': {
    width: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: `${theme.palette.primary.main}40`,
    borderRadius: 1.5,
  },
}));

const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',
  marginRight: 0,
  marginBottom: theme.spacing(0.3),
  padding: theme.spacing(0.4, 0.6),
  borderRadius: 4,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `${theme.palette.primary.main}06`,
    transform: 'translateX(2px)',
  },
  '& .MuiCheckbox-root': {
    padding: theme.spacing(0.3),
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiTypography-root': {
    fontSize: '0.75rem',
    fontWeight: 500,
  },
}));

const SelectAllButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: theme.spacing(0.6, 1),
  marginBottom: theme.spacing(0.8),
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}25`,
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}04)`,
    border: `1px solid ${theme.palette.primary.main}40`,
    transform: 'translateY(-0.5px)',
  },
}));

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 6,
  '& .MuiSlider-track': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    border: '2px solid currentColor',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    '&:hover, &.Mui-focusVisible, &.Mui-active': {
      boxShadow: `0 3px 12px ${theme.palette.primary.main}35`,
      transform: 'scale(1.05)',
    },
  },
  '& .MuiSlider-rail': {
    background: theme.palette.divider,
    opacity: 0.7,
  },
}));

const ProfitDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.8),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}04)`,
  borderRadius: 8,
  border: `1px solid ${theme.palette.primary.main}15`,
}));

const ProfitValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.85rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const MobileToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(8.5),
  left: theme.spacing(2),
  zIndex: 1300,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  width: 44,
  height: 44,
  boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    transform: 'scale(1.02)',
  },
}));

const FilterSidebar = ({ isOpen, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const SidebarContent = () => (
    <>
      {/* FIXED: Sticky Header */}
      <StickyHeader>
        <HeaderTop>
          <HeaderTitle className="section-title">
            <TuneRounded fontSize="small" />
            Advanced Filters
          </HeaderTitle>
          {!isMobile && (
            <ToggleButton onClick={onToggle} size="small">
              {isOpen ? <ChevronLeft /> : <ChevronRight />}
            </ToggleButton>
          )}
        </HeaderTop>

        <ClearButton
          startIcon={<Clear />}
          onClick={handleClearAll}
          fullWidth
        >
          Clear All Filters
        </ClearButton>

        <StatsContainer>
          <StatCard elevation={0}>
            <StatNumber>{stats.matchesScanned}</StatNumber>
            <StatLabel>Matches</StatLabel>
          </StatCard>
          <StatCard elevation={0}>
            <StatNumber>{filteredOpportunities.length}</StatNumber>
            <StatLabel>Showing</StatLabel>
          </StatCard>
        </StatsContainer>
      </StickyHeader>

      {/* FIXED: Scrollable Content Area */}
      <ScrollableContent>
        {/* Leagues Filter */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('leagues')}>
            <Box display="flex" alignItems="center" gap={0.8}>
              <SectionTitle className="section-title">
                Leagues
              </SectionTitle>
              <SectionBadge label={availableLeagues.length} size="small" />
            </Box>
            <ExpandIcon className="section-icon">
              {expandedSections.leagues ? <ExpandLess /> : <ExpandMore />}
            </ExpandIcon>
          </SectionHeader>

          <Collapse in={expandedSections.leagues} timeout={300}>
            <SearchField
              placeholder="Search leagues..."
              size="small"
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

            <SelectAllButton
              onClick={() => handleSelectAll('leagues', availableLeagues)}
              startIcon={
                filters.leagues.length === availableLeagues.length ? (
                  <CheckCircleRounded />
                ) : (
                  <Checkbox
                    indeterminate={
                      filters.leagues.length > 0 &&
                      filters.leagues.length < availableLeagues.length
                    }
                    checked={filters.leagues.length === availableLeagues.length}
                    size="small"
                  />
                )
              }
            >
              {filters.leagues.length === availableLeagues.length
                ? 'Deselect All'
                : 'Select All'}
            </SelectAllButton>

            <FilterOptions>
              {filteredLeagues.map((league) => (
                <CustomFormControlLabel
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
                  label={league}
                />
              ))}
              {filteredLeagues.length === 0 && searchTerms.leagues && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="center"
                  py={1}
                  fontSize="0.7rem"
                >
                  No leagues found
                </Typography>
              )}
            </FilterOptions>
          </Collapse>
        </FilterSection>

        <Divider sx={{ mx: 1.2, opacity: 0.3 }} />

        {/* Bookmakers Filter */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('bookmakers')}>
            <Box display="flex" alignItems="center" gap={0.8}>
              <SectionTitle className="section-title">
                Bookmakers
              </SectionTitle>
              <SectionBadge label={availableBookmakers.length} size="small" />
            </Box>
            <ExpandIcon className="section-icon">
              {expandedSections.bookmakers ? <ExpandLess /> : <ExpandMore />}
            </ExpandIcon>
          </SectionHeader>

          <Collapse in={expandedSections.bookmakers} timeout={300}>
            <SearchField
              placeholder="Search bookmakers..."
              size="small"
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

            <SelectAllButton
              onClick={() => handleSelectAll('bookmakers', availableBookmakers)}
              startIcon={
                filters.bookmakers.length === availableBookmakers.length ? (
                  <CheckCircleRounded />
                ) : (
                  <Checkbox
                    indeterminate={
                      filters.bookmakers.length > 0 &&
                      filters.bookmakers.length < availableBookmakers.length
                    }
                    checked={filters.bookmakers.length === availableBookmakers.length}
                    size="small"
                  />
                )
              }
            >
              {filters.bookmakers.length === availableBookmakers.length
                ? 'Deselect All'
                : 'Select All'}
            </SelectAllButton>

            <FilterOptions>
              {filteredBookmakers.map((bookmaker) => (
                <CustomFormControlLabel
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
                  label={bookmaker}
                />
              ))}
              {filteredBookmakers.length === 0 && searchTerms.bookmakers && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="center"
                  py={1}
                  fontSize="0.7rem"
                >
                  No bookmakers found
                </Typography>
              )}
            </FilterOptions>
          </Collapse>
        </FilterSection>

        <Divider sx={{ mx: 1.2, opacity: 0.3 }} />

        {/* Profit Filter */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('profit')}>
            <SectionTitle className="section-title">
              Minimum Profit
            </SectionTitle>
            <ExpandIcon className="section-icon">
              {expandedSections.profit ? <ExpandLess /> : <ExpandMore />}
            </ExpandIcon>
          </SectionHeader>

          <Collapse in={expandedSections.profit} timeout={300}>
            <ProfitDisplay>
              <Typography variant="body2" color="textSecondary" fontSize="0.7rem">
                Min. Profit
              </Typography>
              <ProfitValue>
                {filters.minProfit.toFixed(1)}%
              </ProfitValue>
            </ProfitDisplay>

            <CustomSlider
              value={filters.minProfit}
              onChange={handleProfitChange}
              min={0}
              max={20}
              step={0.1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value.toFixed(1)}%`}
            />
          </Collapse>
        </FilterSection>
      </ScrollableContent>
    </>
  );

  // Collapsed Sidebar - CHANGED vertical text to "Filters"
  if (!isOpen && !isMobile) {
    return (
      <CollapsedSidebar>
        <ToggleButton onClick={onToggle}>
          <ChevronRight />
        </ToggleButton>
        <CollapsedText>Filters</CollapsedText>
      </CollapsedSidebar>
    );
  }

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        <MobileToggleButton onClick={onToggle}>
          <FilterList />
        </MobileToggleButton>
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={onToggle}
          PaperProps={{
            sx: {
              width: 320,
              background: (theme) =>
                `linear-gradient(180deg, ${theme.palette.background.paper}98 0%, ${theme.palette.background.default}95 100%)`,
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarContent />
    </SidebarContainer>
  );
};

export default FilterSidebar;

