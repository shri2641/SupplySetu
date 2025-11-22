import React from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LogoutButton({ onLogout }) {
  const { t } = useTranslation();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
  };
  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      {t('Logout')}
    </Button>
  );
}