import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Paper, Typography, Box,
  CircularProgress, Pagination, Button,
  useMediaQuery, useTheme, Card, CardContent,
} from '@mui/material';
import {
  SearchOff, History, WifiOff, ErrorOutline,
  TrendingUp, ShowChart, AccessTime,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import { filterOpportunities } from '../../utils/sportUtils';
import OpportunityRow from './OpportunityRow';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const TableWrap = styled(TableContainer)(({ theme }) => ({
  height: 'calc(100vh - 156px)',
  background: theme.palette.background.default,
  borderRadius: 0,
  overflow: 'auto',
}));

const SortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: 'inherit !important',
  '& .MuiTableSortLabel-icon': { opacity: 0.4 },
  '&.Mui-active': {
    color: `${theme.palette.primary.light} !important`,
    '& .MuiTableSortLabel-icon': { opacity: 1, color: `${theme.palette.primary.light} !important` },
  },
}));

const StatsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(1, 2),
  background: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexWrap: 'wrap',
}));

const StatItem = ({ label, value, color = 'text.primary' }) => (
  <Box>
    <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
      {value}
    </Typography>
  </Box>
);

const Divider = styled(Box)(({ theme }) => ({
  width: 1, height: 28, background: theme.palette.divider, flexShrink: 0,
}));

const EmptyBox = styled(Box)({
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', height: 'calc(100vh - 200px)',
  animation: `${fadeUp} 0.5s ease-out`,
});

const EmptyCard = styled(Card)(({ theme }) => ({
  maxWidth: 420, width: '100%', textAlign: 'center',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 20, padding: theme.spacing(4),
}));

const IconCircle = styled(Box)(({ theme, variant }) => {
  const colors = {
    error:   { bg: `${theme.palette.error.main}15`,   border: `${theme.palette.error.main}30`,   color: theme.palette.error.main },
    warning: { bg: `${theme.palette.warning.main}15`, border: `${theme.palette.warning.main}30`, color: theme.palette.warning.main },
    default: { bg: `${theme.palette.primary.main}15`, border: `${theme.palette.primary.main}30`, color: theme.palette.primary.main },
  };
  const c = colors[variant] || colors.default;
  return {
    width: 72, height: 72, borderRadius: '50%', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: c.bg, border: `2px solid ${c.border}`, color: c.color,
    marginBottom: theme.spacing(2.5),
    '& .MuiSvgIcon-root': { fontSize: '2rem' },
  };
});

const ROWS_PER_PAGE = 20;

