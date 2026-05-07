import React, { useState } from 'react';
import {
  TableRow, TableCell, Typography, Box, Chip,
  Tooltip, IconButton, TextField, InputAdornment,
} from '@mui/material';
import {
  ContentCopy, Check, AccountBalance, Schedule, AccessTime,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { formatDistanceToNow, format } from 'date-fns';
import { getSportCat, formatOdd, scaleWager, getBookmakerUrl } from '../../utils/sportUtils';

// ─── Animations ──────────────────────────────────────────────────────────────
const flashIn = keyframes`
  0%   { background: rgba(16,185,129,0.18); }
  100% { background: transparent; }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────
const StyledRow = styled(TableRow)(({ theme, isnew }) => ({
  animation: isnew ? `${flashIn} 2s ease-out forwards` : 'none',
  cursor: 'default',
  verticalAlign: 'top',
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '14px 16px',
  },
}));

const BookmakerBadge = styled(Box)(({ theme, haslink }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: 'rgba(59,130,246,0.09)',
  border: '1px solid rgba(59,130,246,0.2)',
  borderRadius: 5,
  padding: '2px 7px',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: theme.palette.primary.light,
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  cursor: haslink ? 'pointer' : 'default',
  transition: 'all 0.2s ease',
  ...(haslink && {
    '&:hover': {
      background: 'rgba(59,130,246,0.2)',
      borderColor: 'rgba(59,130,246,0.5)',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(59,130,246,0.2)',
    },
  }),
}));

const OddsBadge = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.06)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 5,
  padding: '2px 8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}));

const StakeBadge = styled(Box)(({ theme }) => ({
  background: 'rgba(16,185,129,0.1)',
  border: '1px solid rgba(16,185,129,0.2)',
  borderRadius: 5,
  padding: '2px 8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: theme.palette.secondary.light,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}));

const StakeInput = styled(TextField)(({ theme }) => ({
  width: 100,
  '& .MuiOutlinedInput-root': {
    fontSize: '0.8rem',
    height: 28,
    borderRadius: 6,
    '& fieldset': { borderColor: 'rgba(59,130,246,0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.6)' },
    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
    '& input': { padding: '4px 8px', fontVariantNumeric: 'tabular-nums' },
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
/**
 * Returns match date string + a 3-state status object.
 * Status values:
 *   'upcoming'    → match hasn't started
 *   'inprogress'  → started but < 3 hours ago (likely still live)
 *   'ended'       → started more than 3 hours ago (almost certainly finished)
 */
const MATCH_DURATION_MS = 3 * 60 * 60 * 1000; // 3-hour window covers most sports

const formatMatchTime = (ts) => {
  if (!ts) return { date: 'TBD', label: '—', status: 'upcoming' };
  const d = new Date(ts);
  const now = Date.now();
  const diffMs = now - d.getTime(); // positive = past

  let status, label;
  if (diffMs < 0) {
    // Future
    status = 'upcoming';
    label = `in ${formatDistanceToNow(d)}`;
  } else if (diffMs < MATCH_DURATION_MS) {
    // Started but likely still running
    status = 'inprogress';
    label = '⚡ In Progress';
  } else {
    // Over
    status = 'ended';
    label = '✓ Ended';
  }

  return { date: format(d, 'dd MMM, HH:mm'), label, status };
};

const formatUpdated = (ts) => {
  if (!ts) return '—';
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); }
  catch { return '—'; }
};

// ─── CopyButton ───────────────────────────────────────────────────────────────
const CopyButton = ({ opportunity, stake }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const lines = [
      `${opportunity.home_team} vs ${opportunity.away_team}`,
      `${opportunity.sport_title} | Profit: +${opportunity.profit_percentage?.toFixed(2)}%`,
      `Guaranteed return on $${stake}: $${(stake * (1 + opportunity.profit_percentage / 100)).toFixed(2)}`,
      '',
      ...opportunity.bets_to_place.map(b =>
        `[${b.bookmaker_title?.toUpperCase()}] ${b.outcome_name} @ ${formatOdd(b.outcome_price)} → Stake $${scaleWager(b.wager_amount, stake)}`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy bet instructions'} placement="top">
      <IconButton size="small" onClick={handleCopy}
        sx={{
          color: copied ? 'secondary.main' : 'text.disabled',
          '&:hover': { color: 'primary.light' },
          transition: 'color 0.2s',
        }}>
        {copied ? <Check sx={{ fontSize: 15 }} /> : <ContentCopy sx={{ fontSize: 15 }} />}
      </IconButton>
    </Tooltip>
  );
};

// ─── Main Row ─────────────────────────────────────────────────────────────────
const OpportunityRow = ({ opportunity, isNew = false }) => {
  const [stake, setStake] = useState(100);

  if (!opportunity) return null;

  const profitPct = opportunity.profit_percentage || 0;
  const scaledProfit = ((stake * profitPct) / 100).toFixed(2);
  const { date: matchDate, label: matchLabel, status: matchStatus } = formatMatchTime(opportunity.commence_time);
  const sportCat = getSportCat(opportunity);
  const isEnded = matchStatus === 'ended';

  const profitColor =
    profitPct >= 3 ? '#34D399' :
    profitPct >= 2 ? '#10B981' :
    profitPct >= 1 ? '#6EE7B7' : '#94A3B8';

  const statusColor =
    matchStatus === 'ended'      ? '#475569' :
    matchStatus === 'inprogress' ? '#F59E0B' :
    'text.disabled';

  return (
    <StyledRow isnew={isNew ? 1 : 0} sx={{ opacity: isEnded ? 0.5 : 1, transition: 'opacity 0.3s' }}>

      {/* ── Match ───────────────────────────────────────────────────────── */}
      <TableCell sx={{ minWidth: 190 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary', lineHeight: 1.3, mb: 0.5 }}>
          {opportunity.home_team} <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400, mx: 0.3 }}>vs</Box> {opportunity.away_team}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.6} flexWrap="wrap">
          <Chip label={sportCat} size="small" sx={{
            height: 18, fontSize: '0.62rem', fontWeight: 700,
            background: 'rgba(59,130,246,0.12)', color: 'primary.light',
            border: '1px solid rgba(59,130,246,0.25)',
          }} />
          <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>
            {opportunity.sport_title?.includes(' - ')
              ? opportunity.sport_title.split(' - ')[1]
              : opportunity.sport_title}
          </Typography>
        </Box>
      </TableCell>

      {/* ── Profit ──────────────────────────────────────────────────────── */}
      <TableCell sx={{ minWidth: 110, textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: profitColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          +{profitPct.toFixed(2)}%
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', mt: 0.4, fontVariantNumeric: 'tabular-nums' }}>
          ${scaledProfit} / ${stake}
        </Typography>
      </TableCell>

      {/* ── Bets ────────────────────────────────────────────────────────── */}
      <TableCell sx={{ minWidth: 280 }}>
        <Box display="flex" flexDirection="column" gap={0.8}>
          {opportunity.bets_to_place?.map((bet, i) => {
            const url = getBookmakerUrl(bet.bookmaker_key);
            return (
              <Box key={i} display="flex" alignItems="center" gap={0.8} flexWrap="wrap">
                <Tooltip title={url ? `Open ${bet.bookmaker_title} →` : bet.bookmaker_title} placement="top">
                  <BookmakerBadge
                    component={url ? 'a' : 'span'}
                    href={url || undefined}
                    target={url ? '_blank' : undefined}
                    rel={url ? 'noopener noreferrer' : undefined}
                    haslink={url ? 1 : 0}
                  >
                    <AccountBalance sx={{ fontSize: 10 }} />
                    {bet.bookmaker_title}
                  </BookmakerBadge>
                </Tooltip>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 60 }}>
                  {bet.outcome_name}
                </Typography>
                <OddsBadge>{formatOdd(bet.outcome_price)}</OddsBadge>
                <StakeBadge>${scaleWager(bet.wager_amount, stake)}</StakeBadge>
              </Box>
            );
          })}

          {/* Stake calculator */}
          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', whiteSpace: 'nowrap' }}>Stake</Typography>
            <StakeInput
              type="number"
              value={stake}
              onChange={e => setStake(Math.max(1, Number(e.target.value)))}
              InputProps={{ startAdornment: <InputAdornment position="start" sx={{ '& .MuiTypography-root': { fontSize: '0.75rem', color: 'text.disabled' } }}>$</InputAdornment> }}
              inputProps={{ min: 1 }}
            />
            <CopyButton opportunity={opportunity} stake={stake} />
          </Box>
        </Box>
      </TableCell>

      {/* ── Match Time ──────────────────────────────────────────────────── */}
      <TableCell sx={{ minWidth: 130 }}>
        <Box display="flex" alignItems="center" gap={0.6} mb={0.3}>
          <Schedule sx={{ fontSize: 13, color: 'text.disabled' }} />
          <Typography sx={{ fontSize: '0.82rem', color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
            {matchDate}
          </Typography>
        </Box>
        <Typography sx={{
          fontSize: '0.72rem',
          color: statusColor,
          fontWeight: matchStatus !== 'upcoming' ? 700 : 400,
        }}>
          {matchLabel}
        </Typography>
      </TableCell>

      {/* ── Updated ─────────────────────────────────────────────────────── */}
      <TableCell sx={{ minWidth: 100 }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
          <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled' }}>
            {formatUpdated(opportunity.last_updated)}
          </Typography>
        </Box>
      </TableCell>
    </StyledRow>
  );
};

export default OpportunityRow;
