import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders SupplySetu app', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const appElement = screen.getByText(/SupplySetu/i);
  expect(appElement).toBeInTheDocument();
});
