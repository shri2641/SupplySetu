import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline } from '@mui/material';
import './i18n';
import '@fontsource/inter';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      {/* ThemeProvider will be set up in App.js for dynamic switching */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
