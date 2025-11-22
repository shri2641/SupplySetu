import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Chip, Divider, Stack, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const demoOrders = [
  {
    id: 'ORD-1001',
    supplier: 'FreshMart Delhi',
    product: 'Tomatoes',
    qty: '200 kg',
    price: '₹25,000',
    eta: '2 days',
    status: 'In Transit',
    notes: 'Deliver to central kitchen gate 3',
    tracking: [
      { location: 'FreshMart Warehouse, Delhi', time: '08:00 AM', status: 'Packed' },
      { location: 'NH19 Toll Plaza, Delhi-UP Border', time: '11:30 AM', status: 'Left facility' },
      { location: 'Greater Noida Logistics Hub', time: '01:15 PM', status: 'In transit' },
    ],
  },
  {
    id: 'ORD-1002',
    supplier: 'VeggieHub Mumbai',
    product: 'Carrots',
    qty: '120 kg',
    price: '₹14,400',
    eta: 'Delivered',
    status: 'Delivered',
    notes: 'Paid via UPI, received in cold storage',
    tracking: [
      { location: 'VeggieHub Navi Mumbai', time: 'Yesterday 07:40 PM', status: 'Dispatched' },
      { location: 'Thane Checkpost', time: 'Yesterday 10:10 PM', status: 'In transit' },
      { location: 'Vendor Depot, Dadar', time: 'Today 05:30 AM', status: 'Delivered' },
    ],
  },
  {
    id: 'ORD-1003',
    supplier: 'SpiceWorld Kolkata',
    product: 'Turmeric Powder',
    qty: '50 kg',
    price: '₹11,500',
    eta: 'Pending confirmation',
    status: 'Pending',
    notes: 'Awaiting supplier confirmation',
    tracking: [
      { location: 'SpiceWorld Processing Unit, Kolkata', time: 'Pending', status: 'Awaiting pickup slot' },
    ],
  },
];

export default function MyOrders() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useTranslation();
  const [trackingOrder, setTrackingOrder] = useState(null);

  const getStatusStyles = status => {
    switch (status) {
      case 'Delivered':
        return {
          color: isLight ? '#0f5132' : '#bbf7d0',
          bg: isLight ? '#d1fae5' : '#064e3b',
          icon: <LocalShippingIcon sx={{ color: isLight ? '#059669' : '#34d399' }} />,
        };
      case 'In Transit':
        return {
          color: isLight ? '#1d4ed8' : '#bfdbfe',
          bg: isLight ? '#dbeafe' : '#1e3a8a',
          icon: <ShoppingBagIcon sx={{ color: isLight ? '#2563eb' : '#60a5fa' }} />,
        };
      default:
        return {
          color: isLight ? '#92400e' : '#fdba74',
          bg: isLight ? '#fef3c7' : '#7c2d12',
          icon: <PendingActionsIcon sx={{ color: isLight ? '#d97706' : '#fcd34d' }} />,
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: isLight ? '#f7f7f9' : '#0f172a',
        py: 6,
        px: { xs: 1, sm: 4 },
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: 4, color: isLight ? '#185a9d' : '#8bd3dd', fontFamily: 'Pacifico, cursive' }}>
        {t('My Orders')}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {demoOrders.map(order => {
          const statusStyles = getStatusStyles(order.status);
          return (
            <Grid item xs={12} md={8} key={order.id}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 4,
                  p: 3,
                  background: isLight ? '#ffffff' : '#111827',
                  boxShadow: isLight ? '0 8px 24px rgba(24,90,157,0.08)' : '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{order.supplier}</Typography>
                    <Chip
                      icon={statusStyles.icon}
                      label={order.status}
                      sx={{
                        bgcolor: statusStyles.bg,
                        color: statusStyles.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
                    <Info label={t('Order ID')} value={order.id} />
                    <Info label={t('Product')} value={order.product} />
                    <Info label={t('Quantity')} value={order.qty} />
                    <Info label={t('Total Value')} value={order.price} />
                    <Info label={t('ETA / Status')} value={order.eta} />
                  </Box>
                  <Typography variant="body2" sx={{ color: isLight ? '#64748b' : '#cbd5f5' }}>
                    {order.notes}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="outlined" size="small" onClick={() => setTrackingOrder(order)}>
                      {t('Track Shipment')}
                    </Button>
                    <Button variant="contained" size="small">
                      {t('Contact Supplier')}
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Dialog open={Boolean(trackingOrder)} onClose={() => setTrackingOrder(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{t('Tracking Status')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {trackingOrder
              ? `${t('Order ID')}: ${trackingOrder.id} • ${t('Supplier Profile')}: ${trackingOrder.supplier}`
              : ''}
          </DialogContentText>
          <Stack spacing={1.5}>
            <Typography variant="body2">{t('Current status')}: {trackingOrder?.status}</Typography>
            <Typography variant="body2">{t('Estimated delivery')}: {trackingOrder?.eta}</Typography>
            <Typography variant="body2">{t('Notes')}: {trackingOrder?.notes}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t('Live route')}</Typography>
            <List dense>
              {(trackingOrder?.tracking || []).map((hop, idx) => (
                <ListItem key={`${hop.location}-${idx}`} alignItems="flex-start">
                  <ListItemText
                    primary={hop.location}
                    secondary={`${hop.status} • ${hop.time}`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              ))}
              {!trackingOrder?.tracking?.length && (
                <ListItem>
                  <ListItemText primary={t('No live updates available')} />
                </ListItem>
              )}
            </List>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingOrder(null)}>{t('Close')}</Button>
          <Button variant="contained" onClick={() => setTrackingOrder(null)}>
            {t('Got it')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Info({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.6, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

