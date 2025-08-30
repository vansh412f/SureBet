import React, { useState } from 'react';
import { TableRow, TableCell, Typography, Box, Chip, Card, CardContent, useTheme, useMediaQuery, Tooltip, Fade,
} from '@mui/material';
import {Timer,TrendingUp,AccountBalance,AttachMoney,SportsSoccer,Schedule,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

// Animations (keeping existing)
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

// Styled Components (keeping existing styles but fixing syntax)
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

const OpportunityRow = ({ opportunity, mobile = false }) => {
  const theme = useTheme();


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
        <BetCard key={`${bet.bookmaker_title}-${bet.outcome_name}-${index}`} className="bet-card">
          <BetCardContent>
            <BetLeft>
              <OutcomeName>{bet.outcome_name || 'Unknown Outcome'}</OutcomeName>
              <BookmakerName>
                <AccountBalance fontSize="small" />
                {bet.bookmaker_title || 'Unknown Bookmaker'}
              </BookmakerName>
            </BetLeft>
            <BetRight>
              <OddsChip label={bet.odds || 'N/A'} size="small" />
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
  if (mobile ) {
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
                <MobileBetCard key={`mobile-${bet.bookmaker_title}-${bet.outcome_name}-${index}`}>
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
                        <OddsChip label={bet.odds || 'N/A'} size="small" />
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
