import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: isLight
          ? undefined
          : undefined,
        backgroundColor: isLight ? '#f7f7f9' : '#0f172a',
        py: 6,
        px: { xs: 1, sm: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 480,
          width: '95vw',
          borderRadius: 5,
          p: { xs: 3, sm: 5 },
          background: isLight ? 'rgba(255,255,255,0.97)' : 'rgba(26, 26, 46, 0.97)',
          boxShadow: isLight
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.18)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontFamily: 'Pacifico, cursive', color: isLight ? '#185a9d' : '#8bd3dd', mb: 2, fontWeight: 700, letterSpacing: 1 }}>
          {t('Contact Us')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: isLight ? '#333' : '#eaeaea', fontWeight: 500 }}>
          <b>SupplySetu</b> {t('is a platform dedicated to empowering street food vendors and small businesses by connecting them with trusted suppliers, enabling group buying, and providing real-time support.')}
        </Typography>
        <Divider sx={{ my: 2, borderColor: isLight ? undefined : 'rgba(139, 211, 221, 0.2)' }} />
        <Typography variant="h6" sx={{ color: isLight ? '#185a9d' : '#8bd3dd', fontWeight: 700, mb: 1 }}>{t('Company Info')}</Typography>
        <Typography variant="body2" sx={{ color: isLight ? '#555' : '#b5b5b5', mb: 1 }}>
          <b>{t('Company')}:</b> SupplySetu Pvt. Ltd.<br/>
          <b>{t('Location')}:</b> New Delhi, India<br/>
          <b>{t('Email')}:</b> <a href="mailto:support@supplysetu.com" style={{ color: isLight ? '#185a9d' : '#8bd3dd', textDecoration: 'none', fontWeight: 500 }}>support@supplysetu.com</a>
        </Typography>
        <Divider sx={{ my: 2, borderColor: isLight ? undefined : 'rgba(139, 211, 221, 0.2)' }} />
        <Typography variant="body2" sx={{ color: isLight ? '#888' : '#b5b5b5' }}>
          &copy; {new Date().getFullYear()} SupplySetu. {t('All rights reserved.')}
        </Typography>
      </Paper>
    </Box>
  );
} 