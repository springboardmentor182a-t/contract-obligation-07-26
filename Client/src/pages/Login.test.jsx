import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
import { loginService } from '../features/authentication/services/login';

// Mock the external modules
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../features/authentication/services/login', () => ({
  loginService: jest.fn(),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  const mockRefreshProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      refreshProfile: mockRefreshProfile,
    });

    // Clear localStorage before each test
    window.localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders the login page correctly', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/Welcome Back/i)).toBeTruthy();
    expect(screen.getByText(/Sign in to access your account/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeTruthy();
  });

  test('redirects to dashboard if access_token exists in localStorage on mount', () => {
    window.localStorage.setItem('access_token', 'fake-token');

    renderWithRouter(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  test('handles successful login and navigates to dashboard', async () => {
    loginService.mockResolvedValueOnce({ data: { token: 'new-token' } });
    mockRefreshProfile.mockResolvedValueOnce();

    renderWithRouter(<Login />);

    // Fill in the form
    fireEvent.click(screen.getByText('Admin')); // Select Role (Administrator)
    fireEvent.change(screen.getByPlaceholderText('admin@contractiq.com'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
        role: 'Admin',
        rememberMe: false,
      });
      expect(mockRefreshProfile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error message on login failure', async () => {
    loginService.mockRejectedValueOnce(new Error('Invalid credentials. Please try again.'));

    renderWithRouter(<Login />);

    // Fill in the form
    fireEvent.click(screen.getByText('Admin'));
    fireEvent.change(screen.getByPlaceholderText('admin@contractiq.com'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials. Please try again.')).toBeTruthy();
    });

    // Ensure we don't navigate or refresh profile on failure
    expect(mockRefreshProfile).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
