import React from 'react';
import { render, screen } from '@testing-library/react';
import DepartmentHeadDashboard from './DepartmentHeadDashboard';

describe('DepartmentHeadDashboard', () => {
  it('renders the dashboard title correctly', () => {
    render(<DepartmentHeadDashboard />);
    expect(screen.getByText('Department Head Dashboard')).toBeInTheDocument();
  });
});
