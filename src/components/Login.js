import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Alert, Paper, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

const leftPanelColor = '#f7f7f9';
const rightPanelColor = '#185a9d';

export default function Login({ onAuth }) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', password: '', confirmPassword: '', role: 'vendor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      if (isLogin) {
        const res = await api.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (onAuth) onAuth(res.data.user);
    } else {
        await api.post('/api/auth/register', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          password: form.password,
          role: form.role,
        });
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Authentication error', err);
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: leftPanelColor }}>
      <Paper elevation={8} sx={{ display: 'flex', minWidth: 700, minHeight: 480, borderRadius: 5, overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
        {/* Left Panel */}
    <Box sx={{
          width: 320,
          backgroundColor: rightPanelColor,
          color: '#fff',
              display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
              justifyContent: 'center', 
          p: 4,
        }}>
          <Fade in={isLogin} timeout={500} unmountOnExit>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Pacifico, cursive', letterSpacing: 1 }}>Welcome Back!</Typography>
              <Typography variant="body1" sx={{ mb: 3, fontWeight: 400 }}>To keep connected with us please login with your personal info</Typography>
              <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', borderRadius: 3, px: 4, py: 1, fontWeight: 600 }} onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</Button>
            </Box>
          </Fade>
          <Fade in={!isLogin} timeout={500} unmountOnExit>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Pacifico, cursive', letterSpacing: 1 }}>Hello, Friend!</Typography>
              <Typography variant="body1" sx={{ mb: 3, fontWeight: 400 }}>Enter your details and start your journey with us</Typography>
              <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', borderRadius: 3, px: 4, py: 1, fontWeight: 600 }} onClick={() => { setIsLogin(true); setError(''); }}>Login</Button>
            </Box>
          </Fade>
        </Box>
        {/* Right Panel (Form) */}
        <Box sx={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 320, mx: 'auto' }}>
              <Typography variant="h5" sx={{ mb: 1, textAlign: 'center', fontWeight: 700, color: '#185a9d' }}>
                {isLogin ? t('Login') : t('Sign Up')}
              </Typography>
              {!isLogin && (
                <>
                  <FormControl sx={{ mb: 1 }}>
                    <RadioGroup row name="role" value={form.role} onChange={handleChange} sx={{ justifyContent: 'center' }}>
                      <FormControlLabel value="vendor" control={<Radio sx={{ color: '#185a9d' }} />} label={t('Sign up as Vendor')} />
                      <FormControlLabel value="supplier" control={<Radio sx={{ color: '#43cea2' }} />} label={t('Sign up as Supplier')} />
                    </RadioGroup>
                  </FormControl>
                  <TextField name="name" label={t('Name')} value={form.name} onChange={handleChange} required fullWidth />
                  <TextField name="email" label={t('Email')} value={form.email} onChange={handleChange} type="email" required fullWidth />
                  <TextField name="phone" label={t('Phone')} value={form.phone} onChange={handleChange} required fullWidth />
                  <TextField name="location" label={t('Location')} value={form.location} onChange={handleChange} required fullWidth />
                  <TextField name="password" label={t('Password')} value={form.password} onChange={handleChange} type="password" required fullWidth />
                  <TextField name="confirmPassword" label={t('Re-enter Password')} value={form.confirmPassword} onChange={handleChange} type="password" required fullWidth />
                </>
              )}
              {isLogin && (
                <>
                  <TextField name="email" label={t('Email')} value={form.email} onChange={handleChange} type="email" required fullWidth />
                  <TextField name="password" label={t('Password')} value={form.password} onChange={handleChange} type="password" required fullWidth />
              </>
            )}
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" disabled={loading} sx={{ borderRadius: 3, fontWeight: 600, fontSize: '1.1rem', py: 1.2, backgroundColor: rightPanelColor }}>
                {loading ? t('Please wait...') : isLogin ? t('Login') : t('Sign Up')}
              </Button>
            </Box>
          </form>
      </Box>
      </Paper>
    </Box>
  );
} 