import React from 'react';
import { Box, Typography, Divider, Paper, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LanguageIcon from '@mui/icons-material/Language';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Food3D from '../components/Food3D';
import { useTranslation } from 'react-i18next';

const features = [
  { icon: <VerifiedUserIcon color="primary" />, text: 'Verified supplier discovery with reviews' },
  { icon: <LocalOfferIcon sx={{ color: '#f7971e' }} />, text: 'Real-time price comparison' },
  { icon: <GroupIcon sx={{ color: '#43cea2' }} />, text: 'Group buying for better deals' },
  { icon: <WarningAmberIcon sx={{ color: '#e53935' }} />, text: 'Emergency SOS board' },
  { icon: <LanguageIcon sx={{ color: '#185a9d' }} />, text: 'Multi-language, mobile-friendly UI' },
];

export default function About() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isLight ? '#f7f7f9' : '#0f172a',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3D background behind the white card */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.25, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Food3D />
      </Box>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 480,
          width: '95vw',
          borderRadius: 5,
          p: { xs: 3, sm: 5 },
          background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(26, 26, 46, 0.95)',
          boxShadow: isLight 
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.18)' 
            : '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          border: isLight ? 'none' : '1px solid rgba(139, 211, 221, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="SupplySetu" width={100} style={{ borderRadius: 16, boxShadow: isLight ? '0 2px 8px #fcb69f55' : '0 2px 8px rgba(139, 211, 221, 0.3)' }} />

        </Box>
        <Typography variant="h3" sx={{ 
          fontFamily: 'Pacifico, cursive', 
          color: isLight ? '#185a9d' : '#8bd3dd', 
          mb: 1, 
          fontWeight: 700, 
          letterSpacing: 1 
        }}>
          {t('About SupplySetu')}
        </Typography>
        <Typography variant="h6" sx={{ 
          mb: 3, 
          color: isLight ? '#333' : '#eaeaea', 
          fontWeight: 400 
        }}>
          {t('Empowering street food vendors with trusted suppliers, group buying, and real-time support.')}
        </Typography>
        <Divider sx={{ my: 2, borderColor: isLight ? undefined : 'rgba(139, 211, 221, 0.2)' }} />
        <Typography variant="h5" sx={{ 
          mb: 2, 
          color: '#f7971e', 
          fontWeight: 600 
        }}>
          {t('Features')}
        </Typography>
        <List sx={{ mb: 2 }}>
          {features.map((feature, idx) => (
            <ListItem key={idx} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>{feature.icon}</ListItemIcon>
              <ListItemText 
                primary={t(feature.text)} 
                primaryTypographyProps={{ 
                  sx: { 
                    color: isLight ? '#444' : '#b5b5b5', 
                    fontSize: '1.08rem' 
                  } 
                }} 
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, borderColor: isLight ? undefined : 'rgba(139, 211, 221, 0.2)' }} />
        <Typography variant="body2" sx={{ 
          color: isLight ? '#888' : '#b5b5b5' 
        }}>
          {t('Contact')}: <a href="mailto:support@supplysetu.com" style={{ 
            color: isLight ? '#185a9d' : '#8bd3dd', 
            textDecoration: 'none', 
            fontWeight: 500 
          }}>support@supplysetu.com</a>
        </Typography>
      </Paper>
    </Box>
  );
} 