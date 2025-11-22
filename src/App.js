import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, BottomNavigation, BottomNavigationAction, Paper, Card, CardContent, CardActions, Avatar as MuiAvatar, List, ListItem, ListItemAvatar, ListItemText, Divider, ThemeProvider, createTheme, useTheme, IconButton, CssBaseline, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import Landing from './components/Landing';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Login from './components/Login';
import SupplierProfile from './components/SupplierProfile';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import '@fontsource/pacifico';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import About from './pages/About';
import SupplierList from './pages/SupplierList';
import MyAccount from './pages/MyAccount';
import Vendors from './pages/Vendors';
import MyOrders from './pages/MyOrders';
import SupplierReviews from './pages/SupplierReviews';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Contact from './pages/Contact';
import LogoutButton from './components/LogoutButton';
import CartDrawer from './components/CartDrawer';

function LanguageSelector({ language, setLanguage }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  return (
    <Select
      value={language}
      onChange={e => {
        setLanguage(e.target.value);
        i18n.changeLanguage(e.target.value);
      }}
      size="small"
      sx={{ 
        ml: 2, 
        color: isLight ? '#15803d' : '#22c55e',
        backgroundColor: isLight ? 'rgba(21,128,61,0.08)' : 'rgba(34, 197, 94, 0.15)',
        borderRadius: '12px',
        border: 'none',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSelect-icon': {
          color: isLight ? '#15803d' : '#22c55e',
        },
        '& .MuiSelect-select': {
          padding: '8px 12px',
          fontWeight: 500,
        }
      }}
    >
      <MenuItem value="en" sx={{ color: isLight ? '#15803d' : '#22c55e' }}>English</MenuItem>
      <MenuItem value="hi" sx={{ color: isLight ? '#15803d' : '#22c55e' }}>हिन्दी</MenuItem>
      <MenuItem value="bn" sx={{ color: isLight ? '#15803d' : '#22c55e' }}>বাংলা</MenuItem>
      <MenuItem value="ta" sx={{ color: isLight ? '#15803d' : '#22c55e' }}>தமிழ்</MenuItem>
      <MenuItem value="mr" sx={{ color: isLight ? '#15803d' : '#22c55e' }}>मराठी</MenuItem>
      {/* Add more languages here */}
    </Select>
  );
}

const getCartItems = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

