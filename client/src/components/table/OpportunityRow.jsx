import React from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  useTheme,
  Tooltip,
  Fade,
  Paper,
} from '@mui/material';
import {
  Timer,
  AccountBalance,
  AttachMoney,
  SportsSoccer,
  Schedule,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

// Animations
const profitGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(76, 175, 80, 0.3); }
  50% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.6); }
`;

// --- MISSING STYLED COMPONENTS (NOW ADDED) ---

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}05, ${theme.palette.secondary.main}03)`,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 20px ${theme.palette.primary.main}10`,
    '& .profit-cell': {
      animation: `${profitGlow} 2s ease-in-out infinite`,
    },
    '& .bet-card': {
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 15px ${theme.palette.primary.main}10`,
    },
  },
  '& .MuiTableCell-root': {
    borderColor: `${theme.palette.divider}20`,
    padding: theme.spacing(2),
  },
}));

const MatchInfoCell = styled(TableCell)(({ theme }) => ({
  minWidth: 220,
}));

const MatchTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const MatchSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

const ProfitCell = styled(TableCell)(({ theme }) => ({
  minWidth: 120,
  textAlign: 'right',
}));

const ProfitContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const ProfitPercentage = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.1rem',
  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const ProfitAmount = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '0.8rem',
    marginRight: theme.spacing(0.2),
  },
}));

const BetsCell = styled(TableCell)(({ theme }) => ({
  minWidth: 300,
}));

const BetsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const BetCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  border: `1px solid ${theme.palette.divider}30`,
  borderRadius: 8,
  transition: 'all 0.3s ease',
}));

const BetCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const BetLeft = styled(Box)({});

const OutcomeName = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const BookmakerName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const BetRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const OddsChip = styled(Chip)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}25`,
}));

const StakeChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.primary.main}10)`,
  color: theme.palette.secondary.dark,
  border: `1px solid ${theme.palette.secondary.main}25`,
}));

const TimeCell = styled(TableCell)({});

const TimeDisplay = styled(Box)({});

const TimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const RelativeTimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// Mobile Specific
const MobileContainer = styled(Box)({});
const MobileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));
const MobileMatchInfo = styled(Box)({});
const MobileProfitDisplay = styled(Box)({});
const MobileBetsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));
const MobileBetCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  border: `1px solid ${theme.palette.divider}30`,
}));
const MobileTimeSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

// --- END OF ADDED COMPONENTS ---

const OpportunityRow = ({ opportunity, mobile = false }) => {
  // Safety checks for opportunity data
  if (!opportunity) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'N/A';
    }
  };

  // Safe rendering of bets with null checks
  const renderBets = () => (
    <BetsContainer>
      {(opportunity.bets_to_place || []).map((bet, index) => (
        <BetCard key={`${bet.bookmaker_title}-${bet.outcome_name}-${index}`} className="bet-card" elevation={0}>
          <BetCardContent>
            <BetLeft>
              <OutcomeName>{bet.outcome_name || 'Unknown Outcome'}</OutcomeName>
              <BookmakerName>
                <AccountBalance fontSize="small" />
                {bet.bookmaker_title || 'Unknown Bookmaker'}
              </BookmakerName>
            </BetLeft>
            <BetRight>
              <OddsChip label={bet.outcome_price || 'N/A'} size="small" />
              <StakeChip
                label={`$${(bet.wager_amount || 0).toFixed(2)}`}
                size="small"
              />
            </BetRight>
          </BetCardContent>
        </BetCard>
      ))}
    </BetsContainer>
  );

  // Mobile Layout
  if (mobile) {
    return (
      <MobileContainer>
        <MobileHeader>
          <MobileMatchInfo>
            <MatchTitle>
              <SportsSoccer />
              {opportunity.home_team || 'TBD'} vs {opportunity.away_team || 'TBD'}
            </MatchTitle>
            <MatchSubtitle>{opportunity.sport_title || 'Unknown Sport'}</MatchSubtitle>
          </MobileMatchInfo>
          <MobileProfitDisplay>
            <ProfitContainer>
              <ProfitPercentage>
                {(opportunity.profit_percentage || 0).toFixed(2)}%
              </ProfitPercentage>
              <ProfitAmount>
                <AttachMoney fontSize="small" />
                ${(opportunity.profit_percentage || 0).toFixed(2)}/100
              </ProfitAmount>
            </ProfitContainer>
          </MobileProfitDisplay>
        </MobileHeader>

        <MobileBetsSection>
          {(opportunity.bets_to_place || []).map((bet, index) => (
            <MobileBetCard key={`mobile-${bet.bookmaker_title}-${bet.outcome_name}-${index}`} elevation={0}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <OutcomeName>{bet.outcome_name || 'Unknown'}</OutcomeName>
                    <BookmakerName>
                      <AccountBalance fontSize="small" />
                      {bet.bookmaker_title || 'Unknown'}
                    </BookmakerName>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <OddsChip label={bet.outcome_price || 'N/A'} size="small" />
                    <StakeChip
                      label={`$${(bet.wager_amount || 0).toFixed(2)}`}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </MobileBetCard>
          ))}
        </MobileBetsSection>

        <MobileTimeSection>
          <TimeText>
            <Schedule fontSize="small" />
            {formatTime(opportunity.commence_time)}
          </TimeText>
          <RelativeTimeText>
            <Timer fontSize="small" />
            {formatRelativeTime(opportunity.last_updated)}
          </RelativeTimeText>
        </MobileTimeSection>
      </MobileContainer>
    );
  }

  // Desktop Table Row
  return (
    <StyledTableRow>
      <MatchInfoCell>
        <MatchTitle>
          <SportsSoccer />
          {opportunity.home_team || 'TBD'} vs {opportunity.away_team || 'TBD'}
        </MatchTitle>
        <MatchSubtitle>{opportunity.sport_title || 'Unknown Sport'}</MatchSubtitle>
      </MatchInfoCell>

      <ProfitCell className="profit-cell">
        <ProfitContainer>
          <ProfitPercentage>
            {(opportunity.profit_percentage || 0).toFixed(2)}%
          </ProfitPercentage>
          <ProfitAmount>
            <AttachMoney fontSize="small" />
            ${(opportunity.profit_percentage || 0).toFixed(2)} / $100
          </ProfitAmount>
        </ProfitContainer>
      </ProfitCell>

      <BetsCell>
        {renderBets()}
      </BetsCell>

      <TimeCell>
  <TimeDisplay>
    <TimeText>
      <Schedule fontSize="small" />
      {formatTime(opportunity.commence_time)}
    </TimeText>
  </TimeDisplay>
</TimeCell>
<TimeCell>
  <TimeDisplay>
    <RelativeTimeText>
      <Timer fontSize="small" />
      {formatRelativeTime(opportunity.last_updated)}
    </RelativeTimeText>
  </TimeDisplay>
</TimeCell>

    </StyledTableRow>
  );
};

export default OpportunityRow;

