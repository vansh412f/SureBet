import React, { useRef, useMemo } from 'react';
import { Box, Button, Chip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { getSportCat } from '../../utils/sportUtils';
import { Assessment } from '@mui/icons-material';

const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(59,130,246,0); }
`;

const Bar = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0.8, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  overflowX: 'auto',
  minHeight: 44,
  '&::-webkit-scrollbar': { display: 'none' },
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(0.6, 1) },
}));

const SportBtn = styled(Button)(({ theme, selected }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  textTransform: 'none',
  borderRadius: 20,
  padding: theme.spacing(0.45, 1.6),
  fontWeight: 700,
  fontSize: '0.8rem',
  transition: 'all 0.25s ease',
  ...(selected
    ? {
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(59,130,246,0.4)',
        animation: `${pulse} 2.5s ease-in-out infinite`,
      }
    : {
        background: 'transparent',
        border: `1px solid rgba(255,255,255,0.1)`,
        color: theme.palette.text.secondary,
        '&:hover': {
          background: 'rgba(59,130,246,0.08)',
          color: theme.palette.primary.light,
          borderColor: 'rgba(59,130,246,0.35)',
        },
      }),
}));

const CountBadge = styled(Box)(({ selected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  fontSize: '0.62rem',
  fontWeight: 700,
  marginLeft: 5,
  background: selected ? 'rgba(255,255,255,0.25)' : 'rgba(16,185,129,0.2)',
  color: selected ? '#fff' : '#34D399',
}));

const Sep = styled(Box)(({ theme }) => ({
  width: 1,
  height: 20,
  background: theme.palette.divider,
  flexShrink: 0,
  mx: 0.5,
}));

const SportFilterBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // BUG-10 fix: removed the no-op scroll listener useEffect — scrollRef is still used for
  // potential future use or native scroll behaviour, but the empty handler is gone.
  const scrollRef = useRef(null);

  // ── Reactive subscriptions ───────────────────────────────────────────────
  const opportunities = useOpportunityStore(s => s.opportunities);
  const viewMode      = useOpportunityStore(s => s.viewMode);
  const liveFilters   = useOpportunityStore(s => s.liveFilters);
  const pastFilters   = useOpportunityStore(s => s.pastFilters);
  const stats         = useOpportunityStore(s => s.stats);
  const updateFilter  = useOpportunityStore(s => s.updateFilter);

  const filters = viewMode === 'live' ? liveFilters : pastFilters;

  const viewOpps = useMemo(
    () => opportunities.filter(op => op.status === viewMode),
    [opportunities, viewMode]
  );

  const availableSports = useMemo(() => {
    const cats = new Set(viewOpps.map(op => getSportCat(op)).filter(Boolean));
    return [...cats].sort();
  }, [viewOpps]);

  const getCount = sport =>
    sport === 'All' ? viewOpps.length : viewOpps.filter(op => getSportCat(op) === sport).length;

  // BUG-04 fix: pass explicit viewMode to updateFilter
  const handleSportChange = sport => {
    updateFilter('sport', sport, viewMode);
    if (sport !== filters.sport) updateFilter('leagues', [], viewMode);
  };

  return (
    <Bar ref={scrollRef}>
      {/* Stats chip */}
      <Box display="flex" alignItems="center" gap={0.8} flexShrink={0}
        sx={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 2, px: 1.2, py: 0.5 }}>
        <Assessment sx={{ fontSize: '0.9rem', color: 'primary.light' }} />
        {!isMobile && (
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Scanned:
          </Typography>
        )}
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: 'primary.light' }}>
          {stats.matchesScanned || 0}
        </Typography>
      </Box>

      <Sep />

      {/* All sports button */}
      <SportBtn selected={filters.sport === 'All' ? 1 : 0} onClick={() => handleSportChange('All')}>
        All Sports
        <CountBadge selected={filters.sport === 'All' ? 1 : 0}>{getCount('All')}</CountBadge>
      </SportBtn>

      {/* Per-sport buttons */}
      {availableSports.map(sport => (
        <SportBtn
          key={sport}
          selected={filters.sport === sport ? 1 : 0}
          onClick={() => handleSportChange(sport)}
        >
          {sport}
          <CountBadge selected={filters.sport === sport ? 1 : 0}>{getCount(sport)}</CountBadge>
        </SportBtn>
      ))}
    </Bar>
  );
};

export default SportFilterBar;
