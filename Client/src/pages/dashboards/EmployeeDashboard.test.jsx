import React from 'react';
import { render, screen } from '@testing-library/react';
import EmployeeDashboard from './EmployeeDashboard';

describe('EmployeeDashboard', () => {
  it('renders the dashboard title correctly', () => {
    render(<EmployeeDashboard />);
    expect(screen.getByText('Employee Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Your assigned contracts and personal obligations.')).toBeInTheDocument();
  });

  it('renders the stat cards correctly', () => {
    render(<EmployeeDashboard />);
    expect(screen.getByText('Active Contracts')).toBeInTheDocument();
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Renewals')).toBeInTheDocument();
    expect(screen.getByText('Completed Obligations')).toBeInTheDocument();
  });

  it('renders the recent activity section', () => {
    render(<EmployeeDashboard />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('No recent activity to display.')).toBeInTheDocument();
  });
});
