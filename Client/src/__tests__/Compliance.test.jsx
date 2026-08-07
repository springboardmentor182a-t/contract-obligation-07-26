import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Compliance from '../pages/compliance/Compliance';

// Mock react-chartjs-2 to avoid canvas issues in JSDOM
vi.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut">Mock Doughnut Chart</div>,
  Line: () => <div data-testid="mock-line">Mock Line Chart</div>,
}));

// Mock useAuth context hook
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    role: 'Legal Manager',
    userProfile: { name: 'Sangavi' },
  }),
}));

describe('Compliance Dashboard Frontend Tests', () => {
  beforeEach(() => {
    // Reset and mock fetch API
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/compliance/summary')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            compliance_score: 84.0,
            trend_value: 2.4,
            compliant_contracts: 142,
            compliant_contracts_trend: "+12 this month",
            critical_violations: 3,
            critical_violations_trend: "Needs immediate action",
            pending_audits: 18,
            pending_audits_trend: "Scheduled for Q4"
          })
        });
      }
      if (url.includes('/compliance/trend')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([
            { month: 'Jan', compliance_score: 80 },
            { month: 'Feb', compliance_score: 82 }
          ])
        });
      }
      if (url.includes('/compliance/risk-distribution')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ high: 3, medium: 5, low: 2 })
        });
      }
      if (url.includes('/compliance/anomalies')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([
            {
              id: 'ANM-APP-3',
              contractId: 3,
              contractTitle: 'Beta Inc (Service Agreements)',
              category: 'Missing Approval',
              severity: 'Critical',
              description: "Contract is marked as 'Active' but does not have an approval timestamp."
            }
          ])
        });
      }
      if (url.includes('/compliance/contracts')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            records: [
              {
                id: 1,
                requirement: 'GDPR Data Processing Agreement',
                category: 'Data Privacy',
                entity: 'Acme Corp',
                contractId: 'CON-102',
                status: 'Compliant',
                risk: 'Low',
                score: 95
              }
            ],
            total: 1
          })
        });
      }
      return Promise.reject(new Error(`Unknown mock endpoint: ${url}`));
    });
  });

  // Test Case 1: Verifies header title and stat cards render correctly with mocked summary data
  it('should render Compliance Dashboard title and key stat cards', async () => {
    render(<Compliance />);

    // Check dashboard header title
    expect(screen.getByText('Compliance Intelligence')).toBeInTheDocument();

    // Wait for the mock summary API values to populate the elements
    await waitFor(() => {
      expect(screen.getByText('142')).toBeInTheDocument(); // Compliant contracts count
      expect(screen.getByText('3')).toBeInTheDocument();   // Critical violations count
      expect(screen.getByText('18')).toBeInTheDocument();  // Pending audits count
    });
  });

  // Test Case 2: Verifies that mock charts are rendered in the charts section
  it('should render the charts section and mock components', async () => {
    render(<Compliance />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-line')).toBeInTheDocument();
      expect(screen.getByTestId('mock-doughnut')).toBeInTheDocument();
    });
  });

  // Test Case 3: Verifies that AI Anomalies tab renders and displays alerts when clicked
  it('should render AI Anomalies tab and display anomaly alerts when clicked', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<Compliance />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('AI Anomalies')).toBeInTheDocument();
    });

    // Click on the AI Anomalies tab
    fireEvent.click(screen.getByText('AI Anomalies'));

    // Verify it displays the anomalies title and alert card
    await waitFor(() => {
      expect(screen.getByText('Detected System Anomalies')).toBeInTheDocument();
      expect(screen.getByText('Beta Inc (Service Agreements)')).toBeInTheDocument();
      expect(screen.getByText('Critical Severity')).toBeInTheDocument();
    });
  });
});
