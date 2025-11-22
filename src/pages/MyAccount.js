import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, Avatar, Paper, Chip, useTheme, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, IconButton, CardMedia } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTranslation } from 'react-i18next';

const getStoredJson = key => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function MyAccount() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useTranslation();

  const storedUser = useMemo(() => getStoredJson('user'), []);
  const storedProfile = useMemo(() => getStoredJson('userProfile'), []);
  // Merge profile with user, but always prioritize role from authenticated user
  const [profile, setProfile] = useState(() => {
    const merged = { ...storedProfile, ...storedUser };
    // Always use role from authenticated user, not from profile
    if (storedUser?.role) {
      merged.role = storedUser.role;
    }
    return merged || {};
  });
  const [isDialogOpen, setDialogOpen] = useState(!profile?.name);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || storedUser?.avatarUrl || '');
  const [form, setForm] = useState({
    name: profile?.name || storedUser?.name || '',
    email: profile?.email || storedUser?.email || '',
    phone: profile?.phone || storedUser?.phone || '',
    location: profile?.location || storedUser?.location || '',
    business: profile?.business || '',
    avatarUrl: profile?.avatarUrl || storedUser?.avatarUrl || '',
    // Always use role from authenticated user
    role: storedUser?.role || 'vendor',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'avatarUrl') {
      setAvatarPreview(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        setForm(prev => ({ ...prev, avatarUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarPreview('');
    setForm(prev => ({ ...prev, avatarUrl: '' }));
  };

  useEffect(() => {
    const currentAvatar = profile?.avatarUrl || storedUser?.avatarUrl || '';
    if (currentAvatar && !avatarPreview) {
      setAvatarPreview(currentAvatar);
    }
  }, [profile, storedUser]);

  // Sync role from authenticated user whenever it changes
  useEffect(() => {
    if (storedUser?.role && storedUser.role !== profile?.role) {
      setProfile(prev => ({ ...prev, role: storedUser.role }));
      setForm(prev => ({ ...prev, role: storedUser.role }));
    }
  }, [storedUser?.role]);

  const handleSave = () => {
    // Merge form data but preserve role from authenticated user
    const updated = { ...profile, ...form };
    // Always keep the role from authenticated user, don't allow it to be changed
    if (storedUser?.role) {
      updated.role = storedUser.role;
    }
    setProfile(updated);
    setAvatarPreview(form.avatarUrl);
    if (typeof window !== 'undefined') {
      // Save profile without role (role should only come from authenticated user)
      const profileToSave = { ...updated };
      // Don't save role in userProfile, it should always come from 'user'
      delete profileToSave.role;
      localStorage.setItem('userProfile', JSON.stringify(profileToSave));
      // Also update the user in localStorage if it exists (but keep role unchanged)
      const currentUser = getStoredJson('user');
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, avatarUrl: form.avatarUrl }));
      }
    }
    setDialogOpen(false);
  };

  const handleAddDetails = () => {
    setAvatarPreview(form.avatarUrl || profile?.avatarUrl || storedUser?.avatarUrl || '');
    setDialogOpen(true);
  };

  // Always use role from authenticated user, merge with profile for other details
  const user = { ...profile, role: storedUser?.role || profile?.role || 'vendor' };
  const isVendor = user?.role === 'vendor';
  const isSupplier = user?.role === 'supplier';
  const orders = [
    { id: 'o1', supplier: 'FreshMart', product: 'Tomatoes', qty: 10, status: 'Delivered' },
    { id: 'o2', supplier: 'VeggieHub', product: 'Carrots', qty: 5, status: 'Pending' },
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 5,
          p: { xs: 3, sm: 5 },
          background: isLight ? 'rgba(255,255,255,0.97)' : 'rgba(26, 26, 46, 0.97)',
          boxShadow: isLight
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.18)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Avatar
            src={avatarPreview || user?.avatarUrl}
            alt={user?.name}
            sx={{
              bgcolor: isSupplier 
                ? (isLight ? '#15803d' : '#34d399') 
                : (isLight ? '#185a9d' : '#8bd3dd'),
              width: 90,
              height: 90,
              mx: 'auto',
              fontSize: 40,
              boxShadow: isSupplier
                ? (isLight ? '0 2px 8px #15803d33' : '0 2px 8px #34d39955')
                : (isLight ? '0 2px 8px #185a9d33' : '0 2px 8px #8bd3dd55'),
            }}
          >
            {!avatarPreview && !user?.avatarUrl && (
              isSupplier ? (
                <StorefrontIcon fontSize="inherit" sx={{ color: 'white' }} />
              ) : (
                <ShoppingCartIcon fontSize="inherit" sx={{ color: 'white' }} />
              )
            )}
          </Avatar>
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: isLight ? '#15803d' : '#34d399',
              color: 'white',
              '&:hover': {
                bgcolor: isLight ? '#0f6a2d' : '#22c55e',
              },
              width: 32,
              height: 32,
            }}
            size="small"
          >
            <ImageIcon fontSize="small" />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </IconButton>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: isLight ? '#185a9d' : '#8bd3dd', fontFamily: 'Montserrat, sans-serif', mb: 1 }}>
          {user?.name || t('Profile incomplete')}
        </Typography>
        {user?.phone ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <PhoneIphoneIcon sx={{ color: isLight ? '#43cea2' : '#8bd3dd', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: isLight ? '#333' : '#eaeaea', fontWeight: 500 }}>{user.phone}</Typography>
          </Box>
        ) : (
          <Typography sx={{ color: isLight ? '#b45309' : '#fbbf24', fontWeight: 500, mb: 1 }}>
            {t('Add your contact details to complete profile')}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <BadgeIcon sx={{ color: '#f7971e', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: isLight ? '#333' : '#eaeaea', fontWeight: 500 }}>{t('Role')}: {t(user?.role || 'Not set')}</Typography>
        </Box>
        {user?.business && (
          <Typography variant="body2" sx={{ color: isLight ? '#4b5563' : '#cbd5f5', mb: 2 }}>
            {t('Business')}: {user.business}
          </Typography>
        )}
        <Button variant="contained" sx={{
          background: isLight
            ? undefined
            : undefined,
          backgroundColor: isLight ? '#185a9d' : '#8bd3dd',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 3,
          px: 3,
          boxShadow: isLight ? '0 2px 8px #43cea255' : '0 2px 8px #8bd3dd55',
          textTransform: 'none',
          '&:hover': {
            background: isLight
              ? undefined
              : undefined,
            backgroundColor: isLight ? '#0f3f73' : '#6dbbc5',
          },
          mt: 1
        }} onClick={handleAddDetails}>
          {user?.name ? t('Update Details') : t('Add Details')}
        </Button>
      </Paper>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 5,
          p: { xs: 2, sm: 3 },
          background: isLight ? 'rgba(255,255,255,0.93)' : 'rgba(26, 26, 46, 0.93)',
          boxShadow: isLight
            ? '0 4px 16px 0 rgba(31, 38, 135, 0.10)'
            : '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
          textAlign: 'left',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: isLight ? '#185a9d' : '#8bd3dd', fontWeight: 700, textAlign: 'center' }}>{t('Recent Orders')}</Typography>
        <List>
          {orders.map(o => (
            <React.Fragment key={o.id}>
              <ListItem divider sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isLight ? '#333' : '#eaeaea' }}>{t(o.product)} {t('from')} {t(o.supplier)}</Typography>
                  <Typography variant="body2" sx={{ color: isLight ? '#888' : '#b5b5b5' }}>{t('Qty')}: {o.qty}</Typography>
                </Box>
                <Chip
                  icon={o.status === 'Delivered' ? <LocalShippingIcon sx={{ color: isLight ? '#43cea2' : '#8bd3dd' }} /> : <PendingActionsIcon sx={{ color: '#f7971e' }} />}
                  label={t(o.status)}
                  sx={{
                    bgcolor: o.status === 'Delivered' ? (isLight ? '#e0f7fa' : '#1a1a2e') : (isLight ? '#fffde7' : '#2a2a40'),
                    color: o.status === 'Delivered' ? (isLight ? '#00796b' : '#8bd3dd') : (isLight ? '#b26a00' : '#f7971e'),
                    fontWeight: 600,
                    px: 1.5,
                  }}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{user?.name ? t('Update your details') : t('Add your details')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Profile Picture Upload Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatarPreview}
                  alt="Profile"
                  sx={{
                    bgcolor: isSupplier 
                      ? (isLight ? '#15803d' : '#34d399') 
                      : (isLight ? '#185a9d' : '#8bd3dd'),
                    width: 120,
                    height: 120,
                    fontSize: 50,
                    boxShadow: isSupplier
                      ? (isLight ? '0 4px 12px #15803d33' : '0 4px 12px #34d39955')
                      : (isLight ? '0 4px 12px #185a9d33' : '0 4px 12px #8bd3dd55'),
                  }}
                >
                  {!avatarPreview && (
                    isSupplier ? (
                      <StorefrontIcon fontSize="inherit" sx={{ color: 'white' }} />
                    ) : (
                      <ShoppingCartIcon fontSize="inherit" sx={{ color: 'white' }} />
                    )
                  )}
                </Avatar>
                {avatarPreview && (
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'error.main',
                      color: 'white',
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: 'error.dark' }
                    }}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, width: '100%', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{ flexGrow: 1 }}
                >
                  {t('Choose from Device')}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {t('Or enter image URL below')}
              </Typography>
            </Box>

            <TextField label={t('Full Name')} name="name" value={form.name} onChange={handleChange} required />
            <TextField label={t('Email')} name="email" type="email" value={form.email} onChange={handleChange} required disabled />
            <TextField label={t('Phone')} name="phone" value={form.phone} onChange={handleChange} required />
            <TextField label={t('Location')} name="location" value={form.location} onChange={handleChange} />
            <TextField label={t('Business / Organization')} name="business" value={form.business} onChange={handleChange} />
            <TextField 
              label={t('Role')} 
              name="role" 
              value={form.role} 
              disabled 
              helperText={t('Role cannot be changed. It is determined by your account type.')}
            />
            <TextField 
              label={t('Profile picture URL')} 
              name="avatarUrl" 
              value={form.avatarUrl} 
              onChange={handleChange} 
              placeholder="https://…" 
              helperText={t('Enter image URL if you prefer not to upload from device')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('Cancel')}</Button>
          <Button variant="contained" onClick={handleSave}>{t('Save')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 