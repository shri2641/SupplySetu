import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Divider, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTranslation } from 'react-i18next';

const demoReviews = [
  { reviewer: 'Ravi Kumar', comment: 'Fresh stock and timely updates!', rating: 4.8, date: '2 days ago' },
  { reviewer: 'Neha Singh', comment: 'Packaging was neat and delivery was on schedule.', rating: 4.6, date: '1 week ago' },
  { reviewer: 'Foodies Hub', comment: 'Need quicker turnaround for bulk pulses.', rating: 4.0, date: '3 weeks ago' },
];

const currentRequests = [
  { id: 'REQ-890', product: 'Tomatoes', qty: '150 kg', status: 'Awaiting confirmation', eta: 'Pending' },
  { id: 'REQ-891', product: 'Onions', qty: '200 kg', status: 'Confirmed', eta: 'Tomorrow' },
];

export default function SupplierReviews() {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f7f7f9', py: 6, px: { xs: 1, sm: 4 } }}>
      <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 4, color: '#15803d', fontFamily: 'Pacifico, cursive' }}>
        {t('Reviews & Ratings')}
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 30px rgba(21,128,61,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              {t('Recent Reviews')}
            </Typography>
            {demoReviews.map((rev, idx) => (
              <React.Fragment key={rev.reviewer}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip icon={<StarIcon sx={{ color: '#fbbf24 !important' }} />} label={rev.rating} sx={{ fontWeight: 700 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{rev.reviewer}</Typography>
                  <Typography variant="caption" color="text.secondary">{rev.date}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>{rev.comment}</Typography>
                {idx < demoReviews.length - 1 && <Divider sx={{ mb: 2 }} />}
              </React.Fragment>
            ))}
            <Button variant="contained" startIcon={<RateReviewIcon />} sx={{ mt: 2 }}>
              {t('Respond to Reviews')}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 30px rgba(21,128,61,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              {t('Current Requests')}
            </Typography>
            {currentRequests.map((req, idx) => (
              <React.Fragment key={req.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{req.product}</Typography>
                    <Typography variant="body2" color="text.secondary">Qty: {req.qty}</Typography>
                    <Typography variant="caption" color="text.secondary">ETA: {req.eta}</Typography>
                  </Box>
                  <Chip
                    icon={<LocalShippingIcon />}
                    label={req.status}
                    color={req.status === 'Confirmed' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Box>
                {idx < currentRequests.length - 1 && <Divider sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
            <Button variant="outlined" sx={{ mt: 2 }}>
              {t('View All Requests')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

