import React from 'react';
import { Files, AlertTriangle, CalendarClock, CheckCircle } from 'lucide-react';
import Card from '../../components/DataDisplay/Card';
import './Dashboard.css';

const ComplianceOfficerDashboard = () => {
  const stats = [
    { label: 'Active Contracts', value: '45', icon: <Files size={24} />, color: 'var(--color-primary)' },
    { label: 'Pending Approvals', value: '12', icon: <AlertTriangle size={24} />, color: 'var(--color-warning)' },
    { label: 'Upcoming Renewals', value: '3', icon: <CalendarClock size={24} />, color: 'var(--color-danger)' },
    { label: 'Completed Obligations', value: '89', icon: <CheckCircle size={24} />, color: 'var(--color-success)' },
  ];

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-2 stagger-1">
        <div>
          <h1 className="text-2xl font-bold">Compliance Officer Dashboard</h1>
          <p className="text-muted mt-1">Monitor compliance scores and pending obligations.</p>
        </div>
      </div>

      <div className="stats-grid stagger-1">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-card-header">
              <p className="stat-label">{stat.label}</p>
              <div className="stat-icon" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-card mt-6 stagger-2">
         <div className="dashboard-card-header">
            <h3>Recent Activity</h3>
         </div>
         <div className="p-4">
            <p className="text-muted">No recent activity to display.</p>
         </div>
      </div>
    </div>
  );
};

export default ComplianceOfficerDashboard;