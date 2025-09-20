import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Typography, Box, CircularProgress, Pagination, Button, useMediaQuery, useTheme, Skeleton, Card, CardContent,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useOpportunityStore } from '../../store/opportunityStore';
import OpportunityRow from './OpportunityRow';
import { 
  SearchOff, 
  History, 
  WifiOff, 
  ErrorOutline, 
  TrendingUp,
  AccessTime,
  ShowChart 
} from '@mui/icons-material';

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}30`,
  overflow: 'auto',
  '& .MuiTableCell-root': {
    borderColor: `${theme.palette.divider}20`,
  },
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    borderRadius: 4,
    '&:hover': {
      background: theme.palette.primary.light,
    },
  },
  '&::-webkit-scrollbar-corner': {
    background: 'transparent',
  },
}));


const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  backdropFilter: 'blur(20px)',
  '& .MuiTableCell-head': {
    fontWeight: 700,
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.default}95)`,
    backdropFilter: 'blur(20px)',
    borderBottom: `2px solid ${theme.palette.primary.main}20`,
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: 'inherit !important',
  '&:hover': {
    color: `${theme.palette.primary.main} !important`,
  },
  '&.Mui-active': {
    color: `${theme.palette.primary.main} !important`,
    '& .MuiTableSortLabel-icon': {
      color: `${theme.palette.primary.main} !important`,
      opacity: 1,
    },
  },
  '& .MuiTableSortLabel-icon': {
    transition: 'all 0.3s ease',
    opacity: 0.5,
  },
}));


const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 200px)',
  padding: theme.spacing(4),
  textAlign: 'center',
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  width: '100%',
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.divider}30`,
  borderRadius: 24,
  padding: theme.spacing(4),
}));

const EmptyIconWrapper = styled(Box)(({ theme, variant }) => {
  const getColors = () => {
    switch (variant) {
      case 'error':
        return {
          bg: `${theme.palette.error.main}15`,
          border: `${theme.palette.error.main}30`,
          color: theme.palette.error.main,
        };
      case 'warning':
        return {
          bg: `${theme.palette.warning.main}15`,
          border: `${theme.palette.warning.main}30`,
          color: theme.palette.warning.main,
        };
      default:
        return {
          bg: `${theme.palette.primary.main}15`,
          border: `${theme.palette.primary.main}30`,
          color: theme.palette.primary.main,
        };
    }
  };

  const colors = getColors();

  return {
    width: 80,
    height: 80,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    color: colors.color,
    '& .MuiSvgIcon-root': {
      fontSize: '2.5rem',
    },
  };
});

const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1),
  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const EmptyStateDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: '#fff',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: 12,
  textTransform: 'none',
  boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 30px ${theme.palette.primary.main}40`,
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 200px)',
  gap: theme.spacing(3),
}));

const LoadingContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.background.paper}50, ${theme.palette.background.default}50)`,
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}30`,
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  fontSize: '1.1rem',
  fontWeight: 500,
}));

