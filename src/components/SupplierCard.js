import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';

export default function SupplierCard({ name, rating, location }) {
  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 4,
        background: 'rgba(241, 233, 233, 0.97)',
        boxShadow: '0 8px 32px 0 rgba(217, 155, 80, 0.15)',
        p: 3,
        m: 1,
        minWidth: 250,
        maxWidth: 320,
        transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s',
        cursor: 'pointer',
        willChange: 'transform',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: '6px solid #f7971e',
        '&:hover': {
          transform: 'scale3d(1.05,1.05,1.05) rotateY(-6deg)',
          boxShadow: '0 12px 36px 0 rgba(247, 151, 30, 0.25)',
        },
      }}
    >
      <Avatar sx={{ bgcolor: '#f7971e', mb: 2, width: 56, height: 56, boxShadow: '0 2px 8px #f7971e55' }}>
        <StorefrontIcon sx={{ color: '#fff', fontSize: 36 }} />
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#f7971e', mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
        {name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <LocationOnIcon sx={{ color: '#43cea2', fontSize: 18 }} />
        <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>{location}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarIcon sx={{ color: '#ffd600', fontSize: 18 }} />
        <Typography variant="body2" sx={{ color: '#7b3f00', fontWeight: 600 }}>{rating}</Typography>
      </Box>
    </Paper>
  );
} 