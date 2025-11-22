import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Grid, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Snackbar, Alert, IconButton, Fab, List, ListItem, ListItemText, InputAdornment } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { useTranslation } from 'react-i18next';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(8px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  padding: '2.5rem 2rem',
  maxWidth: 500,
  width: '95vw',
  textAlign: 'center',
  margin: 'auto',
};

const gradientBg = {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0f172a',
};

const placeholderImg = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=80&q=80';

const mockSuppliers = [
  {
    id: '1',
    name: 'FreshMart',
    location: 'Delhi',
    rating: 4.8,
    avatar: <StorefrontIcon sx={{ color: '#43cea2', fontSize: 60 }} />,
    products: [
      { name: 'Tomatoes', category: 'Vegetables', price: 30, unit: 'kg', stockKg: 500, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=80&q=80' },
      { name: 'Onions', category: 'Vegetables', price: 25, unit: 'kg', stockKg: 800, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=80&q=80' },
      { name: 'Potatoes', category: 'Vegetables', price: 20, unit: 'kg', stockKg: 1000, moqKg: 25, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=80&q=80' },
      { name: 'Banana (Raw/Green)', category: 'Vegetables', price: 35, unit: 'kg', stockKg: 300, moqKg: 15, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1571772805064-207c8435df79?auto=format&fit=crop&w=80&q=80' },
      { name: 'Spinach', category: 'Vegetables', price: 20, unit: 'bunch', stockKg: 150, moqKg: 30, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80' },
      { name: 'Tomato (Cherry)', category: 'Vegetables', price: 90, unit: 'kg', stockKg: 120, moqKg: 10, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=80&q=80' },
      { name: 'Basmati Rice', category: 'Grains', price: 75, unit: 'kg', stockKg: 300, moqKg: 50, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=80&q=80' },
      { name: 'Brown Rice', category: 'Grains', price: 85, unit: 'kg', stockKg: 220, moqKg: 40, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=80&q=80' },
      { name: 'Whole Wheat Flour', category: 'Grains', price: 48, unit: 'kg', stockKg: 500, moqKg: 50, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=80&q=80' },
      { name: 'Oats (Rolled)', category: 'Grains', price: 120, unit: 'kg', stockKg: 140, moqKg: 25, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=80&q=80' },
      { name: 'Chana Dal', category: 'Pulses', price: 68, unit: 'kg', stockKg: 250, moqKg: 40, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1612874472449-5e6643560403?auto=format&fit=crop&w=80&q=80' },
    ],
    reviews: [
      { name: 'Ravi', rating: 5, comment: 'Great quality and timely delivery!' },
      { name: 'Sita', rating: 4, comment: 'Affordable prices, will buy again.' },
      { name: 'Amit', rating: 5, comment: 'Very trustworthy supplier.' },
    ],
  },
  {
    id: '2',
    name: 'VeggieHub',
    location: 'Mumbai',
    rating: 4.6,
    avatar: <StorefrontIcon sx={{ color: '#43cea2', fontSize: 60 }} />,
    products: [
      { name: 'Carrots', category: 'Vegetables', price: 40, unit: 'kg', stockKg: 450, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=80&q=80' },
      { name: 'Cabbage', category: 'Vegetables', price: 18, unit: 'kg', stockKg: 300, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=80&q=80' },
      { name: 'Green Peas', category: 'Vegetables', price: 55, unit: 'kg', stockKg: 200, moqKg: 15, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1515541965486-c2c3b5640e03?auto=format&fit=crop&w=80&q=80' },
      { name: 'Banana (Raw/Green)', category: 'Vegetables', price: 36, unit: 'kg', stockKg: 260, moqKg: 15, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1571772805064-207c8435df79?auto=format&fit=crop&w=80&q=80' },
      { name: 'Leafy Mix (Spinach/Amaranth)', category: 'Vegetables', price: 22, unit: 'bunch', stockKg: 180, moqKg: 30, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80' },
      { name: 'Poha (Flattened Rice)', category: 'Grains', price: 60, unit: 'kg', stockKg: 260, moqKg: 40, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1600185365527-569b3ef9c4ce?auto=format&fit=crop&w=80&q=80' },
      { name: 'Maida (Refined Flour)', category: 'Grains', price: 52, unit: 'kg', stockKg: 400, moqKg: 50, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=80&q=80' },
    ],
    reviews: [
      { name: 'Priya', rating: 5, comment: 'Fresh veggies every time!' },
      { name: 'Sunil', rating: 4, comment: 'Good service.' },
    ],
  },
  {
    id: '3',
    name: 'SpiceWorld',
    location: 'Kolkata',
    rating: 4.7,
    avatar: <StorefrontIcon sx={{ color: '#43cea2', fontSize: 60 }} />,
    products: [
      { name: 'Turmeric Powder', category: 'Spices', price: 220, unit: 'kg', stockKg: 120, moqKg: 10, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058c?auto=format&fit=crop&w=80&q=80' },
      { name: 'Coriander Powder', category: 'Spices', price: 180, unit: 'kg', stockKg: 150, moqKg: 10, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=80&q=80' },
      { name: 'Red Chili Powder', category: 'Spices', price: 260, unit: 'kg', stockKg: 100, moqKg: 10, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=80&q=80' },
    ],
    reviews: [
      { name: 'Nisha', rating: 5, comment: 'Excellent aroma and quality!' },
      { name: 'Arun', rating: 4, comment: 'Timely delivery, decent pricing.' },
    ],
  },
];

const getStoredSupplier = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('selectedSupplier');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export default function SupplierProfile() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderQty, setOrderQty] = useState('');
  const [orderProduct, setOrderProduct] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [category, setCategory] = useState('All');
  const [chatMessages, setChatMessages] = useState([
    { from: 'vendor', text: 'Hi, is Tomatoes available in bulk?' },
    { from: 'supplier', text: 'Yes, we have fresh stock today!' },
  ]);
  const [cartSnackbar, setCartSnackbar] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const { t } = useTranslation();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/suppliers/${id}`);
        setSupplier(res.data);
      } catch (err) {
        const stored = getStoredSupplier();
        if (stored && (stored._id === id || stored.id === id || `m${stored.id}` === id)) {
          setSupplier(stored);
        } else {
          const found = mockSuppliers.find(s => s.id === id || `m${s.id}` === id);
          setSupplier(found || null);
        }
      }
      setLoading(false);
    };
    fetchSupplier();
  }, [id]);

  const handleQuantityChange = (product, value) => {
    const numeric = Number(value);
    const moq = product.moqKg || 1;
    const stock = product.stockKg || Number.MAX_SAFE_INTEGER;
    const qty = Math.min(stock, Math.max(moq, numeric));
    setQuantities(prev => ({ ...prev, [product.name]: qty }));
  };

  const handleAddToCart = product => {
    if (!supplier) return;
    const qty = quantities[product.name] || product.moqKg || 0;
    const newItem = {
      id: `${supplier._id || supplier.id}-${product.name}-${Date.now()}`,
      supplierId: supplier._id || supplier.id,
      supplier: supplier.name,
      product: product.name,
      qty: `${qty} ${product.unit || 'kg'}`,
      price: product.price ? `₹${product.price}/${product.unit || 'kg'}` : '',
      total: product.price ? product.price * qty : 0,
    };
    try {
      const existing = JSON.parse(localStorage.getItem('cartItems') || '[]');
      existing.push(newItem);
      localStorage.setItem('cartItems', JSON.stringify(existing));
      window.dispatchEvent(new Event('cartUpdated'));
      setCartMessage(t('Added to cart!'));
      setCartSnackbar(true);
    } catch {
      setCartMessage('Unable to add to cart');
      setCartSnackbar(true);
    }
  };

  const handleOrder = () => {
    setOrderOpen(false);
    setOrderQty('');
    setOrderProduct('');
    setOrderSuccess(true);
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { from: 'vendor', text: chatInput }]);
      setTimeout(() => {
        setChatMessages(msgs => [...msgs, { from: 'supplier', text: 'Thank you for your message!' }]);
      }, 800);
      setChatInput('');
    }
  };

  if (loading) {
    return (
      <Box sx={gradientBg}>
        <CircularProgress sx={{ color: '#8bd3dd' }} />
      </Box>
    );
  }
  if (!supplier) {
    return (
      <Box sx={gradientBg}>
        <Typography variant="h5" color="#e5e7eb">Supplier not found.</Typography>
      </Box>
    );
  }

  const products = supplier.products?.length ? supplier.products : mockSuppliers[0].products;
  const reviews = supplier.reviews?.length ? supplier.reviews : mockSuppliers[0].reviews;

  return (
    <Box sx={gradientBg}>
      <Box sx={glassStyle}>
        <Avatar sx={{ bgcolor: '#ffffff', width: 80, height: 80, mx: 'auto', mb: 2 }}>
          {supplier.avatar}
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#e5e7eb', fontFamily: 'Montserrat, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {supplier.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 2 }}>
          <LocationOnIcon sx={{ color: '#ffd200', mr: 0.5 }} />
          <Typography variant="body1" sx={{ color: '#fff', opacity: 0.9 }}>
            {supplier.location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ color: '#ffd200', mr: 0.5 }} />
          <Typography variant="body1" sx={{ color: '#fff', opacity: 0.9 }}>
            {supplier.rating} / 5.0
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1, mt: 2 }}>
          Products
        </Typography>

        {/* Category filter */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
          {['All', ...Array.from(new Set(supplier.products.map(p => p.category)))].map(cat => (
            <Button key={cat} size="small" variant={category === cat ? 'contained' : 'outlined'} onClick={() => setCategory(cat)} sx={{ borderRadius: 10 }}>
              {cat}
            </Button>
          ))}
        </Box>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          {products
            .filter(p => category === 'All' || p.category === category)
            .map((p, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Paper elevation={4} sx={{ p: 2, borderRadius: 4, backgroundColor: '#ffffff', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)' }}>
                <img src={p.image || placeholderImg} alt={p.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', marginRight: 16, boxShadow: '0 2px 8px #00000011' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#185a9d', fontSize: '1.1rem' }}>{p.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>{p.category}</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 0.5, mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#333' }}>Price: ₹{p.price} / {p.unit}</Typography>
                    <Typography variant="body2" sx={{ color: '#333' }}>Stock: {p.stockKg} kg</Typography>
                    <Typography variant="body2" sx={{ color: '#333' }}>{t('Minimum order is')} {p.moqKg} kg</Typography>
                    <Typography variant="body2" sx={{ color: '#333' }}>Lead: {p.leadTimeDays} day(s)</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantities[p.name] || p.moqKg || ''}
                    onChange={e => handleQuantityChange(p, e.target.value)}
                    inputProps={{ min: p.moqKg || 1, max: p.stockKg || undefined }}
                    label={t('Quantity')}
                    sx={{ width: 110 }}
                  />
                  <Button size="small" variant="contained" onClick={() => handleAddToCart(p)}>
                    {t('Add to Cart')}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#185a9d',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.1rem',
            borderRadius: '2rem',
            boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
            '&:hover': {
              transform: 'scale(1.06) rotateY(-6deg)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backgroundColor: '#0f3f73',
            },
            mb: 3,
          }}
          onClick={() => setOrderOpen(true)}
        >
          Order from this Supplier
        </Button>
        <Dialog open={orderOpen} onClose={() => setOrderOpen(false)} PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            p: 2,
          }
        }}>
          <DialogTitle sx={{ fontWeight: 700, color: '#185a9d', fontFamily: 'Montserrat, sans-serif', textAlign: 'center', pb: 0 }}>
            Place Order
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1 }}>
            <TextField
              select
              label="Product"
              fullWidth
              value={orderProduct}
              onChange={e => setOrderProduct(e.target.value)}
              sx={{ mb: 2, background: '#f9fafb', borderRadius: 2 }}
            >
              {products.map((p, i) => (
                <MenuItem value={p.name} key={i}>{p.name} (₹{p.price}/{p.unit})</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              fullWidth
              value={orderQty}
              onChange={e => setOrderQty(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={!orderProduct}
              sx={{ background: '#f9fafb', borderRadius: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
            <Button onClick={() => setOrderOpen(false)} sx={{ color: '#185a9d', fontWeight: 600, borderRadius: 2 }}>Cancel</Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#185a9d',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                boxShadow: '0 2px 8px #185a9d33',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0f3f73',
                },
              }}
              onClick={handleOrder}
              disabled={!orderProduct || !orderQty}
            >
              Place Order
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={orderSuccess} autoHideDuration={3000} onClose={() => setOrderSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Order placed successfully!
          </Alert>
        </Snackbar>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2, mt: 2 }}>
          Reviews
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {reviews.map((r, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#185a9d' }}>{r.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ color: '#ffd200', fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#333', fontWeight: 600 }}>{r.rating} / 5</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#333' }}>{r.comment}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Floating Chat Button */}
      <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200, backgroundColor: '#185a9d' }} onClick={() => setChatOpen(true)}>
        <ChatIcon />
      </Fab>
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Chat with {supplier.name}</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 250, maxHeight: 350, overflowY: 'auto', background: '#f5f5f5' }}>
          <List>
            {chatMessages.map((msg, i) => (
              <ListItem key={i} sx={{ justifyContent: msg.from === 'vendor' ? 'flex-end' : 'flex-start' }}>
                <ListItemText
                  primary={msg.text}
                  sx={{
                    bgcolor: msg.from === 'vendor' ? '#43cea2' : '#fff',
                    color: msg.from === 'vendor' ? '#fff' : '#333',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    maxWidth: '70%',
                    textAlign: msg.from === 'vendor' ? 'right' : 'left',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendChat} color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogActions>
      </Dialog>
      <Snackbar open={cartSnackbar} autoHideDuration={3000} onClose={() => setCartSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {cartMessage || t('Added to cart!')}
        </Alert>
      </Snackbar>
    </Box>
  );
} 