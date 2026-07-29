import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ForgotPassword from './ForgotPassword';

describe('ForgotPassword Page', () => {
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  test('renders forgot password form correctly', () => {
    renderWithRouter(<ForgotPassword />);
    
    expect(screen.getByText('Forgot Password')).toBeTruthy();
    expect(screen.getByText('Enter your email to receive a reset OTP.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email address')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Send OTP/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Back to Login/i })).toBeTruthy();
  });
});
