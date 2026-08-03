import React from 'react';
import { useNavigate } from 'react-router-dom';
import LegalDashboard from '../features/dashboard/LegalDashboard';
import ActivityChart from '../components/ActivityChart';
import { useFetchContracts } from '../hooks/useFetchContracts';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: recentContracts } = useFetchContracts('/api/dashboard/recent');
  const { notifications, unreadCount, markAsRead, loading } = useNotifications();
  const { isDarkMode } = useTheme();

  const getSemanticIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('renewal')) {
      return {
        icon: 'fa-solid fa-calendar-days',
        color: isDarkMode ? 'text-amber-400' : 'text-amber-700',
        bg: isDarkMode ? 'bg-amber-500/15' : 'bg-amber-100',
        border: isDarkMode ? 'border-amber-500/30' : 'border-amber-200'
      };
    }
    if (t.includes('approval') || t.includes('compliance')) {
      return {
        icon: 'fa-solid fa-circle-check',
        color: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
        bg: isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-100',
        border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200'
      };
    }
    if (t.includes('risk') || t.includes('danger') || t.includes('warning')) {
      return {
        icon: 'fa-solid fa-shield-halved',
        color: isDarkMode ? 'text-rose-400' : 'text-rose-700',
        bg: isDarkMode ? 'bg-rose-500/15' : 'bg-rose-100',
        border: isDarkMode ? 'border-rose-500/30' : 'border-rose-200'
      };
    }
    if (t.includes('obligation')) {
      return {
        icon: 'fa-solid fa-clipboard-check',
        color: isDarkMode ? 'text-blue-400' : 'text-blue-700',
        bg: isDarkMode ? 'bg-blue-500/15' : 'bg-blue-100',
        border: isDarkMode ? 'border-blue-500/30' : 'border-blue-200'
      };
    }
    return {
      icon: 'fa-solid fa-bolt',
      color: isDarkMode ? 'text-purple-400' : 'text-purple-700',
      bg: isDarkMode ? 'bg-purple-500/15' : 'bg-purple-100',
      border: isDarkMode ? 'border-purple-500/30' : 'border-purple-200'
    };
  };

  const formatShortTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  // Top 4 active database notifications for the dashboard feed
  const dashboardFeed = notifications.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight m-0 ${
            isDarkMode ? 'text-white' : 'text-[#1E3A8A]'
          }`}>
            Enterprise Dashboard
          </h1>
          <p className={`text-sm mt-1 m-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Live overview of contract performance, obligations, and database-synced compliance alerts.
          </p>
        </div>

        {/* PostgreSQL Synced Indicator */}
        <div className={`self-start md:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700/80 text-emerald-400 shadow-sm'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PostgreSQL Live Sync Active</span>
        </div>
      </div>

      {/* Stats KPI Grid */}
      <LegalDashboard />

      {/* Live Database Notifications Card on Screen */}
      <div className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        isDarkMode
          ? 'bg-[#161f2e] border-slate-700/80 shadow-lg'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-[#1E3A8A]'
            }`}>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div>
              <h2 className={`text-base font-bold m-0 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Live Database Notifications & Alerts
              </h2>
              <span className="text-[11px] text-slate-500">
                Directly queried from PostgreSQL <code className="text-[10px] px-1 py-0.5 rounded bg-slate-800 text-slate-300">notifications</code> table
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isDarkMode 
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {unreadCount} Unread
              </span>
            )}
            <button
              onClick={() => navigate('/notifications')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 border-slate-700'
                  : 'bg-gray-50 hover:bg-gray-100 text-[#1E3A8A] border-gray-200 shadow-sm'
              }`}
            >
              <span>View All Feed</span>
              <i className="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Notifications Grid / List */}
        {dashboardFeed.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            {loading ? 'Fetching notifications from database...' : 'No notifications in database.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {dashboardFeed.map((item) => {
              const iconStyle = getSemanticIcon(item.type);
              const isUnread = !item.is_read;

              return (
                <div
                  key={item.id || item.notification_id}
                  onClick={() => {
                    if (isUnread) markAsRead(item.id);
                    if (item.link) navigate(item.link);
                    else navigate('/notifications');
                  }}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    isDarkMode
                      ? (isUnread 
                          ? 'bg-slate-800/90 border-blue-500/50 hover:bg-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300')
                      : (isUnread
                          ? 'bg-blue-50/50 border-blue-300 hover:bg-blue-50 shadow-sm'
                          : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100/80 text-slate-700')
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border ${iconStyle.bg} ${iconStyle.color} ${iconStyle.border}`}>
                    <i className={iconStyle.icon}></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3 className={`text-xs truncate font-bold ${
                        isDarkMode ? (isUnread ? 'text-white' : 'text-slate-200') : (isUnread ? 'text-slate-900' : 'text-slate-700')
                      }`}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {formatShortTime(item.created_at)}
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed m-0 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {item.message}
                    </p>
                  </div>

                  {isUnread && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Visual Analytics Chart */}
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
                  <span className={`badge ${String(contract.status || '').toLowerCase()}`}>
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
