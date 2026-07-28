import React from 'react';
import { render, screen } from '@testing-library/react';
import ComplianceOfficerDashboard from './ComplianceOfficerDashboard';

describe('ComplianceOfficerDashboard', () => {
  it('renders the dashboard title correctly', () => {
    render(<ComplianceOfficerDashboard />);
    expect(screen.getByText('Compliance Officer Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Monitor compliance scores and pending obligations.')).toBeInTheDocument();
  });
});
