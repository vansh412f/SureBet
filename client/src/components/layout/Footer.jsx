import React from 'react';
import {
  Box, Typography, Grid, Link, Divider, Chip, IconButton,
} from '@mui/material';
import {
  TrendingUp, GitHub, LinkedIn, Language,
  AutoAwesome, Speed, Security, WifiTethering,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const FooterRoot = styled(Box)(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, #050510 100%)`,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(6, 4, 3),
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(4, 2, 2) },
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const ShimmerText = styled(Typography)({
  background: 'linear-gradient(90deg, #94A3B8 0%, #F1F5F9 40%, #94A3B8 80%)',
  backgroundSize: '400px 100%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s ease-in-out infinite`,
});

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  background: `linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(16,185,129,0.04) 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 14,
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    borderColor: 'rgba(59,130,246,0.3)',
    background: 'rgba(59,130,246,0.08)',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 30px rgba(59,130,246,0.12)',
  },
}));

const SocialBtn = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 10,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  transition: 'all 0.25s ease',
  '&:hover': {
    color: theme.palette.primary.light,
    borderColor: 'rgba(59,130,246,0.5)',
    background: 'rgba(59,130,246,0.12)',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(59,130,246,0.2)',
  },
  '& .MuiSvgIcon-root': { fontSize: 20 },
}));

const TechChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: '0.7rem',
  fontWeight: 600,
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  cursor: 'default',
  '&:hover': {
    background: 'rgba(59,130,246,0.1)',
    borderColor: 'rgba(59,130,246,0.3)',
    color: theme.palette.primary.light,
  },
}));

const SectionLabel = styled(Typography)({
  fontWeight: 700,
  fontSize: '0.72rem',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  textAlign: 'center',
  marginBottom: '20px',
});

const FEATURES = [
  {
    icon: <WifiTethering sx={{ fontSize: 22, color: '#3B82F6' }} />,
    title: 'Real-Time Updates',
    desc: 'WebSocket streaming pushes new opportunities to your screen the moment they are detected.',
  },
  {
    icon: <Speed sx={{ fontSize: 22, color: '#10B981' }} />,
    title: 'Resilient Engine',
    desc: 'Multi-key API rotation keeps the scanner running without interruption.',
  },
  {
    icon: <Security sx={{ fontSize: 22, color: '#F59E0B' }} />,
    title: 'Data Integrity',
    desc: 'Profit outliers above 60% are discarded at source — never stored in the database or shown in the UI.',
  },
  {
    icon: <AutoAwesome sx={{ fontSize: 22, color: '#A78BFA' }} />,
    title: 'One-Click Tools',
    desc: 'Stake calculator, bookmaker deep-links, and copy-to-clipboard built into every opportunity row.',
  },
];

const TECH_STACK = ['Node.js', 'Express', 'Socket.IO', 'MongoDB', 'React', 'Vite', 'MUI v5', 'Zustand'];

const Footer = () => (
  <FooterRoot id="app-footer">
    <Grid container spacing={6} mb={5}>
      <Grid item xs={12} md={4}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TrendingUp sx={{ fontSize: 22, color: 'primary.main' }} />
          <GradientTitle variant="h6">SureBet</GradientTitle>
        </Box>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.75, mb: 2.5 }}>
          A professional-grade sports arbitrage finder built to scan odds across multiple bookmakers
          in real time, calculate guaranteed profit margins, and surface actionable opportunities —
          completely free.
        </Typography>
        <ShimmerText sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 2.5 }}>
          ⚡ Live Demo: sure-bet-hazel.vercel.app
        </ShimmerText>
        <Box display="flex" flexWrap="wrap" gap={0.8}>
          {TECH_STACK.map(t => <TechChip key={t} label={t} size="small" />)}
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <SectionLabel>Core Features</SectionLabel>
        <Grid container spacing={2}>
          {FEATURES.map(f => (
            <Grid item xs={12} sm={6} key={f.title}>
              <FeatureCard>
                <Box display="flex" alignItems="center" gap={1.2} mb={1.2}>
                  {f.icon}
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
                    {f.title}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.65 }}>
                  {f.desc}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
    <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 3 }} />
    <Box display="flex" justifyContent="center" gap={1.5} mb={2.5}>
      <SocialBtn component="a" href="https://github.com/vansh412f" target="_blank" rel="noopener noreferrer" title="GitHub">
        <GitHub />
      </SocialBtn>
      <SocialBtn component="a" href="https://linkedin.com/in/vansh-singh-profile" target="_blank" rel="noopener noreferrer" title="LinkedIn">
        <LinkedIn />
      </SocialBtn>
      <SocialBtn component="a" href="https://sure-bet-hazel.vercel.app/" target="_blank" rel="noopener noreferrer" title="Live Demo">
        <Language />
      </SocialBtn>
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.6} textAlign="center">
      <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled' }}>
        © {new Date().getFullYear()} Vansh Singh · Built for educational purposes
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: '#334155' }}>
        Data from{' '}
        <Link
          href="https://the-odds-api.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'primary.light', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          The Odds API
        </Link>
        {' '}· For entertainment only · Gamble responsibly
      </Typography>
    </Box>
  </FooterRoot>
);

export default Footer;