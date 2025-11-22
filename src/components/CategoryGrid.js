import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import CategoryCard from './CategoryCard';

export default function CategoryGrid() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const categories = [
    {
      title: 'Bakery & Biscuits',
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=320&q=80',
      fallback: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=320&q=40'
    },
    {
      title: 'Tea, Coffee & Health Drink',
      image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=320&q=80',
      fallback: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=320&q=40'
    },
    {
      title: 'Atta, Rice & Dal',
      image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=320&q=80',
      fallback: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=320&q=40'
    },
    {
      title: 'Oil & Masala',
      image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=320&q=80',
      fallback: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=320&q=40'
    },
    {
      title: 'Snacks & Beverages',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=320&q=80',
      fallback: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=320&q=40'
    }
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mb: 5 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: isLight ? '#0f172a' : '#e5e7eb',
          textAlign: 'center'
        }}
      >
        Shop by Category
      </Typography>
      <Grid container spacing={3}>
        {categories.map((c) => (
          <Grid key={c.title} item xs={12} sm={6} md={4}>
            <CategoryCard {...c} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