const OpportunityTable = () => {
  const theme = useTheme();

  const opportunities  = useOpportunityStore(s => s.opportunities);
  const viewMode       = useOpportunityStore(s => s.viewMode);
  const liveFilters    = useOpportunityStore(s => s.liveFilters);
  const pastFilters    = useOpportunityStore(s => s.pastFilters);
  const isLoading      = useOpportunityStore(s => s.isLoading);
  const connectionError= useOpportunityStore(s => s.connectionError);
  const liveStatus     = useOpportunityStore(s => s.liveStatus);
  const apiStatus      = useOpportunityStore(s => s.apiStatus);
  const setViewMode    = useOpportunityStore(s => s.setViewMode);

  const filters = viewMode === 'live' ? liveFilters : pastFilters;

  const [sortField, setSortField] = useState('profit_percentage');
  const [sortDir, setSortDir]     = useState('desc');
  const [page, setPage]           = useState(1);

  const filtered = useMemo(
    () => filterOpportunities(opportunities, viewMode, filters),
    [opportunities, viewMode, filters]
  );

  const stats = useMemo(() => {
    if (filtered.length === 0) return { best: '—', avg: '—', count: 0 };
    const profits = filtered.map(op => op.profit_percentage || 0);
    const best = Math.max(...profits).toFixed(2);
    const avg  = (profits.reduce((a, b) => a + b, 0) / profits.length).toFixed(2);
    return { best, avg, count: filtered.length };
  }, [filtered]);

  const paged = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const av = sortField === 'last_updated' ? new Date(a[sortField]).getTime() : a[sortField];
      const bv = sortField === 'last_updated' ? new Date(b[sortField]).getTime() : b[sortField];
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (bv > av ? 1 : -1);
    });
    const start = (page - 1) * ROWS_PER_PAGE;
    return sorted.slice(start, start + ROWS_PER_PAGE);
  }, [filtered, sortField, sortDir, page]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const handleSort = field => {
    setSortDir(sortField === field && sortDir === 'asc' ? 'desc' : 'asc');
    setSortField(field);
    setPage(1);
  };

  if (connectionError) return (
    <EmptyBox>
      <EmptyCard elevation={0}>
        <CardContent>
          <IconCircle variant="error"><WifiOff /></IconCircle>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Backend Offline</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Cannot connect to server. Ensure the backend is running on port 5000.
          </Typography>
        </CardContent>
      </EmptyCard>
    </EmptyBox>
  );

  if (apiStatus === 'limit_reached' && viewMode === 'live') return (
    <EmptyBox>
      <EmptyCard elevation={0}>
        <CardContent>
          <IconCircle variant="warning"><ErrorOutline /></IconCircle>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>API Quota Reached</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>
            Daily API credits exhausted. Browse historical opportunities below.
          </Typography>
          <Button variant="outlined" startIcon={<History />} onClick={() => setViewMode('past')}
            sx={{ borderColor: 'rgba(59,130,246,0.4)', color: 'primary.light' }}>
            View History
          </Button>
        </CardContent>
      </EmptyCard>
    </EmptyBox>
  );

  if (isLoading && viewMode === 'live') return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="calc(100vh - 200px)" gap={2}>
      <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{liveStatus.message}</Typography>
      {liveStatus.matchesScanned > 0 && (
        <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>
          {liveStatus.matchesScanned} matches scanned…
        </Typography>
      )}
    </Box>
  );

  if (filtered.length === 0) return (
    <EmptyBox>
      <EmptyCard elevation={0}>
        <CardContent>
          <IconCircle><ShowChart /></IconCircle>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {viewMode === 'live' ? 'No Live Opportunities' : 'No Past Opportunities'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>
            {viewMode === 'live'
              ? 'No arbitrage opportunities match your filters. Try relaxing your criteria.'
              : 'Past opportunities will appear here after the first scan.'}
          </Typography>
          {viewMode === 'live' && (
            <Button variant="outlined" startIcon={<History />} onClick={() => setViewMode('past')}
              sx={{ borderColor: 'rgba(59,130,246,0.4)', color: 'primary.light' }}>
              View History
            </Button>
          )}
        </CardContent>
      </EmptyCard>
    </EmptyBox>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatsBar>
        <StatItem label="Opportunities" value={stats.count} />
        <Divider />
        <StatItem label="Best Profit" value={stats.best === '—' ? '—' : `+${stats.best}%`} color="secondary.light" />
        <Divider />
        <StatItem label="Avg Profit" value={stats.avg === '—' ? '—' : `+${stats.avg}%`} color="primary.light" />
        <Box flex={1} />
        <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>
          {ROWS_PER_PAGE} rows / page
        </Typography>
      </StatsBar>

      <TableWrap component={Paper} elevation={0}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center" gap={0.6}>
                  <TrendingUp sx={{ fontSize: 13 }} /> Match
                </Box>
              </TableCell>
              <TableCell>
                <SortLabel active={sortField === 'profit_percentage'} direction={sortField === 'profit_percentage' ? sortDir : 'asc'} onClick={() => handleSort('profit_percentage')}>
                  <Box display="flex" alignItems="center" gap={0.6}><ShowChart sx={{ fontSize: 13 }} /> Profit</Box>
                </SortLabel>
              </TableCell>
              <TableCell>Bets to Place</TableCell>
              <TableCell>
                <SortLabel active={sortField === 'commence_time'} direction={sortField === 'commence_time' ? sortDir : 'asc'} onClick={() => handleSort('commence_time')}>
                  <Box display="flex" alignItems="center" gap={0.6}><AccessTime sx={{ fontSize: 13 }} /> Match Time</Box>
                </SortLabel>
              </TableCell>
              <TableCell>
                <SortLabel active={sortField === 'last_updated'} direction={sortField === 'last_updated' ? sortDir : 'asc'} onClick={() => handleSort('last_updated')}>
                  Updated
                </SortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map(op => (
              <OpportunityRow key={op._id} opportunity={op} />
            ))}
          </TableBody>
        </Table>
      </TableWrap>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" alignItems="center" py={1.5}
          sx={{ borderTop: `1px solid ${theme.palette.divider}`, background: theme.palette.background.paper }}>
          <Pagination
            count={totalPages} page={page} onChange={(_, p) => setPage(p)}
            color="primary" size="small" showFirstButton showLastButton
            sx={{
              '& .MuiPaginationItem-root': { borderRadius: 2, fontSize: '0.8rem' },
              '& .Mui-selected': { background: 'rgba(59,130,246,0.25) !important', fontWeight: 700 },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default OpportunityTable;
