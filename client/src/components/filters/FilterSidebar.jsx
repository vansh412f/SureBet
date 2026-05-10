import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Checkbox, FormControlLabel, Slider,
  Divider, TextField, InputAdornment, Button, Collapse,
  IconButton, Drawer, useMediaQuery, useTheme, Chip,
} from '@mui/material';
import {
  ExpandMore, ExpandLess, Search, Clear,
  ChevronLeft, ChevronRight, FilterList, TuneRounded, Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { getSportCat, filterOpportunities } from '../../utils/sportUtils';

const SidebarWrap = styled(Box)(({ theme, isopen }) => ({
  width: isopen ? 'clamp(260px, 18vw, 300px)' : '48px',
  height: 'calc(100vh - 64px)',
  background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}));

const StickyHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5),
}));

const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
});

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 1.5, 1.5, 1.5),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  padding: theme.spacing(1.2, 0, 0.8),
  userSelect: 'none',
  '&:hover .sec-title': { color: theme.palette.primary.light },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.8),
  transition: 'color 0.2s',
}));

const OptionList = styled(Box)({
  maxHeight: 200,
  overflowY: 'auto',
});

const OptionLabel = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',
  marginRight: 0,
  marginBottom: 1,
  padding: theme.spacing(0.2, 0.6),
  borderRadius: 6,
  transition: 'background 0.15s',
  '&:hover': { background: 'rgba(59,130,246,0.06)' },
  '& .MuiCheckbox-root': { padding: 4 },
  '& .MuiTypography-root': { fontSize: '0.8rem', fontWeight: 500 },
}));

const StatChip = styled(Box)(({ theme }) => ({
  flex: 1,
  background: 'rgba(59,130,246,0.07)',
  border: `1px solid rgba(59,130,246,0.15)`,
  borderRadius: 8,
  padding: theme.spacing(0.8, 1),
  textAlign: 'center',
}));

const ClearBtn = styled(Button)(({ theme }) => ({
  width: '100%',
  fontSize: '0.75rem',
  color: theme.palette.error.light,
  border: `1px solid ${theme.palette.error.main}30`,
  borderRadius: 8,
  padding: theme.spacing(0.6, 0),
  marginTop: theme.spacing(1),
  '&:hover': { background: `${theme.palette.error.main}12` },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(0.8),
  '& .MuiOutlinedInput-root': {
    fontSize: '0.8rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 7,
    '& fieldset': { borderColor: theme.palette.divider },
    '&:hover fieldset': { borderColor: `rgba(59,130,246,0.4)` },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
    '& input': { padding: '7px 10px' },
  },
}));