const LoadingSubtext = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '0.9rem',
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.default}95)`,
  backdropFilter: 'blur(20px)',
  borderTop: `1px solid ${theme.palette.divider}30`,
  '& .MuiPaginationItem-root': {
    borderRadius: 8,
    margin: theme.spacing(0, 0.5),
    transition: 'all 0.3s ease',
    '&:hover': {
      background: `${theme.palette.primary.main}10`,
      transform: 'translateY(-1px)',
    },
    '&.Mui-selected': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
      color: '#fff',
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
      },
    },
  },
}));

// Mobile Card Layout
const MobileOpportunityCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.divider}30`,
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${theme.palette.primary.main}15`,
  },
}));

const SkeletonRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    border: 'none',
    padding: theme.spacing(2),
  },
}));

const ROWS_PER_PAGE = 25;

const OpportunityTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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

 const renderSkeleton = () => {
  if (isMobile) {
    return (
      <Box p={2}>
        {[...Array(5)].map((_, index) => (
          <MobileOpportunityCard key={`mobile-skeleton-${index}`} elevation={0}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                  <Skeleton variant="text" width={150} height={24} />
                  <Skeleton variant="text" width={100} height={18} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={50} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={70} />
            </CardContent>
          </MobileOpportunityCard>
        ))}
      </Box>
    );
  }

  return (
    <TableContainerStyled>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>Match</TableCell>
            <TableCell>Profit</TableCell>
            <TableCell>Bets to Place</TableCell>
            <TableCell>Match Time</TableCell>
            <TableCell>Fetched At</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {[...Array(8)].map((_, index) => (
            <SkeletonRow key={`skeleton-${index}`}>
              <TableCell><Skeleton variant="text" width={200} /></TableCell>
              <TableCell><Skeleton variant="text" width={80} /></TableCell>
              <TableCell><Skeleton variant="rectangular" width={150} height={60} /></TableCell>
              <TableCell><Skeleton variant="text" width={120} /></TableCell>
              <TableCell><Skeleton variant="text" width={120} /></TableCell>
            </SkeletonRow>
          ))}
        </TableBody>
      </Table>
    </TableContainerStyled>
  );
};


  // Empty States
  if (connectionError) {
    return (
      <EmptyStateContainer>
        <EmptyStateCard elevation={0}>
          <CardContent>
            <EmptyIconWrapper variant="error">
              <WifiOff />
            </EmptyIconWrapper>
            <EmptyStateTitle>Backend is Offline</EmptyStateTitle>
            <EmptyStateDescription>
              Could not connect to the server. Please ensure it's running and try refreshing the page.
            </EmptyStateDescription>
          </CardContent>
        </EmptyStateCard>
      </EmptyStateContainer>
    );
  }

  if (apiStatus === 'limit_reached' && viewMode === 'live') {
    return (
      <EmptyStateContainer>
        <EmptyStateCard elevation={0}>
          <CardContent>
            <EmptyIconWrapper variant="warning">
              <ErrorOutline />
            </EmptyIconWrapper>
            <EmptyStateTitle>API Usage Limit Reached</EmptyStateTitle>
            <EmptyStateDescription>
              The daily API quota has been exceeded. The system is still operational and you can review historical data.
            </EmptyStateDescription>
            <ActionButton 
              startIcon={<History />}
              onClick={() => setViewMode('past')}
            >
              View Past Opportunities
            </ActionButton>
          </CardContent>
        </EmptyStateCard>
      </EmptyStateContainer>
    );
  }

  if (isLoading && viewMode === 'live') {
    return (
      <LoadingContainer>
        <CircularProgress 
          size={48} 
          thickness={4}
          sx={{ 
            color: (theme) => theme.palette.primary.main,
            animation: `${pulse} 2s ease-in-out infinite`,
          }} 
        />
        <LoadingContent>
          <LoadingText>{liveStatus.message}</LoadingText>
          {liveStatus.matchesScanned > 0 && (
            <LoadingSubtext>
              Matches scanned: {liveStatus.matchesScanned}
            </LoadingSubtext>
          )}
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (filteredOpportunities.length === 0) {
    if (viewMode === 'live') {
      return (
        <EmptyStateContainer>
          <EmptyStateCard elevation={0}>
            <CardContent>
              <EmptyIconWrapper>
                <SearchOff />
              </EmptyIconWrapper>
              <EmptyStateTitle>No Live Opportunities</EmptyStateTitle>
              <EmptyStateDescription>
                No arbitrage opportunities are currently available with your selected filters. 
                Try adjusting your criteria or check back later.
              </EmptyStateDescription>
              <ActionButton 
                startIcon={<History />}
                onClick={() => setViewMode('past')}
              >
                View Past Opportunities
              </ActionButton>
            </CardContent>
          </EmptyStateCard>
        </EmptyStateContainer>
      );
    } else {
      return (
        <EmptyStateContainer>
          <EmptyStateCard elevation={0}>
            <CardContent>
              <EmptyIconWrapper>
                <ShowChart />
              </EmptyIconWrapper>
              <EmptyStateTitle>No Past Opportunities</EmptyStateTitle>
              <EmptyStateDescription>
                Historical opportunities will appear here once the system starts collecting data.
              </EmptyStateDescription>
            </CardContent>
          </EmptyStateCard>
        </EmptyStateContainer>
      );
    }
  }

  // Mobile Card Layout
  if (isMobile) {
    return (
      <Box p={2}>
        {sortedAndPaginatedOpportunities.map((opportunity) => (
          <MobileOpportunityCard key={opportunity._id} elevation={0}>
            <CardContent>
              <OpportunityRow opportunity={opportunity} mobile />
            </CardContent>
          </MobileOpportunityCard>
        ))}
        {totalPages > 1 && (
          <Box mt={3} display="flex" justifyContent="center">
            <StyledPagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    );
  }

  // Desktop Table Layout
  return (
    <Box>
      <TableContainerStyled component={Paper} elevation={0}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp fontSize="small" />
                  Match
                </Box>
              </TableCell>
              <TableCell>
                <StyledTableSortLabel
                  active={sortField === 'profit_percentage'}
                  direction={sortField === 'profit_percentage' ? sortDirection : 'asc'}
                  onClick={() => handleSort('profit_percentage')}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShowChart fontSize="small" />
                    Profit
                  </Box>
                </StyledTableSortLabel>
              </TableCell>
              <TableCell>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="inherit" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
            Bets to Place
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ 
                py: 0.5, 
                px: 1.5, 
                backgroundColor: 'background.default', 
                borderRadius: 1, 
                border: 1, 
                borderColor: 'divider' 
            }}>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    ODDS
                </Typography>
            </Box>
            <Box sx={{ 
                py: 0.5, 
                px: 1.5, 
                backgroundColor: 'background.default', 
                borderRadius: 1, 
                border: 1, 
                borderColor: 'divider' 
            }}>
                <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                    STAKE
                </Typography>
            </Box>
        </Box>
    </Box>
</TableCell>
              <TableCell>
                <StyledTableSortLabel
                  active={sortField === 'commence_time'}
                  direction={sortField === 'commence_time' ? sortDirection : 'asc'}
                  onClick={() => handleSort('commence_time')}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime fontSize="small" />
                    Match Time
                  </Box>
                </StyledTableSortLabel>
              </TableCell>
              <TableCell>
                <StyledTableSortLabel
                  active={sortField === 'last_updated'}
                  direction={sortField === 'last_updated' ? sortDirection : 'asc'}
                  onClick={() => handleSort('last_updated')}
                >
                  Fetched At
                </StyledTableSortLabel>
              </TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedAndPaginatedOpportunities.map((opportunity) => (
              <OpportunityRow key={opportunity._id} opportunity={opportunity} />
            ))}
          </TableBody>
        </Table>
      </TableContainerStyled>
      
      {totalPages > 1 && (
        <StyledPagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      )}
    </Box>
  );
};

export default OpportunityTable;
