import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

// Mock the API services
jest.mock('../../features/authentication/services/getAllUsers', () => ({
  getAllUsers: jest.fn(() => Promise.resolve([
    { is_active: true, role: 'Admin', join_date: new Date().toISOString() }
  ]))
}));

jest.mock('../../features/auditLogs/services/getAuditLogs', () => ({
  getAuditLogs: jest.fn(() => Promise.resolve([
    { status: 'Success', action: 'Login', created_at: new Date().toISOString() }
  ]))
}));

jest.mock('../../features/notifications/services/notificationAPI', () => ({
  getUserNotifications: jest.fn(() => Promise.resolve([
    { is_read: false, read: false, message: 'Test Notif' }
  ]))
}));

jest.mock('../../features/authentication/services/signup', () => ({
  signupService: jest.fn(() => Promise.resolve({}))
}));

jest.mock('../../features/authentication/components/SignupForm', () => {
  return function DummySignupForm(props) {
    return <div data-testid="mock-signup-form">Signup Form</div>;
  };
});

// Mock chart.js so canvas rendering doesn't crash jsdom
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />,
  Bar: () => <div data-testid="mock-bar-chart" />
}));

describe('AdminDashboard', () => {
  it('renders the dashboard title and fetches data', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Initial render texts
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    
    // Wait for the async data to load and stats to render
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('Unread Notifications')).toBeInTheDocument();
      expect(screen.getByText('System Errors')).toBeInTheDocument();
    });
  });

  it('renders the charts correctly', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });
  });
});