const SidebarContent = ({
  onToggle, isMobile,
  stats, filters, viewMode, viewOpps,
  expandedSections, toggleSection,
  searchTerms, setSearchTerms,
  filteredCount, availableLeagues, availableBookmakers,
  filteredLeagues, filteredBookmakers,
  handleLeagueChange, handleBookmakerChange,
  handleSelectAll, handleProfitChange, handleClearAll,
}) => {
  const hasActiveFilters =
    filters.leagues.length > 0 ||
    filters.bookmakers.length > 0 ||
    filters.minProfit > 0;

  return (
    <>
      <StickyHeader>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={0.8}>
            <TuneRounded sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
              Filters
            </Typography>
          </Box>
          {isMobile
            ? <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
                <Close fontSize="small" />
              </IconButton>
            : <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
                <ChevronLeft fontSize="small" />
              </IconButton>
          }
        </Box>

        <Box display="flex" gap={1}>
          <StatChip>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'primary.light', lineHeight: 1 }}>
              {stats.matchesScanned || 0}
            </Typography>
            <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Scanned
            </Typography>
          </StatChip>
          <StatChip>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'secondary.light', lineHeight: 1 }}>
              {filteredCount}
            </Typography>
            <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Showing
            </Typography>
          </StatChip>
        </Box>

        {hasActiveFilters && (
          <ClearBtn startIcon={<Clear sx={{ fontSize: 14 }} />} onClick={handleClearAll}>
            Clear All Filters
          </ClearBtn>
        )}
      </StickyHeader>

      <ScrollArea>
        <Section>
          <SectionHeader onClick={() => toggleSection('leagues')}>
            <SectionTitle className="sec-title">
              Leagues
              <Chip label={availableLeagues.length} size="small"
                sx={{ height: 16, fontSize: '0.6rem', background: 'rgba(59,130,246,0.15)', color: 'primary.light' }} />
            </SectionTitle>
            {expandedSections.leagues ? <ExpandLess sx={{ fontSize: 18, color: 'text.disabled' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'text.disabled' }} />}
          </SectionHeader>
          <Collapse in={expandedSections.leagues}>
            <SearchInput
              placeholder="Search leagues…"
              size="small"
              fullWidth
              value={searchTerms.leagues}
              onChange={e => setSearchTerms(p => ({ ...p, leagues: e.target.value }))}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 14, color: 'text.disabled' }} /></InputAdornment> }}
            />
            {availableLeagues.length > 0 && (
              <Button size="small" fullWidth
                sx={{ justifyContent: 'flex-start', fontSize: '0.72rem', color: 'text.secondary', mb: 0.5 }}
                onClick={() => handleSelectAll('leagues', availableLeagues)}
              >
                {filters.leagues.length === availableLeagues.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
            <OptionList>
              {filteredLeagues.map(league => (
                <OptionLabel key={league}
                  control={
                    <Checkbox size="small" checked={filters.leagues.includes(league)}
                      onChange={e => handleLeagueChange(league, e.target.checked)}
                      sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label={league}
                />
              ))}
              {filteredLeagues.length === 0 && searchTerms.leagues && (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', py: 1, textAlign: 'center' }}>
                  No leagues found
                </Typography>
              )}
            </OptionList>
          </Collapse>
        </Section>

        <Divider sx={{ opacity: 0.4, mx: 1.5 }} />

        <Section>
          <SectionHeader onClick={() => toggleSection('bookmakers')}>
            <SectionTitle className="sec-title">
              Bookmakers
              <Chip label={availableBookmakers.length} size="small"
                sx={{ height: 16, fontSize: '0.6rem', background: 'rgba(59,130,246,0.15)', color: 'primary.light' }} />
            </SectionTitle>
            {expandedSections.bookmakers ? <ExpandLess sx={{ fontSize: 18, color: 'text.disabled' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'text.disabled' }} />}
          </SectionHeader>
          <Collapse in={expandedSections.bookmakers}>
            <SearchInput
              placeholder="Search bookmakers…"
              size="small"
              fullWidth
              value={searchTerms.bookmakers}
              onChange={e => setSearchTerms(p => ({ ...p, bookmakers: e.target.value }))}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 14, color: 'text.disabled' }} /></InputAdornment> }}
            />
            {availableBookmakers.length > 0 && (
              <Button size="small" fullWidth
                sx={{ justifyContent: 'flex-start', fontSize: '0.72rem', color: 'text.secondary', mb: 0.5 }}
                onClick={() => handleSelectAll('bookmakers', availableBookmakers)}
              >
                {filters.bookmakers.length === availableBookmakers.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
            <OptionList>
              {filteredBookmakers.map(bk => (
                <OptionLabel key={bk}
                  control={
                    <Checkbox size="small" checked={filters.bookmakers.includes(bk)}
                      onChange={e => handleBookmakerChange(bk, e.target.checked)}
                      sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label={bk}
                />
              ))}
              {filteredBookmakers.length === 0 && searchTerms.bookmakers && (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', py: 1, textAlign: 'center' }}>
                  No bookmakers found
                </Typography>
              )}
            </OptionList>
          </Collapse>
        </Section>

        <Divider sx={{ opacity: 0.4, mx: 1.5 }} />

        <Section>
          <SectionHeader onClick={() => toggleSection('profit')}>
            <SectionTitle className="sec-title">Min Profit %</SectionTitle>
            {expandedSections.profit ? <ExpandLess sx={{ fontSize: 18, color: 'text.disabled' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'text.disabled' }} />}
          </SectionHeader>
          <Collapse in={expandedSections.profit}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}
              sx={{ background: 'rgba(16,185,129,0.07)', borderRadius: 2, px: 1.5, py: 0.8, border: '1px solid rgba(16,185,129,0.15)' }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Minimum</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'secondary.light' }}>
                {filters.minProfit.toFixed(1)}%
              </Typography>
            </Box>
            <Slider
              value={filters.minProfit}
              onChange={handleProfitChange}
              min={0} max={20} step={0.1}
              valueLabelDisplay="auto"
              valueLabelFormat={v => `${v.toFixed(1)}%`}
              sx={{
                color: 'secondary.main',
                '& .MuiSlider-track': { background: 'linear-gradient(90deg, #10B981, #34D399)' },
                '& .MuiSlider-thumb': { width: 14, height: 14 },
              }}
            />
          </Collapse>
        </Section>
      </ScrollArea>
    </>
  );
};

