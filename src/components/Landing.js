import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const glassStyle = (theme) => ({
  background: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(26, 26, 46, 0.85)',
  boxShadow: theme.palette.mode === 'light' ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' : '0 8px 32px 0 rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
  borderRadius: '24px',
  border: theme.palette.mode === 'light' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(139, 211, 221, 0.18)',
  padding: '2rem',
  transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s',
  cursor: 'pointer',
  willChange: 'transform',
  '&:hover': {
    transform: 'scale3d(1.04,1.04,1.04) rotateY(4deg)',
    boxShadow: theme.palette.mode === 'light' ? '0 16px 48px 0 rgba(31, 38, 135, 0.37)' : '0 16px 48px 0 rgba(0,0,0,0.7)',
  },
});

const gradientBg = (theme) => ({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    : 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
});

const heroStyle = (theme) => ({
  background: theme.palette.mode === 'light'
    ? undefined
    : undefined,
  backgroundColor: theme.palette.mode === 'light' ? '#f7f7f9' : '#0f172a',
});

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={gradientBg(theme)}>
      <Box
        sx={{
          ...glassStyle(theme),
          maxWidth: 400,
          width: '90vw',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === 'light' ? '#fff' : theme.palette.text.primary,
            textShadow: theme.palette.mode === 'light' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px #000',
            mb: 2,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {t('SupplySetu')}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.text.secondary, mb: 4 }}
        >
          {t('Welcome to SupplySetu')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: theme.palette.mode === 'light'
              ? undefined
              : undefined,
            backgroundColor: theme.palette.mode === 'light' ? '#185a9d' : '#8bd3dd',
            color: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
            fontWeight: 600,
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            borderRadius: '2rem',
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 24px 0 rgba(31, 38, 135, 0.25)'
              : '0 4px 24px 0 rgba(139, 211, 221, 0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.08) rotateY(-6deg)',
              background: theme.palette.mode === 'light'
                ? undefined
                : undefined,
              backgroundColor: theme.palette.mode === 'light' ? '#0f3f73' : '#6dbbc5',
            },
          }}
          onClick={() => navigate('/login')}
        >
          {t('Login / Register')}
        </Button>
      </Box>
    </Box>
  );
} 