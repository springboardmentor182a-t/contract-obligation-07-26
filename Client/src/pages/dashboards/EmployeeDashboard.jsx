import React from 'react';
import { Files, AlertTriangle, CalendarClock, CheckCircle } from 'lucide-react';
import Card from '../../components/DataDisplay/Card';
import './Dashboard.css';

import { getContracts } from '../../features/contracts/services/contractAPI';
import { getRenewals } from '../../features/renewals/services/renewalAPI';
import { getObligations } from '../../features/obligations/services/obligationAPI';
import { getActivities } from '../../features/auditLogs/services/getAuditLogs';
import Badge from '../../components/DataDisplay/Badge';

const EmployeeDashboard = () => {
  const [activities, setActivities] = React.useState([]);
  const [stats, setStats] = React.useState([
    { label: 'Active Contracts', value: '0', icon: <Files size={24} />, color: 'var(--color-primary)' },
    { label: 'Pending Approvals', value: '0', icon: <AlertTriangle size={24} />, color: 'var(--color-warning)' },
    { label: 'Upcoming Renewals', value: '0', icon: <CalendarClock size={24} />, color: 'var(--color-danger)' },
    { label: 'Completed Obligations', value: '0', icon: <CheckCircle size={24} />, color: 'var(--color-success)' },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [contracts, renewals, obligations, activitiesData] = await Promise.all([
          getContracts().catch(() => []),
          getRenewals().catch(() => []),
          getObligations().catch(() => []),
          getActivities(5).catch(() => [])
        ]);
        setActivities(activitiesData);
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

  const dynamicActivities = activities.map(log => ({
    id: log.activity_id || Math.random(),
    user: log.user_name || 'System',
    avatar: (log.user_name || 'SY').substring(0, 2).toUpperCase(),
    action: log.action || 'Performed action',
    target: log.entity_type || '',
    time: log.created_at ? new Date(log.created_at).toLocaleString() : 'Recently',
    status: 'Recorded',
    type: 'info'
  }));

  const displayedActivities = dynamicActivities.slice(0, 5);

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-2 stagger-1">
        <div>
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <p className="text-muted mt-1">Your assigned contracts and personal obligations.</p>
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

      <div className="dashboard-card activity-dashboard-card mt-6 stagger-2">
         <div className="dashboard-card-header">
            <h3>Recent Activity</h3>
         </div>
         {displayedActivities.length > 0 ? (
           <div className="activity-table-wrapper" style={{ flex: 1 }}>
             <table className="activity-table">
               <thead>
                 <tr>
                   <th>User</th>
                   <th>Action</th>
                   <th>Status</th>
                   <th>Time</th>
                 </tr>
               </thead>
               <tbody>
                 {displayedActivities.map((act) => (
                   <tr key={act.id}>
                     <td>
                       <div className="table-user">
                         <div className="table-avatar">{act.avatar}</div>
                         <div>
                           <p className="font-semibold" style={{ marginBottom: 0 }}>{act.user}</p>
                         </div>
                       </div>
                     </td>
                     <td>
                       <p style={{ margin: 0, fontSize: '0.95rem' }}>
                         {act.action} <span className="font-semibold">{act.target}</span>
                       </p>
                     </td>
                     <td>
                       <Badge variant={act.type}>{act.status}</Badge>
                     </td>
                     <td className="text-muted text-sm">{act.time}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         ) : (
           <div className="p-4">
              <p className="text-muted">No recent activity to display.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;// trigger commit to show on git