const FilterSidebar = ({ isOpen, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const opportunities  = useOpportunityStore(s => s.opportunities);
  const viewMode       = useOpportunityStore(s => s.viewMode);
  const liveFilters    = useOpportunityStore(s => s.liveFilters);
  const pastFilters    = useOpportunityStore(s => s.pastFilters);
  const stats          = useOpportunityStore(s => s.stats);
  const updateFilter   = useOpportunityStore(s => s.updateFilter);
  const resetFilters   = useOpportunityStore(s => s.resetFilters);

  const filters = viewMode === 'live' ? liveFilters : pastFilters;

  const viewOpps = useMemo(
    () => opportunities.filter(op => op.status === viewMode),
    [opportunities, viewMode]
  );

  const availableLeagues = useMemo(() => {
    const pool = filters.sport !== 'All'
      ? viewOpps.filter(op => getSportCat(op) === filters.sport)
      : viewOpps;
    return [...new Set(pool.map(op => op.sport_title).filter(Boolean))].sort();
  }, [viewOpps, filters.sport]);

  const availableBookmakers = useMemo(() => {
    const bk = new Set();
    viewOpps.forEach(op => op.bets_to_place?.forEach(b => bk.add(b.bookmaker_title)));
    return [...bk].sort();
  }, [viewOpps]);

  const filteredCount = useMemo(
    () => filterOpportunities(opportunities, viewMode, filters).length,
    [opportunities, viewMode, filters]
  );

  const [expandedSections, setExpandedSections] = useState({ leagues: true, bookmakers: true, profit: true });
  const [searchTerms, setSearchTerms] = useState({ leagues: '', bookmakers: '' });

  const toggleSection = s => setExpandedSections(p => ({ ...p, [s]: !p[s] }));

  const filteredLeagues = useMemo(
    () => availableLeagues.filter(l => l.toLowerCase().includes(searchTerms.leagues.toLowerCase())),
    [availableLeagues, searchTerms.leagues]
  );
  const filteredBookmakers = useMemo(
    () => availableBookmakers.filter(b => b.toLowerCase().includes(searchTerms.bookmakers.toLowerCase())),
    [availableBookmakers, searchTerms.bookmakers]
  );

  const handleLeagueChange = (league, checked) =>
    updateFilter('leagues', checked ? [...filters.leagues, league] : filters.leagues.filter(l => l !== league), viewMode);

  const handleBookmakerChange = (bk, checked) =>
    updateFilter('bookmakers', checked ? [...filters.bookmakers, bk] : filters.bookmakers.filter(b => b !== bk), viewMode);

  const handleSelectAll = (type, items) => {
    const current = filters[type];
    updateFilter(type, current.length === items.length ? [] : items, viewMode);
  };

  const handleProfitChange = (_, val) => updateFilter('minProfit', val, viewMode);

  const handleClearAll = () => {
    resetFilters(viewMode);
    setSearchTerms({ leagues: '', bookmakers: '' });
  };

  const contentProps = {
    onToggle, isMobile, stats, filters, viewMode, viewOpps,
    expandedSections, toggleSection,
    searchTerms, setSearchTerms,
    filteredCount, availableLeagues, availableBookmakers,
    filteredLeagues, filteredBookmakers,
    handleLeagueChange, handleBookmakerChange,
    handleSelectAll, handleProfitChange, handleClearAll,
  };

  if (isMobile) {
    return (
      <>
        {!isOpen && (
          <IconButton onClick={onToggle} sx={{
            position: 'fixed', bottom: '20vh', left: 16, zIndex: 1300,
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#fff', width: 44, height: 44,
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
            '&:hover': { background: 'linear-gradient(135deg,#2563EB,#3B82F6)', transform: 'scale(1.05)' },
          }}>
            <FilterList />
          </IconButton>
        )}
        <Drawer anchor="left" open={isOpen} onClose={onToggle}
          PaperProps={{ sx: { width: 300, background: theme.palette.background.paper, borderRight: `1px solid ${theme.palette.divider}` } }}>
          <SidebarContent {...contentProps} />
        </Drawer>
      </>
    );
  }

  return (
    <SidebarWrap isopen={isOpen ? 1 : 0}>
      {isOpen ? (
        <SidebarContent {...contentProps} />
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" pt={2} gap={2}>
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <ChevronRight fontSize="small" />
          </IconButton>
          <Typography sx={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'text.disabled',
          }}>
            Filters
          </Typography>
        </Box>
      )}
    </SidebarWrap>
  );
};

export default FilterSidebar;
