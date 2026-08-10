import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import GoogleCallback from './features/authentication/GoogleCallback';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

test('renders Login page without crashing', () => {
  render(
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
});

test('renders Register page without crashing', () => {
  render(
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
});

test('renders Landing page without crashing', () => {
  render(
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
});

test('renders GoogleCallback page without crashing', () => {
  render(
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <GoogleCallback />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
});
