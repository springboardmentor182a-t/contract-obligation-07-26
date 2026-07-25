import React from 'react';
import { Files, AlertTriangle, CalendarClock, CheckCircle } from 'lucide-react';
import Card from '../../components/DataDisplay/Card';
import './Dashboard.css';

import { getContracts } from '../../features/contracts/services/contractAPI';
import { getRenewals } from '../../features/renewals/services/renewalAPI';
import { getObligations } from '../../features/obligations/services/obligationAPI';

const DepartmentHeadDashboard = () => {
  const [stats, setStats] = React.useState([
    { label: 'Active Contracts', value: '0', icon: <Files size={24} />, color: 'var(--color-primary)' },
    { label: 'Pending Approvals', value: '0', icon: <AlertTriangle size={24} />, color: 'var(--color-warning)' },
    { label: 'Upcoming Renewals', value: '0', icon: <CalendarClock size={24} />, color: 'var(--color-danger)' },
    { label: 'Completed Obligations', value: '0', icon: <CheckCircle size={24} />, color: 'var(--color-success)' },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [contracts, renewals, obligations] = await Promise.all([
          getContracts().catch(() => []),
          getRenewals().catch(() => []),
          getObligations().catch(() => [])
        ]);
        setStats([
          { label: 'Active Contracts', value: contracts.length.toString(), icon: <Files size={24} />, color: 'var(--color-primary)' },
          { label: 'Pending Approvals', value: '0', icon: <AlertTriangle size={24} />, color: 'var(--color-warning)' },
          { label: 'Upcoming Renewals', value: renewals.length.toString(), icon: <CalendarClock size={24} />, color: 'var(--color-danger)' },
          { label: 'Completed Obligations', value: obligations.length.toString(), icon: <CheckCircle size={24} />, color: 'var(--color-success)' },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-2 stagger-1">
        <div>
          <h1 className="text-2xl font-bold">Department Head Dashboard</h1>
          <p className="text-muted mt-1">Overview of department contracts and approvals.</p>
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

export default DepartmentHeadDashboard;// trigger commit to show on git
