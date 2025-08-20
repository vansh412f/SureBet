import React from 'react';
import { Box, Grid, Typography, IconButton, Divider, Card, Chip } from '@mui/material';
import { 
  GitHub, 
  LinkedIn, 
  Language, 
  TrendingUp, 
  Speed, 
  Timeline, 
  Visibility,
  RocketLaunch,
  Security
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// ---------------- Animations ----------------

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 123, 255, 0.6); }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ---------------- Styled Components ----------------

const FooterContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.background.paper} 50%, 
    ${theme.palette.background.default} 100%)`,
  position: 'relative',
  marginTop: 'auto',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      transparent 0%, 
      ${theme.palette.primary.main} 25%, 
      ${theme.palette.secondary.main} 50%, 
      ${theme.palette.primary.main} 75%, 
      transparent 100%)`,
    animation: `${shimmerAnimation} 3s ease-in-out infinite`,
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}08 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}08 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, ${theme.palette.primary.main}05 0%, transparent 50%)`,
    pointerEvents: 'none',
  }
}));

const FooterContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(6, 4, 3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(5, 3, 2.5),
  },
}));

const BrandSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: `linear-gradient(135deg, 
    ${theme.palette.background.paper}60 0%, 
    ${theme.palette.background.default}40 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.divider}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
    borderColor: `${theme.palette.primary.main}60`,
  }
}));

const BrandLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const LogoIcon = styled(TrendingUp)(({ theme }) => ({
  fontSize: '32px',
  color: theme.palette.primary.main,
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  filter: 'drop-shadow(0 4px 8px rgba(0,123,255,0.3))',
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Segoe UI", sans-serif',
  fontWeight: 800,
  fontSize: '2rem',
  background: `linear-gradient(135deg, 
    ${theme.palette.text.primary}, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.02em',
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: '0%',
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'width 0.3s ease',
  },
  
  '&:hover::after': {
    width: '100%',
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.background.paper}80 0%, 
    ${theme.palette.background.default}60 100%)`,
  backdropFilter: 'blur(15px)',
  border: `1px solid ${theme.palette.divider}30`,
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  height: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}10, transparent)`,
    transition: 'left 0.5s ease',
  },
  
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: `${theme.palette.primary.main}50`,
    boxShadow: `0 15px 35px ${theme.palette.primary.main}15`,
    
    '&::before': {
      left: '100%',
    }
  }
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    background: `${theme.palette.primary.main}08`,
    transform: 'translateX(8px)',
  },
  
  '&:last-child': {
    marginBottom: 0,
  }
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: '16px',
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: `linear-gradient(135deg, 
    ${theme.palette.background.paper}80 0%, 
    ${theme.palette.background.default}60 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}40`,
  color: theme.palette.text.secondary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '& .MuiSvgIcon-root': {
    position: 'relative',
    zIndex: 1,
    fontSize: '20px',
  },
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    color: '#fff',
    borderColor: 'transparent',
    animation: `${glowAnimation} 2s ease-in-out infinite`,
    
    '&::before': {
      opacity: 1,
    }
  }
}));

const ConnectSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: `linear-gradient(135deg, 
    ${theme.palette.background.paper}40 0%, 
    ${theme.palette.background.default}60 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.divider}30`,
}));

const CreatorTag = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: theme.spacing(0.5, 1),
  borderRadius: '20px',
  border: `1px solid ${theme.palette.primary.main}30`,
  marginBottom: theme.spacing(2),
  
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  }
}));

const Copyright = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
  fontWeight: 400,
  padding: theme.spacing(3, 0),
  position: 'relative',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
    borderRadius: '1px',
  }
}));

// ---------------- Footer Component ----------------

const Footer = () => {
  const features = [
    { icon: Speed, text: 'Real-time WebSocket Updates', desc: 'Live data streaming' },
    { icon: Timeline, text: 'Multi-League Scanning', desc: 'Comprehensive coverage' },
    { icon: Visibility, text: '7-Day Match Window', desc: 'Extended visibility' },
    { icon: Security, text: 'Risk-Free Analysis', desc: 'Arbitrage detection' }
  ];

  return (
    <FooterContainer id="app-footer">
      <FooterContent>
        <Grid
        container
        spacing={4}
        alignItems="stretch"
        justifyContent="space-between"
        sx={{
          flexDirection: { xs: 'column', md: 'row' }, // stack vertically on mobile/tablet
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
          
          {/* Brand Section */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <BrandSection sx={{ animation: `${slideInUp} 0.6s ease-out` }}>
              <BrandLogo>
                <LogoIcon />
                <BrandTitle variant="h4">
                  SureBet
                </BrandTitle>
              </BrandLogo>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  mb: 2
                }}
              >
                An intelligent sports arbitrage tracking platform that identifies 
                <strong style={{ color: 'primary.main' }}> risk-free profit opportunities</strong> across 
                multiple bookmakers using advanced real-time analysis.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  size="small" 
                  label="Educational" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #FF6B6B20, #4ECDC420)',
                    color: 'text.primary',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  size="small" 
                  label="Real-time" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #45B7D120, #96CEB420)',
                    color: 'text.primary',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  size="small" 
                  label="Analytics" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #FECA5720, #FF9F4320)',
                    color: 'text.primary',
                    fontWeight: 600
                  }}
                />
              </Box>
            </BrandSection>
          </Grid>

          {/* Features Grid */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                mb: 2.5, 
                color: 'text.primary',
                textAlign: { xs: 'center', lg: 'mid'}
              }}
            >
              Core Features
            </Typography>
            
            <Grid container spacing={1.5}>
              {features.map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <FeatureCard 
                    elevation={0}
                    sx={{ 
                      animation: `${slideInUp} 0.6s ease-out ${index * 0.1}s both`,
                      padding: (theme) => theme.spacing(2),
                      minHeight: '100px'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      height: '100%',
                      justifyContent: 'center'
                    }}>
                      <FeatureIcon sx={{ mb: 1 }}>
                        <feature.icon fontSize="small" />
                      </FeatureIcon>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          lineHeight: 1.2,
                          mb: 0.5,
                          fontSize: '0.8rem'
                        }}
                      >
                        {feature.text}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.7rem'
                        }}
                      >
                        {feature.desc}
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Connect Section */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ConnectSection sx={{ animation: `${slideInUp} 0.6s ease-out 0.4s both` }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  color: 'text.primary'
                }}
              >
                Connect
              </Typography>
              
              <CreatorTag 
                icon={<RocketLaunch />}
                label="Created by Vansh"
                variant="outlined"
              />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 3,
                  fontStyle: 'italic'
                }}
              >
                Passionate developer crafting intelligent solutions
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                <SocialButton
                  component="a"
                  href="https://github.com/vansh412f"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub Profile"
                >
                  <GitHub />
                </SocialButton>
                
                <SocialButton
                  component="a"
                  href="https://linkedin.com/in/vansh-singh-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                >
                  <LinkedIn />
                </SocialButton>
                
                <SocialButton
                  component="a"
                  href="https://sure-bet-hazel.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live Application"
                >
                  <Language />
                </SocialButton>
              </Box>
            </ConnectSection>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            borderColor: 'divider',
            opacity: 0.3,
            mb: 2
          }} 
        />
        
        <Copyright>
          © {new Date().getFullYear()} SureBet • Designed for educational purposes • Please bet responsibly
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;