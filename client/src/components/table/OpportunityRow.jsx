import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Timer,
  TrendingUp,
  AccountBalance,
  AttachMoney,
  SportsSoccer,
  Schedule,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

// Animations
const slideInFromLeft = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const profitGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(76, 175, 80, 0.3); }
  50% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
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
  minWidth: 200,
}));

const MatchTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const MatchSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

const ProfitCell = styled(TableCell)(({ theme }) => ({
  minWidth: 120,
  textAlign: 'center',
}));

const ProfitContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.light}10)`,
  borderRadius: 12,
  border: `2px solid ${theme.palette.success.main}30`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-200px',
    width: '200px',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.success.main}20, transparent)`,
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const ProfitPercentage = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
}));

const ProfitAmount = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.palette.success.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const BetsCell = styled(TableCell)(({ theme }) => ({
  minWidth: 300,
  maxWidth: 400,
}));

const BetsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  animation: `${slideInFromLeft} 0.6s ease-out`,
}));

const BetCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}30`,
  borderRadius: 12,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
}));

const BetCardContent = styled(CardContent)(({ theme }) => ({
  padding: `${theme.spacing(1.5)} !important`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const BetLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  flex: 1,
}));

const BetRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(0.5),
}));

const OutcomeName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.9rem',
  color: theme.palette.text.primary,
}));

const BookmakerName = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const OddsChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.8rem',
  height: 28,
  borderRadius: 8,
}));

const StakeChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  borderRadius: 6,
}));

const TimeCell = styled(TableCell)(({ theme }) => ({
  minWidth: 140,
}));

const TimeDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const TimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const RelativeTimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// Mobile Layout Components
const MobileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const MobileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const MobileMatchInfo = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const MobileProfitDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'right',
}));

const MobileBetsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const MobileBetCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  border: `1px solid ${theme.palette.divider}30`,
  borderRadius: 12,
}));

const MobileTimeSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  background: `${theme.palette.background.default}50`,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}20`,
}));

const OpportunityRow = ({ opportunity, mobile = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isHovered, setIsHovered] = useState(false);

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

  const renderBets = () => (
    <BetsContainer>
      {opportunity.bets_to_place.map((bet, index) => (
        <BetCard 
          key={index} 
          elevation={0}
          className="bet-card"
        >
          <BetCardContent>
            <BetLeft>
              <OutcomeName>{bet.outcome_name}</OutcomeName>
              <BookmakerName>
                <AccountBalance fontSize="small" />
                {bet.bookmaker_title}
              </BookmakerName>
            </BetLeft>
            <BetRight>
              <Tooltip title={`Odds: ${bet.outcome_price.toFixed(2)}`} arrow>
                <OddsChip 
                  label={`@${bet.outcome_price.toFixed(2)}`}
                  size="small"
                />
              </Tooltip>
              <Tooltip title={`Stake Amount: $${bet.wager_amount?.toFixed(2)}`} arrow>
                <StakeChip 
                  icon={<AttachMoney style={{ fontSize: '0.9rem' }} />}
                  label={`$${bet.wager_amount?.toFixed(2)}`}
                  size="small"
                />
              </Tooltip>
            </BetRight>
          </BetCardContent>
        </BetCard>
      ))}
    </BetsContainer>
  );

  // Mobile Layout
  if (mobile || isMobile) {
    return (
      <MobileContainer>
        <MobileHeader>
          <MobileMatchInfo>
            <MatchTitle>
              <SportsSoccer fontSize="small" />
              {opportunity.home_team} vs {opportunity.away_team}
            </MatchTitle>
            <MatchSubtitle>{opportunity.sport_title}</MatchSubtitle>
          </MobileMatchInfo>
          <MobileProfitDisplay>
            <ProfitContainer>
              <ProfitPercentage>
                {opportunity.profit_percentage?.toFixed(2)}%
              </ProfitPercentage>
              <ProfitAmount>
                <AttachMoney fontSize="small" />
                ${opportunity.profit_percentage?.toFixed(2)}/100
              </ProfitAmount>
            </ProfitContainer>
          </MobileProfitDisplay>
        </MobileHeader>

        <MobileBetsSection>
          {opportunity.bets_to_place.map((bet, index) => (
            <MobileBetCard key={index} elevation={0}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <OutcomeName>{bet.outcome_name}</OutcomeName>
                  <OddsChip 
                    label={`@${bet.outcome_price.toFixed(2)}`}
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <BookmakerName>
                    <AccountBalance fontSize="small" />
                    {bet.bookmaker_title}
                  </BookmakerName>
                  <StakeChip 
                    icon={<AttachMoney style={{ fontSize: '0.9rem' }} />}
                    label={`$${bet.wager_amount?.toFixed(2)}`}
                    size="small"
                  />
                </Box>
              </CardContent>
            </MobileBetCard>
          ))}
        </MobileBetsSection>

        <MobileTimeSection>
          <Box>
            <TimeText>
              <Schedule fontSize="small" />
              {formatTime(opportunity.commence_time)}
            </TimeText>
          </Box>
          <Box textAlign="right">
            <RelativeTimeText>
              <Timer fontSize="small" />
              {formatRelativeTime(opportunity.last_updated)}
            </RelativeTimeText>
          </Box>
        </MobileTimeSection>
      </MobileContainer>
    );
  }

  // Desktop Table Row
  return (
    <Fade in timeout={600}>
      <StyledTableRow
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MatchInfoCell>
          <MatchTitle>
            <SportsSoccer fontSize="small" />
            {opportunity.home_team} vs {opportunity.away_team}
          </MatchTitle>
          <MatchSubtitle>{opportunity.sport_title}</MatchSubtitle>
        </MatchInfoCell>

        <ProfitCell className="profit-cell">
          <ProfitContainer>
            <ProfitPercentage>
              {opportunity.profit_percentage?.toFixed(2)}%
            </ProfitPercentage>
            <ProfitAmount>
              <TrendingUp fontSize="small" />
              ${opportunity.profit_percentage?.toFixed(2)} / $100
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
    </Fade>
  );
};

export default OpportunityRow;
