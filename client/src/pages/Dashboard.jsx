import React from 'react';
import { useNavigate } from 'react-router-dom';
import LegalDashboard from '../features/dashboard/LegalDashboard';
import ActivityChart from '../components/ActivityChart';

const Dashboard = () => {
  const navigate = useNavigate();
  // Mock Data for the beautiful UI preview
  const recentContracts = [
    { id: 'CTR-2026-001', vendor: 'Acme Corp', type: 'NDA', status: 'Active', date: 'Jul 12, 2026' },
    { id: 'CTR-2026-002', vendor: 'TechFlow Inc', type: 'MSA', status: 'Pending', date: 'Jul 10, 2026' },
    { id: 'CTR-2026-003', vendor: 'Global Logistics', type: 'SLA', status: 'Active', date: 'Jul 05, 2026' },
    { id: 'CTR-2026-004', vendor: 'CloudSystems', type: 'Vendor', status: 'Expired', date: 'Jun 28, 2026' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Overview Dashboard</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Welcome back! Here is what's happening with your contracts today.</p>
      </div>

      {/* Stats Grid */}
      <LegalDashboard />
      
      {/* Visual Analytics */}
      <ActivityChart />

      {/* Recent Activity Table */}
      <div className="premium-table-container">
        <div className="table-header">
          <h2 className="table-title">Recent Contracts</h2>
          <button className="premium-button" style={{ width: 'auto', padding: '8px 16px', marginTop: 0 }} onClick={() => navigate('/contracts')}>View All</button>
        </div>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Counterparty</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {recentContracts.map((contract, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 500 }}>{contract.id}</td>
                <td>{contract.vendor}</td>
                <td>{contract.type}</td>
                <td>
                  <span className={`badge ${contract.status.toLowerCase()}`}>
                    {contract.status}
                  </span>
                </td>
                <td>{contract.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
