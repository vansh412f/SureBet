import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Pagination,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import OpportunityRow from './OpportunityRow';
import { SearchOff, History, WifiOff, ErrorOutline } from '@mui/icons-material';

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  height: 'calc(100vh - 128px)',
  backgroundColor: theme.palette.background.paper,
  '& .MuiTableCell-root': {
    borderColor: theme.palette.divider,
  },
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '& .MuiTableCell-head': {
    fontWeight: 700,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledEmptyCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8, 4),
  textAlign: 'center',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const EmptyIconWrapper = styled(Box)(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.action.hover,
}));

const ROWS_PER_PAGE = 25;

const OpportunityTable = () => {
  const {
    isLoading,
    getFilteredOpportunities,
    connectionError,
    viewMode,
    setViewMode,
    liveStatus,
    apiStatus,
  } = useOpportunityStore();

  const [sortField, setSortField] = useState('profit_percentage');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [stakes, setStakes] = useState({}); // New state for custom stakes

  const filteredOpportunities = getFilteredOpportunities();

  const sortedAndPaginatedOpportunities = useMemo(() => {
    const sorted = [...filteredOpportunities].sort((a, b) => {
      const aValue = sortField === 'last_updated' ? new Date(a[sortField]).getTime() : a[sortField];
      const bValue = sortField === 'last_updated' ? new Date(b[sortField]).getTime() : b[sortField];
      return sortDirection === 'asc'
        ? aValue > bValue ? 1 : -1
        : bValue > aValue ? 1 : -1;
    });

    const startIndex = (page - 1) * ROWS_PER_PAGE;
    return sorted.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredOpportunities, sortField, sortDirection, page]);

  const totalPages = Math.ceil(filteredOpportunities.length / ROWS_PER_PAGE);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleStakeChange = (match_id, newStake) => {
    setStakes((prev) => ({
      ...prev,
      [match_id]: parseFloat(newStake) || 100, // Fallback to 100 if invalid
    }));
  };

  // --- EMPTY STATES ---
  if (connectionError) {
    return (
      <StyledEmptyCard>
        <EmptyIconWrapper>
          <WifiOff sx={{ fontSize: 40, color: 'error.main' }} />
        </EmptyIconWrapper>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }} gutterBottom>
          Backend is Offline
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          Could not connect to the server. Please ensure it’s running and try again.
        </Typography>
      </StyledEmptyCard>
    );
  }

  if (isLoading) {
    return (
      <StyledEmptyCard>
        <CircularProgress size={56} sx={{ mb: 3 }} />
        <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }} gutterBottom>
          {liveStatus.message}
        </Typography>
        {liveStatus.matchesScanned > 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
            Matches scanned: {liveStatus.matchesScanned}
          </Typography>
        )}
      </StyledEmptyCard>
    );
  }

  if (apiStatus === 'limit_reached') {
    return (
      <StyledEmptyCard>
        <EmptyIconWrapper>
          <ErrorOutline sx={{ fontSize: 40, color: 'error.main' }} />
        </EmptyIconWrapper>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }} gutterBottom>
          API Usage Limit Reached
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, mb: 2 }}>
          Do you see that green live button? That means everything is working fine, don’t stress.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          Problem: Api limit reached! Im poor :(
        </Typography>
      </StyledEmptyCard>
    );
  }

  if (filteredOpportunities.length === 0 && viewMode === 'live') {
    return (
      <StyledEmptyCard>
        <EmptyIconWrapper>
          <SearchOff sx={{ fontSize: 40, color: 'primary.main' }} />
        </EmptyIconWrapper>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }} gutterBottom>
          No Live Opportunities
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          Nothing is live right now — but you can review what you missed.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, px: 4, borderRadius: 2, fontWeight: 600 }}
          onClick={() => setViewMode('past')}
        >
          View Past Opportunities
        </Button>
      </StyledEmptyCard>
    );
  }

  if (filteredOpportunities.length === 0) {
    return (
      <StyledEmptyCard>
        <EmptyIconWrapper>
          <History sx={{ fontSize: 40, color: 'warning.main' }} />
        </EmptyIconWrapper>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }} gutterBottom>
          No Results Match
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          Try adjusting your filters to explore more opportunities.
        </Typography>
      </StyledEmptyCard>
    );
  }

  // --- TABLE RENDER ---
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TableContainerStyled component={Paper} elevation={0} square>
        <Table stickyHeader size="small">
          <StyledTableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'profit_percentage'}
                  direction={sortField === 'profit_percentage' ? sortDirection : 'desc'}
                  onClick={() => handleSort('profit_percentage')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      opacity: sortField === 'profit_percentage' ? 1 : 0.3,
                    },
                  }}
                >
                  Profit
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: 350 }}>Bets to Place</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'commence_time'}
                  direction={sortField === 'commence_time' ? sortDirection : 'desc'}
                  onClick={() => handleSort('commence_time')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      opacity: sortField === 'commence_time' ? 1 : 0.3,
                    },
                  }}
                >
                  Match Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'last_updated'}
                  direction={sortField === 'last_updated' ? sortDirection : 'desc'}
                  onClick={() => handleSort('last_updated')}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      opacity: sortField === 'last_updated' ? 1 : 0.3,
                    },
                  }}
                >
                  Fetched At
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedAndPaginatedOpportunities.map((opportunity) => (
              <OpportunityRow
                key={opportunity.match_id}
                opportunity={opportunity}
                customStake={stakes[opportunity.match_id]}
                onStakeChange={handleStakeChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainerStyled>

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default OpportunityTable;