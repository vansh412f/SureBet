import React from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Timer,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

const ProfitCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 700,
  fontSize: '1.1rem',
}));

const BetsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const BetBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const OddsText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const OpportunityRow = ({ opportunity }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Calculate total wager amount for all bets
  const totalWager = opportunity.bets_to_place.reduce((sum, bet) => sum + (bet.wager_amount || 0), 0);

  return (
    <TableRow hover>
      {/* Match Info */}
      <TableCell>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {opportunity.home_team} vs {opportunity.away_team}
          </Typography>
          <Chip
            label={opportunity.sport_title}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ mt: 0.5 }}
          />
        </Box>
      </TableCell>

      {/* Profit */}
      <ProfitCell>
        <Box>
          <Typography variant="h6" component="span" fontWeight={700}>
            {opportunity.profit_percentage?.toFixed(2)}%
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            ${opportunity.total_profit_on_100?.toFixed(2)} / $100
          </Typography>
        </Box>
      </ProfitCell>

      {/* Bets to Place */}
      <TableCell>
        <BetsContainer>
          {opportunity.bets_to_place.map((bet, index) => (
            <BetBox key={index}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {bet.outcome_name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {bet.bookmaker_title}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <OddsText variant="body2">
                  @{bet.outcome_price.toFixed(2)}
                </OddsText>
                <Typography variant="caption" color="textSecondary">
                  Stake ${bet.wager_amount?.toFixed(2)} (Total: ${totalWager.toFixed(2)})
                </Typography>
              </Box>
            </BetBox>
          ))}
        </BetsContainer>
      </TableCell>

      {/* Match Time */}
      <TableCell>
        <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Timer fontSize="inherit" />
          {formatTime(opportunity.commence_time)}
        </Typography>
      </TableCell>

      {/* Fetched At */}
      <TableCell>
        <Typography variant="body2" color="textSecondary">
          {formatRelativeTime(opportunity.last_updated)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default OpportunityRow;