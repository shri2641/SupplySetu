import React from 'react';
import { Box, Typography, Button, useTheme, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// --- STYLING UTILITIES ---
const glassCardStyle = (theme) => ({
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.65)' 
    : 'rgba(15, 23, 42, 0.65)',
  boxShadow: theme.palette.mode === 'light' 
    ? '0 8px 32px 0 rgba(31, 38, 135, 0.1)' 
    : '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '24px',
  border: theme.palette.mode === 'light' 
    ? '1px solid rgba(255, 255, 255, 0.8)' 
    : '1px solid rgba(255, 255, 255, 0.05)',
  padding: '3rem 2rem',
  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'light' 
      ? '0 20px 40px 0 rgba(16, 185, 129, 0.15)' 
      : '0 20px 40px 0 rgba(0, 0, 0, 0.6)',
  },
});

const featureCardStyle = (theme) => ({
  ...glassCardStyle(theme),
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  height: '100%',
});

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      overflowX: 'hidden', 
      pb: 10 
    }} 
    className={isLight ? 'mesh-bg-light' : 'mesh-bg-dark'}>
      
      {/* HERO SECTION */}
      <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 8, md: 12 }, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Box sx={{ pr: { md: 4 } }}>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 700, 
                      letterSpacing: 2, 
                      textTransform: 'uppercase',
                      mb: 2 
                    }}>
                    {t('Streamlining Ecosystems')}
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                      color: theme.palette.text.primary,
                      lineHeight: 1.1,
                      mb: 3
                    }}>
                    Welcome to <Box component="span" sx={{ color: theme.palette.primary.main }}>SupplySetu</Box>
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{ mb: 5, maxWidth: 600, fontWeight: 400, lineHeight: 1.6 }}>
                    {t('The smartest way to connect vendors and suppliers. Discover reliable partners, manage your inventory efficiently, and grow your business.')}
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: '#fff',
                        px: 5,
                        py: 1.8,
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        boxShadow: `0 8px 24px ${isLight ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.2)'}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 12px 28px ${isLight ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)'}`,
                        }
                      }}
                    >
                      {t('Get Started Free')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/about')}
                      sx={{
                        px: 5,
                        py: 1.8,
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                          borderWidth: 2,
                          backgroundColor: isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)',
                        }
                      }}
                    >
                      {t('Learn More')}
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="animate-float"
            >
              <Box sx={glassCardStyle(theme)}>
                <Box 
                  component="img" 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                  alt="Supply Chain" 
                  sx={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }} 
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* FEATURES SECTION */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, color: theme.palette.text.primary }}>
              Why Choose SupplySetu?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
              We provide the tools you need to build a resilient and efficient supply chain.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <StorefrontIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
                title: 'Verified Suppliers',
                desc: 'Connect with a network of thoroughly vetted suppliers ensuring quality and reliability.'
              },
              {
                icon: <HandshakeIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
                title: 'Seamless Collaboration',
                desc: 'Communicate, negotiate, and establish long-term partnerships directly through our platform.'
              },
              {
                icon: <TrendingUpIcon sx={{ fontSize: 48, color: '#f59e0b' }} />,
                title: 'Growth Analytics',
                desc: 'Track your orders, manage inventory intelligently, and watch your business scale.'
              }
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Box sx={featureCardStyle(theme)}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '16px', 
                      backgroundColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)',
                      mb: 3
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h4" sx={{ mb: 2, fontSize: '1.5rem', color: theme.palette.text.primary }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
} 