function App() {
  const [language, setLanguage] = useState('en');
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(location.pathname);
  const [mode, setMode] = useState('light');
  const isBrowser = typeof window !== 'undefined';
  const [user, setUser] = useState(getStoredUser);
  const parsedUser = React.useMemo(
    () => user ?? (isBrowser ? getStoredUser() : null),
    [user, isBrowser]
  );
  const userRole = parsedUser?.role;
  const isVendor = userRole === 'vendor';
  const isSupplier = userRole === 'supplier';
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!isBrowser) return false;
    return Boolean(localStorage.getItem('token'));
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(getCartItems());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCartItems());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', handleCartUpdate);
      return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }
    return undefined;
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f5fff7',
                  paper: '#ffffff',
                },
                primary: { main: '#15803d' },
                secondary: { main: '#22c55e' },
                text: { primary: '#0f172a', secondary: '#4d7c57' },
              }
            : {
                background: {
                  default: '#041109',
                  paper: '#0b1a12',
                },
                primary: { main: '#22c55e' },
                secondary: { main: '#34d399' },
                text: { primary: '#f1fff0', secondary: '#a7f3d0' },
                divider: 'rgba(34, 197, 94, 0.2)',
              }),
        },
        typography: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          h1: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
          },
          h2: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
          },
          h3: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
          },
          h4: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
          },
          h5: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
          h6: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
          body1: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
          },
          body2: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    setNavValue(location.pathname);
  }, [location.pathname]);

  const handleAuthSuccess = authUser => {
    setUser(authUser);
    if (isBrowser && authUser) {
      try {
        localStorage.setItem('user', JSON.stringify(authUser));
      } catch {
        // ignore storage errors
      }
    }
    setIsAuthenticated(true);
    setNavValue('/suppliers');
    navigate('/suppliers', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setNavValue('/login');
    navigate('/login', { replace: true });
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onAuth={handleAuthSuccess} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
              <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: mode === 'light' 
              ? '#ffffff' 
              : '#111827',
            borderBottom: mode === 'light' 
              ? '1px solid rgba(21,128,61,0.12)' 
              : '1px solid rgba(52, 211, 153, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
        <Toolbar sx={{ 
          justifyContent: 'center', 
          minHeight: '70px',
          px: { xs: 2, sm: 4 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}>
            <RestaurantMenuIcon sx={{ 
              fontSize: 40, 
              color: mode === 'light' ? '#15803d' : '#22c55e', 
              mb: 0.5,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Pacifico, cursive',
                color: mode === 'light' ? '#15803d' : '#22c55e',
                fontWeight: 700,
                letterSpacing: 1.5,
                textShadow: mode === 'light' 
                  ? '0 2px 8px rgba(21, 128, 61, 0.25)' 
                  : '0 2px 8px rgba(34, 197, 94, 0.35)',
              }}
            >
              SupplySetu
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            right: { xs: 16, sm: 32 }, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}>
            <IconButton 
              sx={{ 
                color: mode === 'light' ? '#15803d' : '#22c55e',
                backgroundColor: mode === 'light' ? 'rgba(21,128,61,0.08)' : 'rgba(34,197,94,0.15)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: mode === 'light' ? 'rgba(21,128,61,0.15)' : 'rgba(52, 211, 153, 0.25)',
                  transform: 'scale(1.1)'
                }
              }} 
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <LanguageSelector language={language} setLanguage={setLanguage} />
            {!isSupplier && (
              <IconButton
                sx={{
                  color: mode === 'light' ? '#15803d' : '#22c55e',
                  backgroundColor: mode === 'light' ? 'rgba(21,128,61,0.08)' : 'rgba(34,197,94,0.15)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? 'rgba(21,128,61,0.15)' : 'rgba(52, 211, 153, 0.25)',
                    transform: 'scale(1.08)',
                  },
                }}
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            {isAuthenticated && <LogoutButton onLogout={handleLogout} />}
          </Box>
        </Toolbar>
      </AppBar>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/reviews" element={<SupplierReviews />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/login" element={<Navigate to="/suppliers" replace />} />
            <Route path="/supplier/:id" element={<SupplierProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1201,
          backgroundColor: mode === 'light' 
            ? '#ffffff' 
            : '#0b1a12',
          borderTop: mode === 'light' 
            ? '1px solid rgba(21,128,61,0.12)' 
            : '1px solid rgba(52, 211, 153, 0.3)',
          backdropFilter: 'blur(10px)',
        }} 
        elevation={0}
      >
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(e, newValue) => {
            setNavValue(newValue);
            navigate(newValue);
          }}
          sx={{
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              color: mode === 'light' ? 'rgba(21, 128, 61, 0.7)' : 'rgba(52, 211, 153, 0.7)',
              '&.Mui-selected': {
                color: mode === 'light' ? '#15803d' : '#34d399',
              },
              '&:hover': {
                color: mode === 'light' ? '#15803d' : '#34d399',
                backgroundColor: mode === 'light' ? 'rgba(21,128,61,0.08)' : 'rgba(52, 211, 153, 0.12)',
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
            }
          }}
        >
          <BottomNavigationAction label={t('About')} value="/about" icon={<InfoIcon />} />
          <BottomNavigationAction label={t('Suppliers')} value="/suppliers" icon={<StoreIcon />} />
            <BottomNavigationAction label={t('My Account')} value="/my-account" icon={<AccountCircleIcon />} />
          {isVendor ? (
            <BottomNavigationAction label={t('My Orders')} value="/my-orders" icon={<GroupAddIcon />} />
          ) : isSupplier ? (
            <BottomNavigationAction label={t('Reviews & Ratings')} value="/reviews" icon={<GroupsIcon />} />
          ) : (
            <BottomNavigationAction label={t('Vendors')} value="/vendors" icon={<GroupsIcon />} />
          )}
          <BottomNavigationAction label={t('Contact Us')} value="/contact" icon={<ContactMailIcon />} />
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
