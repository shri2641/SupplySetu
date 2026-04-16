import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Alert, Paper, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const leftPanelColor = 'var(--bg-gradient-start)';
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
      // Fallback to demo login if backend is unreachable (e.g. on Vercel without backend)
      if (err.message === 'Network Error' || err.code === 'ERR_CONNECTION_REFUSED' || err.code === 'ERR_NETWORK') {
        console.log('Backend unreachable, using demo login fallback');
        const demoUser = {
          name: isLogin ? 'Demo User' : form.name,
          email: form.email,
          role: form.role || 'vendor',
          phone: form.phone || '9999999999',
          location: form.location || 'Demo City'
        };
        localStorage.setItem('token', 'demo-token-12345');
        localStorage.setItem('user', JSON.stringify(demoUser));
        if (onAuth) onAuth(demoUser);
      } else {
        setError(err.response?.data?.error || err.message || 'Authentication failed');
      }
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
              <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', borderRadius: 3, px: 4, py: 1, fontWeight: 600, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'} }} onClick={() => { setIsLogin(true); setError(''); }}>Login</Button>
            </Box>
          </Fade>
        </Box>
        {/* Right Panel (Form) */}
        <Box sx={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="popLayout">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit} 
              style={{ width: '100%' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 320, mx: 'auto' }}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 800, color: '#185a9d' }}>
                  {isLogin ? t('Welcome Back') : t('Create Account')}
                </Typography>
              {!isLogin && (
                <>
                  <FormControl sx={{ mb: 1 }}>
                    <RadioGroup row name="role" value={form.role} onChange={handleChange} sx={{ justifyContent: 'center' }}>
                      <FormControlLabel value="vendor" control={<Radio sx={{ color: '#185a9d' }} />} label={t('Sign up as Vendor')} />
                      <FormControlLabel value="supplier" control={<Radio sx={{ color: '#43cea2' }} />} label={t('Sign up as Supplier')} />
                    </RadioGroup>
                  </FormControl>
                  <TextField name="name" label={t('Name')} value={form.name} onChange={handleChange} required fullWidth autoComplete="name" />
                  <TextField name="email" label={t('Email')} value={form.email} onChange={handleChange} type="email" required fullWidth autoComplete="email" />
                  <TextField name="phone" label={t('Phone')} value={form.phone} onChange={handleChange} required fullWidth autoComplete="tel" />
                  <TextField name="location" label={t('Location')} value={form.location} onChange={handleChange} required fullWidth autoComplete="address-level2" />
                  <TextField name="password" label={t('Password')} value={form.password} onChange={handleChange} type="password" required fullWidth autoComplete="new-password" />
                  <TextField name="confirmPassword" label={t('Re-enter Password')} value={form.confirmPassword} onChange={handleChange} type="password" required fullWidth autoComplete="new-password" />
                </>
              )}
              {isLogin && (
                <>
                  <TextField name="email" label={t('Email')} value={form.email} onChange={handleChange} type="email" required fullWidth autoComplete="email" />
                  <TextField name="password" label={t('Password')} value={form.password} onChange={handleChange} type="password" required fullWidth autoComplete="current-password" />
              </>
            )}
              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading} 
                sx={{ 
                  borderRadius: 3, 
                  fontWeight: 600, 
                  fontSize: '1.1rem', 
                  py: 1.5, 
                  mt: 1,
                  backgroundColor: rightPanelColor,
                  boxShadow: '0 4px 14px 0 rgba(24, 90, 157, 0.39)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(24, 90, 157, 0.23)',
                    backgroundColor: '#13477e'
                  }
                }}
              >
                {loading ? t('Please wait...') : isLogin ? t('Login') : t('Sign Up')}
              </Button>
            </Box>
          </motion.form>
        </AnimatePresence>
      </Box>
      </Paper>
    </Box>
  );
} 