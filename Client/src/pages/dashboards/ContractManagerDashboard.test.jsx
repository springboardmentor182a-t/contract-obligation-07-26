import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractManagerDashboard from './ContractManagerDashboard';

describe('ContractManagerDashboard', () => {
  it('renders the dashboard title correctly', () => {
    render(<ContractManagerDashboard />);
    expect(screen.getByText('Contract Manager Dashboard')).toBeInTheDocument();
  });
});
