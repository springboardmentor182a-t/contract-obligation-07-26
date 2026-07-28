import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Signup from './Signup';
import { signupService } from '../features/authentication/services/signup';

// Mock signupService
jest.mock('../features/authentication/services/signup', () => ({
  signupService: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Signup Page', () => {
  beforeAll(() => {
    HTMLFormElement.prototype.reportValidity = jest.fn(() => true);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('redirects to dashboard if access_token exists on mount', () => {
    window.localStorage.setItem('access_token', 'fake-token');
    renderWithRouter(<Signup />);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  test('handles successful signup and navigates to login', async () => {
    signupService.mockResolvedValueOnce({ message: 'Success' });
    renderWithRouter(<Signup />);

    // Step 1: Role
    fireEvent.click(screen.getByText('Admin'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2: Basic Info
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('EMP-1234'), { target: { value: 'E001' } });
    fireEvent.change(screen.getByPlaceholderText('email@company.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('+1 234 567 8900'), { target: { value: '1234567890' } });
    const passwords = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwords[0], { target: { value: 'password123' } });
    fireEvent.change(passwords[1], { target: { value: 'password123' } });
    
    // Simulate form submission to bypass native validation for testing or just click continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Organization Details
    fireEvent.change(screen.getByPlaceholderText('Your Company'), { target: { value: 'Test Co' } });
    fireEvent.change(screen.getByPlaceholderText('Designation'), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByPlaceholderText('Office Location'), { target: { value: 'NY' } });

    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'));

    await waitFor(() => {
      expect(signupService).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays error message on signup failure', async () => {
    signupService.mockRejectedValueOnce(new Error('Email already exists.'));
    renderWithRouter(<Signup />);

    // Step 1
    fireEvent.click(screen.getByText('Admin'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('EMP-1234'), { target: { value: 'E001' } });
    fireEvent.change(screen.getByPlaceholderText('email@company.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('+1 234 567 8900'), { target: { value: '1234567890' } });
    const passwords = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwords[0], { target: { value: 'password123' } });
    fireEvent.change(passwords[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3
    fireEvent.change(screen.getByPlaceholderText('Your Company'), { target: { value: 'Test Co' } });
    fireEvent.change(screen.getByPlaceholderText('Designation'), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByPlaceholderText('Office Location'), { target: { value: 'NY' } });

    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Email already exists.')).toBeTruthy();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
