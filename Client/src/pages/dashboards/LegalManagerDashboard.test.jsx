import React from 'react';
import { render, screen } from '@testing-library/react';
import LegalManagerDashboard from './LegalManagerDashboard';

describe('LegalManagerDashboard', () => {
  it('renders the dashboard title correctly', () => {
    render(<LegalManagerDashboard />);
    expect(screen.getByText('Legal Manager Dashboard')).toBeInTheDocument();
  });
});
