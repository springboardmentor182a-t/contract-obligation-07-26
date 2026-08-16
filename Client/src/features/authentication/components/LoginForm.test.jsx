import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  test('renders form inputs correctly', () => {
    renderWithRouter(<LoginForm onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText('admin@contractiq.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeTruthy();
  });

  test('submits form with entered data', () => {
    const mockOnSubmit = jest.fn();
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('admin@contractiq.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
      rememberMe: false
    });
  });
});
