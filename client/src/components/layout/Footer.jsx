import React from 'react';
import { Box, Grid, Typography, IconButton, Divider } from '@mui/material';
import { GitHub, LinkedIn, Language } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default, // midnight
  color: '#F1F1F1', // offWhite
  padding: theme.spacing(6, 4),
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: '#F1F1F1', // offWhite
}));

const Footer = () => {
  return (
    <FooterContainer id="app-footer">
      <Grid container spacing={6}>
        
        {/* Section 1: About SureBet */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#F1F1F1', // pure white/offWhite
              letterSpacing: '0.5px',
            }}
          >
            SureBet
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: '#888888', lineHeight: 1.6 }} // mutedGrey
          >
            SureBet is an automated tracking tool designed to find and display real-time sports 
            arbitrage opportunities. It scans multiple bookmakers and markets to identify 
            risk-free profit opportunities for educational and demonstrative purposes.
          </Typography>
        </Grid>

        {/* Section 2: Key Features */}
        <Grid item xs={12} md={4}>
          <SectionTitle variant="h6">Key Features</SectionTitle>
          <Typography variant="body2" sx={{ mb: 1, color: '#888888' }}>• Real-time WebSocket Updates</Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#888888' }}>• Dynamic Multi-League Scanning</Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#888888' }}>• 7-Day Upcoming Match Window</Typography>
          <Typography variant="body2" sx={{ color: '#888888' }}>• Live & Historical Opportunity Views</Typography>
        </Grid>

        {/* Section 3: Connect */}
        <Grid item xs={12} md={4}>
          <SectionTitle variant="h6">Connect</SectionTitle>
          <Typography variant="body2" sx={{ mb: 2, color: '#888888' }}>
            Created by <strong style={{ color: '#F1F1F1' }}>Vansh</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href="https://github.com/vansh412f"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#F1F1F1',
                transition: 'all 0.3s ease',
                '&:hover': { color: '#007BFF', transform: 'scale(1.1)' }, // electricBlue hover
              }}
            >
              <GitHub />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com/in/vansh-singh-profile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#F1F1F1',
                transition: 'all 0.3s ease',
                '&:hover': { color: '#007BFF', transform: 'scale(1.1)' },
              }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              component="a"
              href="https://sure-bet-hazel.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#F1F1F1',
                transition: 'all 0.3s ease',
                '&:hover': { color: '#007BFF', transform: 'scale(1.1)' },
              }}
            >
              <Language />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Divider + Copyright */}
      <Divider sx={{ my: 4, borderColor: '#333333' }} />
      <Typography 
        variant="caption" 
        sx={{ color: '#888888' }} 
        display="block" 
        align="center"
      >
        © {new Date().getFullYear()} SureBet. For educational purposes only. Please bet responsibly.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
