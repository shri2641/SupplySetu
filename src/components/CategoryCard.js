import React from 'react';
import { Card, Box, Typography } from '@mui/material';

export default function CategoryCard({ title, image, fallback }) {
  const [imgSrc, setImgSrc] = React.useState(image);
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        p: 2,
        height: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        color: '#111827',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 10px 30px rgba(24,90,157,0.10)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 18px 38px rgba(24,90,157,0.18)'
        }
      }}
    >
      <Box
        component="img"
        alt={title}
        src={imgSrc}
        onError={() => {
          if (fallback && imgSrc !== fallback) setImgSrc(fallback);
        }}
        sx={{ width: 96, height: 96, objectFit: 'contain', mb: 1, borderRadius: 3, backgroundColor: '#f8fafc' }}
      />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: 'center' }}>{title}</Typography>
    </Card>
  );
}


