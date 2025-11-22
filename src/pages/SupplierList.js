import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Avatar, Button, CircularProgress, Alert, Chip, Tooltip, Paper, TextField, InputAdornment, List, ListItem, ListItemText, Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, MenuItem, Select, FormControl, InputLabel, CardMedia } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PinDropIcon from '@mui/icons-material/PinDrop';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import CategoryGrid from '../components/CategoryGrid';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noData, setNoData] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', pincode: '', rating: '' });
  const [supplierSetupForm, setSupplierSetupForm] = useState({ name: '', location: '', pincode: '', rating: '4.0' });
  const [search, setSearch] = useState({ location: '', pincode: '' });
  const [submitting, setSubmitting] = useState(false);
  const [settingUpSupplier, setSettingUpSupplier] = useState(false);
  const formInitializedRef = useRef(false);
  const navigate = useNavigate();
  const locationHook = useLocation();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useTranslation();
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const parsedUser = storedUser ? (() => { try { return JSON.parse(storedUser); } catch { return null; } })() : null;
  const isVendor = parsedUser?.role === 'vendor';
  const isSupplier = parsedUser?.role === 'supplier';

  const seedAttemptedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const loc = params.get('location') || '';
    const pin = params.get('pincode') || '';
    if (loc || pin) {
      setSearch({ location: loc, pincode: pin });
      fetchSuppliers({ location: loc || undefined, pincode: pin || undefined });
    } else {
      fetchSuppliers();
    }
  }, [locationHook.search]);

  const fetchSuppliers = async (filters = {}) => {
    setLoading(true);
    try {
      let res = await api.get('/api/suppliers', { params: filters });
      let data = res.data;
      if ((!data || data.length === 0) && !seedAttemptedRef.current) {
        seedAttemptedRef.current = true;
        await api.post('/api/demo-seed');
        res = await api.get('/api/suppliers', { params: filters });
        data = res.data;
      }
      setSuppliers(data);
      setNoData(!data || data.length === 0);
      setError('');
    } catch (err) {
      // Fallback to mock data if backend is unavailable
      setSuppliers([]);
      setNoData(false);
      setError(t('Failed to fetch suppliers'));
    }
    setLoading(false);
  };

  const handleViewSupplier = supplier => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedSupplier', JSON.stringify(supplier));
    }
    navigate(`/supplier/${supplier._id}`);
  };

  const handleDelete = async (id) => {
    if (isVendor) return;
    try {
      await api.delete(`/api/suppliers/${id}`);
      setSuppliers(prev => {
        const updated = prev.filter(s => s._id !== id);
        setNoData(updated.length === 0);
        return updated;
      });
    } catch (err) {
      setError(t('Failed to delete supplier'));
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSearchChange = e => {
    const { name, value } = e.target;
    setSearch(s => ({ ...s, [name]: value }));
  };

  const handleSearch = () => {
    fetchSuppliers({
      location: search.location || undefined,
      pincode: search.pincode || undefined,
    });
  };

  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', unit: 'kg', stockKg: '', moqKg: '', leadTimeDays: '1', image: '' });
  const [categories, setCategories] = useState(['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Beverages']);
  const [newCategory, setNewCategory] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categoryDeleteConfirmOpen, setCategoryDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const ownedSupplier = useMemo(() => {
    if (!isSupplier || !parsedUser) return null;
    return suppliers.find(s => s.phone === parsedUser.phone || s.name === parsedUser.name);
  }, [isSupplier, parsedUser, suppliers]);

  const updateSupplierInState = updated => {
    setSuppliers(prev => prev.map(s => (s._id === updated._id ? updated : s)));
  };

  const handleProductFormChange = e => {
    const { name, value } = e.target;
    setProductForm(f => ({ ...f, [name]: value }));
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    if (!ownedSupplier) return;
    
    if (!productForm.name || !productForm.category || !productForm.price) {
      setError(t('Please fill in all required fields'));
      return;
    }

    try {
      const body = {
        ...productForm,
        price: parseFloat(productForm.price),
        stockKg: parseFloat(productForm.stockKg) || 0,
        moqKg: parseFloat(productForm.moqKg) || 0,
        leadTimeDays: parseInt(productForm.leadTimeDays, 10) || 1,
      };

      let res;
      if (editingProduct) {
        // Update existing product
        res = await api.patch(`/api/suppliers/${ownedSupplier._id}/products/${encodeURIComponent(editingProduct.name)}`, body);
      } else {
        // Add new product
        res = await api.post(`/api/suppliers/${ownedSupplier._id}/products`, body);
      }
      
      updateSupplierInState(res.data);
      setProductForm({ name: '', category: '', price: '', unit: 'kg', stockKg: '', moqKg: '', leadTimeDays: '1', image: '' });
      setImagePreview('');
      setEditingProduct(null);
      setError('');
    } catch (err) {
      setError(t(err.response?.data?.error || `Failed to ${editingProduct ? 'update' : 'add'} product`));
    }
  };


  const handleDeleteProduct = async product => {
    if (!ownedSupplier) return;
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!ownedSupplier || !productToDelete) return;
    try {
      const res = await api.delete(`/api/suppliers/${ownedSupplier._id}/products/${encodeURIComponent(productToDelete.name)}`);
      updateSupplierInState(res.data);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      setError('');
    } catch (err) {
      setError(t(err.response?.data?.error || 'Failed to delete product'));
      setDeleteConfirmOpen(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('Image size should be less than 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setProductForm(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setError('');
    } else if (categories.includes(newCategory.trim())) {
      setError(t('Category already exists'));
    }
  };

  const handleDeleteCategory = (category) => {
    if (ownedSupplier?.products?.some(p => p.category === category)) {
      setError(t('Cannot delete category') + ` "${category}" ` + t('as it has products. Please delete or move products first.'));
      return;
    }
    setCategoryToDelete(category);
    setCategoryDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c !== categoryToDelete));
      setCategoryDeleteConfirmOpen(false);
      setCategoryToDelete('');
      setError('');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      unit: product.unit || 'kg',
      stockKg: product.stockKg?.toString() || '',
      moqKg: product.moqKg?.toString() || '',
      leadTimeDays: product.leadTimeDays?.toString() || '1',
      image: product.image || ''
    });
    setImagePreview(product.image || '');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: '', price: '', unit: 'kg', stockKg: '', moqKg: '', leadTimeDays: '1', image: '' });
    setImagePreview('');
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/api/suppliers', {
        name: form.name,
        location: form.location,
        pincode: form.pincode,
        rating: parseFloat(form.rating),
      });
      setSuppliers(suppliers => {
        const updated = [...suppliers, res.data];
        setNoData(updated.length === 0);
        return updated;
      });
      setForm({ name: '', location: '', pincode: '', rating: '' });
      setError('');
    } catch (err) {
      setError(t('Failed to register supplier'));
    }
    setSubmitting(false);
  };

  const handleSupplierSetup = async e => {
    e.preventDefault();
    setSettingUpSupplier(true);
    setError('');
    try {
      const res = await api.post('/api/suppliers', {
        name: supplierSetupForm.name || parsedUser?.name || '',
        location: supplierSetupForm.location,
        pincode: supplierSetupForm.pincode || '',
        rating: parseFloat(supplierSetupForm.rating) || 4.0,
        phone: parsedUser?.phone || '',
      });
      // Refresh suppliers list to include the new one
      await fetchSuppliers();
      setSettingUpSupplier(false);
      // Reset form initialization flag so form can be reused if needed
      formInitializedRef.current = false;
    } catch (err) {
      setError(t(err.response?.data?.error || 'Failed to create supplier record'));
      setSettingUpSupplier(false);
    }
  };

  const handleSupplierSetupChange = e => {
    const { name, value } = e.target;
    setSupplierSetupForm(f => ({ ...f, [name]: value }));
  };

  // Initialize form only once when user is supplier without supplier record
  useEffect(() => {
    if (isSupplier && parsedUser && !ownedSupplier && !formInitializedRef.current) {
      // Pre-fill form with user data (only name, location should be entered manually)
      // Only initialize if form is completely empty
      setSupplierSetupForm(prev => {
        if (prev.name === '' && prev.location === '' && prev.pincode === '' && prev.rating === '4.0') {
          return {
            name: parsedUser.name || '',
            location: '',
            pincode: '',
            rating: '4.0',
          };
        }
        return prev; // Keep existing values if user has started typing
      });
      formInitializedRef.current = true;
    }
  }, [isSupplier, parsedUser?.name, ownedSupplier]); // Include ownedSupplier to reset when supplier is created

  if (loading) return <Box p={2}><CircularProgress /></Box>;
  if (error) return <Box p={2}><Alert severity="error">{error}</Alert></Box>;

  const vegImages = [
    { src: 'https://cdn-icons-png.flaticon.com/512/415/415733.png', alt: 'Tomato' },
    { src: 'https://cdn-icons-png.flaticon.com/512/415/415734.png', alt: 'Onion' },
    { src: 'https://cdn-icons-png.flaticon.com/512/415/415735.png', alt: 'Carrot' },
    { src: 'https://cdn-icons-png.flaticon.com/512/415/415736.png', alt: 'Broccoli' },
    { src: 'https://cdn-icons-png.flaticon.com/512/415/415737.png', alt: 'Potato' },
  ];

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
        {isSupplier ? t('Manage Inventory') : t('Suppliers')}
      </Typography>

      {!isSupplier && <CategoryGrid />}

      {/* Search Bar */}
      <Paper sx={{ maxWidth: 800, mx: 'auto', mb: 3, p: 2, borderRadius: 3, background: isLight ? '#fff' : '#1a1a2e', display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          name="location"
          value={search.location}
          onChange={handleSearchChange}
          placeholder={t('Search by city/area')}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: isLight ? '#185a9d' : '#8bd3dd' }} />
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
          size="small"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PinDropIcon sx={{ color: isLight ? '#185a9d' : '#8bd3dd' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={handleSearch}>{t('Search')}</Button>
      </Paper>

      {!isVendor && !isSupplier && (
        <Paper sx={{ maxWidth: 400, mx: 'auto', mb: 4, p: 3, borderRadius: 3, background: isLight ? '#fff' : '#1a1a2e' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{t('Register as Supplier')}</Typography>
          <form onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder={t('Name')} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="location" value={form.location} onChange={handleFormChange} placeholder={t('Location')} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="pincode" value={form.pincode} onChange={handleFormChange} placeholder={t('Pincode')} required pattern="[0-9]*" inputMode="numeric" maxLength={6} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="rating" value={form.rating} onChange={handleFormChange} placeholder={t('Rating')} type="number" min="0" max="5" step="0.1" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? t('Registering...') : t('Register')}
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          </form>
        </Paper>
      )}
      {noData && (
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          <Alert severity="info">{t('No suppliers found yet. Register a supplier to get started.')}</Alert>
        </Box>
      )}

      {error && (
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 2 }}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Box>
      )}

      {!isSupplier ? (
        <Grid container spacing={4} justifyContent="center">
          {suppliers.map(s => (
            <Grid item xs={12} sm={6} md={4} key={s._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 4,
                  backgroundColor: isLight ? '#ffffff' : '#111827',
                  boxShadow: isLight
                    ? '0 4px 24px 0 rgba(31, 38, 135, 0.10)'
                    : '0 4px 24px 0 rgba(139, 211, 221, 0.10)',
                  transition: '0.2s',
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'scale(1.04) rotateY(-3deg)',
                    backgroundColor: isLight ? '#f9fafb' : '#0f172a',
                  },
                }}
                onClick={() => handleViewSupplier(s)}
              >
                <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: isLight ? '#185a9d' : '#8bd3dd',
                      width: 64,
                      height: 64,
                      fontSize: 32,
                      mx: 'auto',
                      mb: 1.5,
                      boxShadow: isLight ? '0 2px 8px #43cea255' : '0 2px 8px #8bd3dd55',
                    }}
                  >
                    {s.name[0]}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: isLight ? '#333' : '#eaeaea', mb: 0.5 }}>{s.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                    <LocationOnIcon sx={{ color: '#f7971e', fontSize: 20, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">{t(s.location)}</Typography>
                  </Box>
                  {s.pincode && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <PinDropIcon sx={{ color: isLight ? '#185a9d' : '#8bd3dd', fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">{s.pincode}</Typography>
                    </Box>
                  )}
                  <Tooltip title={t('Supplier Rating')} arrow>
                    <Chip
                      icon={<StarIcon sx={{ color: '#ffd600' }} />}
                      label={s.rating}
                      sx={{ bgcolor: isLight ? '#fffde7' : '#2a2a40', color: isLight ? '#7b3f00' : '#f7971e', fontWeight: 600, fontSize: 16, px: 1.5, mb: 1 }}
                    />
                  </Tooltip>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{
                      backgroundColor: isLight ? '#185a9d' : '#8bd3dd',
                      color: '#fff',
                      borderRadius: 3,
                      fontWeight: 600,
                      px: 3,
                      boxShadow: isLight ? '0 2px 8px #43cea255' : '0 2px 8px #8bd3dd55',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: isLight ? '#0f3f73' : '#6dbbc5',
                      },
                    }}
                    onClick={e => { e.stopPropagation(); handleViewSupplier(s); }}
                  >
                    {t('View Profile')}
                  </Button>
                  {!isVendor && (
                    <Button
                      size="medium"
                      variant="outlined"
                      color="error"
                      onClick={e => { e.stopPropagation(); handleDelete(s._id); }}
                    >
                      {t('Delete')}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {!ownedSupplier ? (
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 4, background: isLight ? '#fff' : '#1a1a2e', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: isLight ? '#185a9d' : '#8bd3dd' }}>
                  {t('Set Up Your Supplier Profile')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                  {t('Create your supplier profile to start managing your inventory')}
                </Typography>
                <form onSubmit={handleSupplierSetup}>
                  <Stack spacing={3} sx={{ maxWidth: 500, mx: 'auto' }}>
                    <TextField
                      label={t('Supplier Name')}
                      name="name"
                      value={supplierSetupForm.name}
                      onChange={handleSupplierSetupChange}
                      required
                      fullWidth
                      helperText={t('Your business or supplier name')}
                    />
                    <TextField
                      label={t('Location')}
                      name="location"
                      value={supplierSetupForm.location || ''}
                      onChange={handleSupplierSetupChange}
                      required
                      fullWidth
                      disabled={settingUpSupplier}
                      helperText={t('City or area where you operate')}
                    />
                    <TextField
                      label={t('Pincode')}
                      name="pincode"
                      value={supplierSetupForm.pincode || ''}
                      onChange={handleSupplierSetupChange}
                      fullWidth
                      disabled={settingUpSupplier}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
                      helperText={t('Optional: Your service area pincode')}
                    />
                    <TextField
                      label={t('Initial Rating')}
                      name="rating"
                      type="number"
                      value={supplierSetupForm.rating}
                      onChange={handleSupplierSetupChange}
                      fullWidth
                      inputProps={{ min: 0, max: 5, step: 0.1 }}
                      helperText={t('Starting rating (0-5)')}
                    />
                    {error && (
                      <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={settingUpSupplier}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        backgroundColor: isLight ? '#15803d' : '#34d399',
                        '&:hover': {
                          backgroundColor: isLight ? '#0f6a2d' : '#22c55e',
                        }
                      }}
                    >
                      {settingUpSupplier ? t('Creating...') : t('Create Supplier Profile')}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          ) : (
            <>
              {/* Category Management */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4, mb: 3, background: isLight ? '#fff' : '#1a1a2e' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{t('Manage Categories')}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        onDelete={() => handleDeleteCategory(cat)}
                        deleteIcon={<DeleteIcon />}
                        sx={{
                          bgcolor: isLight ? 'rgba(21,128,61,0.1)' : 'rgba(34,197,94,0.2)',
                          color: isLight ? '#15803d' : '#34d399',
                          fontWeight: 600,
                          '& .MuiChip-deleteIcon': {
                            color: isLight ? '#15803d' : '#34d399',
                          }
                        }}
                      />
                    ))}
                  </Stack>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder={t('Add new category')}
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button variant="contained" onClick={handleAddCategory} startIcon={<AddIcon />}>
                      {t('Add Category')}
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Add/Edit Product Form */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, borderRadius: 4, background: isLight ? '#fff' : '#1a1a2e' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {editingProduct ? t('Edit Product') : t('Add New Product')}
                  </Typography>
                  {editingProduct && (
                    <Button size="small" onClick={handleCancelEdit} sx={{ mb: 2 }}>
                      {t('Cancel Edit')}
                    </Button>
                  )}
                  <form onSubmit={handleAddProduct}>
                  <Stack spacing={2}>
                      <TextField
                        label={t('Product Name')}
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                        fullWidth
                      />
                      <FormControl fullWidth required>
                        <InputLabel>{t('Category')}</InputLabel>
                        <Select
                          name="category"
                          value={productForm.category}
                          onChange={handleProductFormChange}
                          label={t('Category')}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            label={t('Price')}
                            name="price"
                            type="number"
                            value={productForm.price}
                            onChange={handleProductFormChange}
                            required
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label={t('Unit')}
                            name="unit"
                            value={productForm.unit}
                            onChange={handleProductFormChange}
                            fullWidth
                            select
                          >
                            <MenuItem value="kg">kg</MenuItem>
                            <MenuItem value="g">g</MenuItem>
                            <MenuItem value="piece">piece</MenuItem>
                            <MenuItem value="pack">pack</MenuItem>
                            <MenuItem value="bunch">bunch</MenuItem>
                            <MenuItem value="liter">liter</MenuItem>
                          </TextField>
                        </Grid>
                        </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            label={t('Stock Quantity')}
                            name="stockKg"
                            type="number"
                            value={productForm.stockKg}
                            onChange={handleProductFormChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label={t('Min Order Qty')}
                            name="moqKg"
                            type="number"
                            value={productForm.moqKg}
                            onChange={handleProductFormChange}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        label={t('Lead Time (days)')}
                        name="leadTimeDays"
                        type="number"
                        value={productForm.leadTimeDays}
                        onChange={handleProductFormChange}
                        fullWidth
                      />
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>{t('Product Image')}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            size="small"
                          >
                            {t('Upload Image')}
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </Button>
                          <TextField
                            size="small"
                            placeholder={t('Or enter image URL')}
                            name="image"
                            value={productForm.image}
                            onChange={(e) => {
                              setProductForm(prev => ({ ...prev, image: e.target.value }));
                              setImagePreview(e.target.value);
                            }}
                            fullWidth
                          />
                        </Box>
                        {imagePreview && (
                          <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                            <CardMedia
                              component="img"
                              image={imagePreview}
                              alt="Preview"
                              sx={{
                                width: 150,
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: 2,
                                border: `2px solid ${isLight ? '#15803d' : '#34d399'}`
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => {
                                setImagePreview('');
                                setProductForm(prev => ({ ...prev, image: '' }));
                              }}
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                          py: 1.5,
                          fontWeight: 600,
                          backgroundColor: isLight ? '#15803d' : '#34d399',
                          '&:hover': {
                            backgroundColor: isLight ? '#0f6a2d' : '#22c55e',
                          }
                        }}
                      >
                        {editingProduct ? t('Update Product') : t('Add Product')}
                      </Button>
                    </Stack>
                    </form>
                </Paper>
              </Grid>

              {/* Products List */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, borderRadius: 4, background: isLight ? '#fff' : '#1a1a2e' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {t('My Products')} ({ownedSupplier.products?.length || 0})
                  </Typography>
                  {!ownedSupplier.products?.length ? (
                    <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      {t('No products yet. Add your first product above.')}
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {ownedSupplier.products?.map((product) => (
                        <Grid item xs={12} sm={6} key={product.name}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              overflow: 'hidden',
                              border: `1px solid ${isLight ? 'rgba(21,128,61,0.2)' : 'rgba(52,211,153,0.3)'}`,
                              '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s'
                              }
                            }}
                          >
                            {product.image && (
                              <CardMedia
                                component="img"
                                height="140"
                                image={product.image}
                                alt={product.name}
                                sx={{ objectFit: 'cover' }}
                              />
                            )}
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                {product.name}
                              </Typography>
                              <Chip
                                label={product.category}
                                  size="small"
                                sx={{
                                  mb: 1,
                                  bgcolor: isLight ? 'rgba(21,128,61,0.1)' : 'rgba(34,197,94,0.2)',
                                  color: isLight ? '#15803d' : '#34d399'
                                }}
                              />
                              <Stack spacing={1} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">{t('Price')}:</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    ₹{product.price}/{product.unit || 'kg'}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">{t('Stock')}:</Typography>
                                  <Typography variant="body2">{product.stockKg || 0} {product.unit || 'kg'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">{t('MOQ')}:</Typography>
                                  <Typography variant="body2">{product.moqKg || 0} {product.unit || 'kg'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">{t('Lead Time')}:</Typography>
                                  <Typography variant="body2">{product.leadTimeDays || 1} {t('days')}</Typography>
                              </Box>
                              </Stack>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditProduct(product)}
                              >
                                {t('Edit')}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteProduct(product)}
                              >
                                {t('Delete')}
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>

              {/* Delete Confirmation Dialog */}
              <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>{t('Delete Product')}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t('Are you sure you want to delete')} "{productToDelete?.name}"? {t('This action cannot be undone.')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDeleteConfirmOpen(false)}>{t('Cancel')}</Button>
                  <Button onClick={confirmDeleteProduct} color="error" variant="contained">
                    {t('Delete')}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Category Delete Confirmation Dialog */}
              <Dialog open={categoryDeleteConfirmOpen} onClose={() => setCategoryDeleteConfirmOpen(false)}>
                <DialogTitle>{t('Delete Category')}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t('Are you sure you want to delete the category')} "{categoryToDelete}"? {t('This action cannot be undone.')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setCategoryDeleteConfirmOpen(false)}>{t('Cancel')}</Button>
                  <Button onClick={confirmDeleteCategory} color="error" variant="contained">
                    {t('Delete')}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
} 