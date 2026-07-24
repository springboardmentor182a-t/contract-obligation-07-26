import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from './SignupForm';

describe('SignupForm Component', () => {
  beforeAll(() => {
    HTMLFormElement.prototype.reportValidity = jest.fn(() => true);
  });

  test('renders role selection in step 1', () => {
    render(<SignupForm onSubmit={jest.fn()} />);
    expect(screen.getByText('Choose your role')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  test('moves to step 2 after selecting role', () => {
    render(<SignupForm onSubmit={jest.fn()} />);
    
    // Select role
    fireEvent.click(screen.getByText('Admin'));
    
    // Click Continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Should render step 2
    expect(screen.getByText('Basic Information')).toBeTruthy();
    expect(screen.getByPlaceholderText('John Doe')).toBeTruthy();
  });

  test('moves back and forth between steps', () => {
    render(<SignupForm onSubmit={jest.fn()} />);
    
    fireEvent.click(screen.getByText('Admin'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    
    expect(screen.getByText('Basic Information')).toBeTruthy();
    
    // Click Back
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText('Choose your role')).toBeTruthy();
  });

  test('alerts if passwords do not match on submit', () => {
    const mockOnSubmit = jest.fn();
    window.alert = jest.fn(); // mock alert
    render(<SignupForm onSubmit={mockOnSubmit} />);
    
    // Step 1
    fireEvent.click(screen.getByText('Admin'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 2
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test' } });
    const passwords = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwords[0], { target: { value: 'pass1' } });
    fireEvent.change(passwords[1], { target: { value: 'pass2' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    
    // Step 3
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'));
    
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
