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
import { SearchOff, History, WifiOff } from '@mui/icons-material';

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  height: 'calc(100vh - 128px)', // Header + SportFilterBar height
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

// 🔹 Modern, Polished Empty State
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
  } = useOpportunityStore();

  const [sortField, setSortField] = useState('profit_percentage');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);

  const filteredOpportunities = getFilteredOpportunities();

  const sortedAndPaginatedOpportunities = useMemo(() => {
    const sorted = [...filteredOpportunities].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
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
          Loading Opportunities
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          Please wait while we fetch the latest market data.
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
                  direction={sortDirection}
                  onClick={() => handleSort('profit_percentage')}
                >
                  Profit
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: 350 }}>Bets to Place</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'commence_time'}
                  direction={sortDirection}
                  onClick={() => handleSort('commence_time')}
                >
                  Match Time
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedAndPaginatedOpportunities.map((opportunity) => (
              <OpportunityRow key={opportunity.match_id} opportunity={opportunity} />
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
