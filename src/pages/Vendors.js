import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Button, Chip, Paper, useTheme, TextField, InputAdornment, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', location: '', phone: '', groupBuy: false });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState({ location: '', pincode: '' });
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const parsedUser = storedUser ? (() => { try { return JSON.parse(storedUser); } catch { return null; } })() : null;
  const isSupplier = parsedUser?.role === 'supplier';
  const isVendorUser = parsedUser?.role === 'vendor';

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: index => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.08, duration: 0.4, ease: 'easeOut' },
    }),
  };

  const demoVendors = [
    { _id: 'demo-v1', name: 'CityFresh Kitchens', location: 'Delhi', phone: '9876543210', groupBuy: true },
    { _id: 'demo-v2', name: 'UrbanEats Collective', location: 'Mumbai', phone: '9123456780', groupBuy: false },
    { _id: 'demo-v3', name: 'GreenBite Restaurants', location: 'Noida', phone: '9812345678', groupBuy: true },
  ];

  const demoInventory = {
    'demo-v1': [
      { item: 'Tomatoes', qty: '120 kg', status: 'In Stock' },
      { item: 'Onions', qty: '90 kg', status: 'Low Stock' },
    ],
    'demo-v2': [
      { item: 'Carrots', qty: '150 kg', status: 'In Stock' },
      { item: 'Green Peas', qty: '60 kg', status: 'In Transit' },
    ],
    'demo-v3': [
      { item: 'Wheat Flour', qty: '200 kg', status: 'In Stock' },
      { item: 'Chickpeas', qty: '80 kg', status: 'In Stock' },
    ],
    default: [
      { item: 'Mixed Vegetables', qty: '100 kg', status: 'In Stock' },
      { item: 'Spices Pack', qty: '40 kg', status: 'Pending Refill' },
    ],
  };

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/vendors');
        let data = res.data;
        if (!data || data.length === 0) {
          data = demoVendors;
        }
        setVendors(data);
        setError('');
      } catch (err) {
        setVendors(demoVendors);
        setError('');
      }
      setLoading(false);
    };

    fetchVendors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupplier]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/api/vendors', form);
      setVendors(vs => [...vs, res.data]);
      setForm({ name: '', location: '', phone: '', groupBuy: false });
      setError('');
    } catch (err) {
      setError('Failed to register vendor');
    }
    setSubmitting(false);
  };

  const handleSearchChange = e => {
    const { name, value } = e.target;
    setSearch(s => ({ ...s, [name]: value }));
  };

  const goSearchSuppliers = () => {
    const params = new URLSearchParams();
    if (search.location) params.set('location', search.location);
    if (search.pincode) params.set('pincode', search.pincode);
    navigate(`/suppliers?${params.toString()}`);
  };

  const handleOpenInventory = vendor => {
    setSelectedVendor(vendor);
    setInventoryOpen(true);
  };

  const getInventoryForVendor = vendorId => demoInventory[vendorId] || demoInventory.default;

  const statusColor = status => {
    switch (status) {
      case 'In Stock':
        return isLight ? '#15803d' : '#34d399';
      case 'In Transit':
        return isLight ? '#1d4ed8' : '#93c5fd';
      case 'Low Stock':
        return isLight ? '#b45309' : '#fdba74';
      default:
        return isLight ? '#92400e' : '#fcd34d';
    }
  };

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
      }}
    >
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: isLight ? '#185a9d' : '#8bd3dd', fontFamily: 'Pacifico, cursive', textAlign: 'center', letterSpacing: 1 }}>
        {t('Vendors')}
      </Typography>

      {/* Search suppliers by location/pincode */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          mb: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background: isLight ? '#ffffff' : '#0b1a12',
          boxShadow: isLight ? '0 10px 30px rgba(21,128,61,0.08)' : '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'stretch',
          border: `1px solid ${isLight ? 'rgba(34,197,94,0.15)' : 'rgba(52,211,153,0.25)'}`,
        }}
      >
        <TextField
          name="location"
          value={search.location}
          onChange={handleSearchChange}
          placeholder={t('Search by city/area')}
          fullWidth
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: isLight ? '#15803d' : '#34d399' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="pincode"
          value={search.pincode}
          onChange={handleSearchChange}
          placeholder={t('Pincode')}
          fullWidth
          size="medium"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PinDropIcon sx={{ color: isLight ? '#15803d' : '#34d399' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={goSearchSuppliers}
          sx={{
            minWidth: { xs: '100%', md: 160 },
            fontWeight: 600,
            borderRadius: 3,
            boxShadow: isLight ? '0 12px 24px rgba(21,128,61,0.2)' : '0 12px 24px rgba(34,197,94,0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight ? '0 16px 30px rgba(21,128,61,0.25)' : '0 16px 30px rgba(34,197,94,0.35)',
            },
          }}
        >
          {t('Search')}
        </Button>
      </Paper>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        sx={{
          width: '100%',
          maxWidth: 520,
          mx: 'auto',
          mb: 4,
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          background: isLight ? '#ffffff' : '#0b1a12',
          boxShadow: isLight ? '0 12px 32px rgba(21,128,61,0.12)' : '0 12px 32px rgba(0,0,0,0.6)',
          border: `1px solid ${isLight ? 'rgba(34,197,94,0.15)' : 'rgba(52,211,153,0.25)'}`,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>{t('Register as Vendor')}</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField name="name" value={form.name} onChange={handleChange} placeholder={t('Name')} label={t('Name')} required fullWidth />
            <TextField name="location" value={form.location} onChange={handleChange} placeholder={t('Location')} label={t('Location')} required fullWidth />
            <TextField name="phone" value={form.phone} onChange={handleChange} placeholder={t('Phone')} label={t('Phone')} required fullWidth />
            <FormControlLabel
              control={<Checkbox name="groupBuy" checked={form.groupBuy} onChange={handleChange} color="primary" />}
              label={t('Group Buy Available')}
              sx={{ color: isLight ? '#0f172a' : '#cbd5f5' }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                py: 1.3,
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: isLight ? '0 14px 30px rgba(21,128,61,0.18)' : '0 14px 30px rgba(34,197,94,0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 18px 34px rgba(21,128,61,0.22)' : '0 18px 34px rgba(34,197,94,0.35)',
                },
              }}
            >
              {submitting ? t('Registering...') : t('Register')}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </form>
      </Paper>
      <Grid container spacing={4} justifyContent="center">
        {vendors.map((v, index) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <motion.div
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, scale: 1.01 }}
              style={{ height: '100%' }}
              onClick={() => isVendorUser && handleOpenInventory(v)}
            >
            <Card
              sx={{
                borderRadius: 5,
                backgroundColor: isLight ? '#ffffff' : '#0d1f15',
                border: `1px solid ${isLight ? 'rgba(34,197,94,0.12)' : 'rgba(52,211,153,0.2)'}`,
                boxShadow: isLight
                  ? '0 6px 24px rgba(21,128,61,0.12)'
                  : '0 6px 24px rgba(0,0,0,0.6)',
                transition: 'all 0.25s ease',
                height: '100%',
                p: 2.5,
                position: 'relative',
                overflow: 'hidden',
                cursor: isVendorUser ? 'pointer' : 'default',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 5,
                  padding: 1,
                  background: isLight
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.05))'
                    : 'linear-gradient(135deg, rgba(34,197,94,0.35), rgba(15,118,110,0.2))',
                  zIndex: 0,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover:before': {
                  opacity: 1,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: isLight ? '#15803d' : '#22c55e',
                    width: 64,
                    height: 64,
                    fontSize: 32,
                    mx: 'auto',
                    mb: 1.5,
                    boxShadow: isLight ? '0 8px 18px rgba(21,128,61,0.3)' : '0 8px 18px rgba(34,197,94,0.35)',
                  }}
                >
                  {v.name[0]}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: isLight ? '#0f172a' : '#e5ffe9', mb: 0.5 }}>{v.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ color: isLight ? '#16a34a' : '#34d399', fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">{t(v.location)}</Typography>
                </Box>
                {v.groupBuy ? (
                  <Chip
                    icon={<GroupAddIcon sx={{ color: isLight ? '#16a34a' : '#34d399' }} />}
                    label={t('Join Group Buy')}
                    sx={{
                      bgcolor: isLight ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.2)',
                      color: isLight ? '#0f5132' : '#bbf7d0',
                      fontWeight: 600,
                      px: 1.5,
                      fontSize: 16,
                      mt: 1,
                      boxShadow: isLight ? '0 6px 12px rgba(21,128,61,0.25)' : '0 6px 12px rgba(34,197,94,0.3)',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: isLight ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.35)',
                        color: isLight ? '#064e3b' : '#ecfccb',
                      },
                    }}
                    clickable
                  />
                ) : (
                  <Chip
                    label={t('No Group Buy')}
                    sx={{
                      bgcolor: isLight ? 'rgba(250,204,21,0.12)' : 'rgba(120,53,15,0.35)',
                      color: isLight ? '#b45309' : '#fed7aa',
                      fontWeight: 600,
                      px: 1.5,
                      fontSize: 16,
                      mt: 1,
                    }}
                  />
                )}
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <Dialog open={inventoryOpen} onClose={() => setInventoryOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: isLight ? '#15803d' : '#34d399' }}>
          {t('Inventory for')} {selectedVendor?.name}
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {getInventoryForVendor(selectedVendor?._id).map((item, idx) => (
              <React.Fragment key={`${item.item}-${idx}`}>
                <ListItem
                  secondaryAction={
                    <Chip
                      label={t(item.status)}
                      size="small"
                      sx={{
                        bgcolor: `${statusColor(item.status)}22`,
                        color: statusColor(item.status),
                        fontWeight: 600,
                      }}
                    />
                  }
                >
                  <ListItemText
                    primary={item.item}
                    secondary={`${t('Quantity')}: ${item.qty}`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                {idx < getInventoryForVendor(selectedVendor?._id).length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInventoryOpen(false)}>{t('Close')}</Button>
          <Button variant="contained" onClick={() => { setInventoryOpen(false); navigate('/suppliers'); }}>
            {t('Order Supplies')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 