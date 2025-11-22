import React from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ open, onClose, items = [] }) {
  const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose?.();
    navigate('/my-orders');
  };

  const handleRemove = (item) => {
    try {
      const existing = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updated = existing.filter(existingItem => existingItem.id !== item.id);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      // ignore
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, px: 3, py: 2, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>My Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No items added yet.</Typography>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {items.map((item, idx) => (
                <React.Fragment key={`${item.id}-${idx}`}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ pr: 6 }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${item.product || item.name} • ${item.qty || ''}`}
                      secondary={`${item.supplier || ''} ${item.price || ''}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {idx < items.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid rgba(0,0,0,0.08)',
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Total: ₹{total.toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                sx={{
                  backgroundColor: '#15803d',
                  color: '#fff',
                  fontWeight: 700,
                  py: 1.3,
                  borderRadius: 2,
                  position: 'sticky',
                  bottom: 16,
                  boxShadow: '0 12px 24px rgba(21,128,61,0.3)',
                  '&:hover': {
                    backgroundColor: '#0f6a2d',
                    boxShadow: '0 16px 32px rgba(21,128,61,0.35)',
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}

