import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Bell, 
  Settings,
  UserPlus,
  ShieldAlert,
  Server,
  TerminalSquare
} from 'lucide-react';
import ButtonGroup from '../../components/Buttons/ButtonGroup';
import Dropdown from '../../components/Buttons/Dropdown';
import Button from '../../components/Buttons/Button';
import Badge from '../../components/DataDisplay/Badge';
import Modal from '../../components/Modals/Modal';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import SignupForm from '../../features/authentication/components/SignupForm';
import { signupService } from '../../features/authentication/services/signup';
import { getAllUsers } from '../../features/authentication/services/getAllUsers';
import { getAuditLogs } from '../../features/auditLogs/services/getAuditLogs';
import { getUserNotifications } from '../../features/notifications/services/notificationAPI';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('30D');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Admin' });

  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, logsData, notifsData] = await Promise.all([
          getAllUsers().catch(() => []),
          getAuditLogs().catch(() => []),
          getUserNotifications().catch(() => [])
        ]);
        setUsers(usersData);
        setAuditLogs(logsData);
        setNotifications(notifsData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateUserFull = async (formData) => {
    setIsCreating(true);
    setCreateError('');
    try {
      await signupService(formData);
      alert(`User ${formData.name || 'New User'} registered successfully!`);
      setIsUserModalOpen(false);
      // Re-fetch users to update dashboard
      const newUsers = await getAllUsers();
      setUsers(newUsers);
    } catch (err) {
      setCreateError(err.message || 'Registration failed.');
    } finally {
      setIsCreating(false);
    }
  };

  const totalUsers = users.length;
  const activeSessions = users.filter(u => u.is_active).length;
  const unreadNotifs = notifications.filter(n => !n.is_read && !n.read).length;
  const systemErrors = auditLogs.filter(l => (l.status || '').toLowerCase() === 'error' || (l.status || '').toLowerCase() === 'danger').length;

  const stats = [
    { label: 'Total Users', value: totalUsers.toString(), icon: <Users size={24} />, color: 'var(--color-primary)', trend: 'Live', trendType: 'positive', subtext: 'registered users' },
    { label: 'Active Users', value: activeSessions.toString(), icon: <Activity size={24} />, color: 'var(--color-success)', trend: 'Live', trendType: 'neutral', subtext: 'currently active' },
    { label: 'Unread Notifications', value: unreadNotifs.toString(), icon: <Bell size={24} />, color: 'var(--color-warning)', trend: 'Live', trendType: 'warning', subtext: 'needs attention' },
    { label: 'System Errors', value: systemErrors.toString(), icon: <Server size={24} />, color: 'var(--color-danger)', trend: 'Live', trendType: 'positive', subtext: 'total errors logged' },
  ];

  const multiplyData = (dataArray, factor) => dataArray.map(d => Math.round(d * factor));
  const filterFactor = timeFilter === '7D' ? 0.3 : timeFilter === '1Y' ? 3 : 1;

  // Real User Growth
  const currentYear = new Date().getFullYear();
  const monthCounts = new Array(12).fill(0);
  users.forEach(u => {
    if (u.join_date || u.created_at) {
      const d = new Date(u.join_date || u.created_at);
      if (d.getFullYear() === currentYear) {
        monthCounts[d.getMonth()] += 1;
      }
    }
  });

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Users',
        data: monthCounts,
        borderColor: '#6B8EB1',
        backgroundColor: 'rgba(107, 142, 177, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6B8EB1',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(68, 75, 83, 0.05)', borderDash: [5, 5] }, beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  // Real Role Distribution
  const roleCounts = users.reduce((acc, user) => {
    const r = user.role || 'Unknown';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});
  
  const roleLabels = Object.keys(roleCounts);
  const roleData = Object.values(roleCounts);

  const doughnutData = {
    labels: roleLabels.length ? roleLabels : ['No Data'],
    datasets: [
      {
        data: roleData.length ? roleData : [1],
        backgroundColor: ['#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e74c3c', '#34495e'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' } }
    }
  };

  // Real System Activity (last 7 days of audit logs)
  const today = new Date();
  const last7DaysLabels = [];
  const activityCounts = [0, 0, 0, 0, 0, 0, 0];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7DaysLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  auditLogs.forEach(log => {
    if (log.created_at || log.timestamp) {
      const logDate = new Date(log.created_at || log.timestamp);
      // Reset hours to strictly compare dates
      const logDayStart = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const diffTime = todayStart - logDayStart;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < 7) {
        activityCounts[6 - diffDays] += 1;
      }
    }
  });

  const barChartData = {
    labels: last7DaysLabels,
    datasets: [
      {
        label: 'Activities',
        data: activityCounts,
        backgroundColor: '#2ecc71',
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(68, 75, 83, 0.05)', borderDash: [5, 5] }, beginAtZero: true }
    }
  };

  const dynamicActivities = auditLogs
    .sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp))
    .slice(0, 10)
    .map(log => ({
      id: log.audit_id || log.id || Math.random(),
      user: log.user_name || log.user || 'System',
      avatar: (log.user_name || log.user || 'SY').substring(0, 2).toUpperCase(),
      action: log.action || 'Performed action',
      target: log.resource || log.module || '',
      time: log.created_at || log.timestamp ? new Date(log.created_at || log.timestamp).toLocaleString() : 'Recently',
      status: log.status || 'Success',
      type: (log.status || '').toLowerCase().includes('error') ? 'danger' : (log.status || '').toLowerCase().includes('warning') ? 'warning' : 'success'
    }));

  const displayedActivities = dynamicActivities.slice(0, 4);

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-2 stagger-1">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted mt-1">System overview, user management, and audit logs.</p>
        </div>
        <div className="dashboard-header-actions">
          <ButtonGroup className="time-filters">
            <button className={`filter-btn ${timeFilter === '7D' ? 'active' : ''}`} onClick={() => setTimeFilter('7D')}>7D</button>
            <button className={`filter-btn ${timeFilter === '30D' ? 'active' : ''}`} onClick={() => setTimeFilter('30D')}>30D</button>
            <button className={`filter-btn ${timeFilter === '1Y' ? 'active' : ''}`} onClick={() => setTimeFilter('1Y')}>1Y</button>
          </ButtonGroup>
          <div className="header-buttons">
            <Button variant="primary" icon={UserPlus} onClick={() => setIsUserModalOpen(true)}>
              New User
            </Button>
          </div>
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
              <div className="stat-footer">
                <span className={`stat-trend ${stat.trendType}`}>{stat.trend}</span>
                <span className="stat-subtext">{stat.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-middle-grid stagger-2">
        <div className="dashboard-card main-chart-card">
          <div className="dashboard-card-header">
            <div>
              <h3>User Growth</h3>
              <p>Monthly new user registrations</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="dashboard-card quick-actions-card glow-card">
            <div className="dashboard-card-header">
              <h3>Admin Actions</h3>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => setIsUserModalOpen(true)}>
                <div className="qa-icon" style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(107, 142, 177, 0.15)' }}><UserPlus size={20}/></div>
                <span>Create User</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/audit-logs')}>
                <div className="qa-icon" style={{ color: 'var(--color-warning)', backgroundColor: 'rgba(241, 196, 15, 0.15)' }}><TerminalSquare size={20}/></div>
                <span>Audit Logs</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/notifications')}>
                <div className="qa-icon" style={{ color: 'var(--color-success)', backgroundColor: 'rgba(46, 204, 113, 0.15)' }}><Bell size={20}/></div>
                <span>Broadcast</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/settings')}>
                <div className="qa-icon" style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(231, 76, 60, 0.15)' }}><Settings size={20}/></div>
                <span>System Config</span>
              </button>
            </div>
          </div>
          
          <div className="dashboard-card flex-1">
            <div className="dashboard-card-header">
              <h3>Role Distribution</h3>
            </div>
            <div className="chart-wrapper doughnut-wrapper">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-middle-grid stagger-3">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>System Activity</h3>
              <p>User logins and sessions over the week</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        
        <div className="dashboard-card activity-dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="flex items-center gap-2">
               <Activity size={20} className="text-primary" />
              <h3 style={{ margin: 0 }}>Recent Audit Logs</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/audit-logs')}>
              View All
            </Button>
          </div>
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
        </div>
      </div>

      <Modal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)}
        title="Register New User"
      >
        <div style={{ padding: '0.5rem 0' }}>
          {createError && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #f87171' }}>
              {createError}
            </div>
          )}
          <SignupForm onSubmit={handleCreateUserFull} disabled={isCreating} />
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
