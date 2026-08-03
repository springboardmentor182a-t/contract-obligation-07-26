import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const RISK_COLORS = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Critical: '#EF4444' };
const STATUS_COLORS = { Active: '#10B981', Pending: '#F59E0B', Expired: '#94A3B8', Rejected: '#EF4444', Terminated: '#EF4444', Approved: '#3B82F6' };

const useJson = (url, fallback) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => { if (!cancelled) { setData(json); setLoading(false); } })
      .catch(err => { console.error(`Failed to fetch ${url}`, err); if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);
  return { data, loading };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = (typeof window !== 'undefined' && localStorage.getItem('userName')) || 'there';
  const firstName = userName.split(' ')[0];

  const { notifications, unreadCount, markAsRead, loading: notifLoading } = useNotifications();
  const { isDarkMode } = useTheme();

  const { data: stats } = useJson('/api/dashboard/stats', null);
  const { data: complianceTrend } = useJson('/api/dashboard/compliance-trend', []);
  const { data: riskDistribution } = useJson('/api/dashboard/risk-distribution', []);
  const { data: contractStatus } = useJson('/api/dashboard/contract-status', []);
  const { data: renewalTimeline } = useJson('/api/dashboard/renewal-timeline', []);
  const { data: deptPerformance } = useJson('/api/dashboard/department-performance', []);
  const { data: recentContracts } = useJson('/api/dashboard/recent', []);
  const { data: deadlines } = useJson('/api/dashboard/deadlines', []);
  const { data: activity } = useJson('/api/dashboard/recent-activity', []);

  const fmtValue = (v) => {
    const n = Number(v) || 0;
    return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  };

  const initials = (name) => (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

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

  const dashboardFeed = notifications.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-[#1E3A8A]'}`}>
            Good morning, {firstName}
          </h1>
          <p className={`text-sm mt-1 m-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Here's what needs your attention across the organization today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700/80 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL Live Sync</span>
          </div>
          <button
            onClick={() => window.print()}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-gray-100 text-slate-700 border-gray-200 shadow-sm'
            }`}
          >
            Export
          </button>
          <button onClick={() => navigate('/contracts')} className="premium-button" style={{ width: 'auto', padding: '8px 18px', marginTop: 0 }}>
            New Contract
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatBox isDarkMode={isDarkMode} label="Active Contracts" value={stats?.activeContracts?.metric ?? '—'} trend={stats?.activeContracts?.trendText} dir={stats?.activeContracts?.trendDirection} />
        <StatBox isDarkMode={isDarkMode} label="Pending Obligations" value={stats?.pendingObligations?.metric ?? '—'} trend={stats?.pendingObligations?.trendText} dir={stats?.pendingObligations?.trendDirection} />
        <StatBox isDarkMode={isDarkMode} label="Upcoming Renewals" value={stats?.upcomingRenewals?.metric ?? '—'} trend={stats?.upcomingRenewals?.trendText} dir={stats?.upcomingRenewals?.trendDirection} />
        <StatBox isDarkMode={isDarkMode} label="Compliance Rate" value={stats?.complianceRate?.metric ?? '—'} trend={stats?.complianceRate?.trendText} dir={stats?.complianceRate?.trendDirection} />
        <StatBox isDarkMode={isDarkMode} label="High Risk" value={stats?.highRisk?.metric ?? '—'} trend={stats?.highRisk?.trendText} dir={stats?.highRisk?.trendDirection} />
        <StatBox isDarkMode={isDarkMode} label="Expired" value={stats?.expired?.metric ?? '—'} trend={stats?.expired?.trendText} dir={stats?.expired?.trendDirection} />
      </div>

      {/* Live Database Notifications Card on Screen */}
      <div className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        isDarkMode ? 'bg-[#161f2e] border-slate-700/80 shadow-lg' : 'bg-white border-gray-200 shadow-sm'
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
                isDarkMode ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {unreadCount} Unread
              </span>
            )}
            <button
              onClick={() => navigate('/notifications')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 border-slate-700' : 'bg-gray-50 hover:bg-gray-100 text-[#1E3A8A] border-gray-200 shadow-sm'
              }`}
            >
              <span>View All Feed</span>
              <i className="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Notifications Grid */}
        {dashboardFeed.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            {notifLoading ? 'Fetching notifications from database...' : 'No notifications in database.'}
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

      {/* Compliance Trend + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card isDarkMode={isDarkMode} title="Compliance Trend" subtitle="Rolling 12-month compliance vs. target">
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="complianceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="4 4" fill="none" />
                  <Area type="monotone" dataKey="compliance" stroke="#3B82F6" strokeWidth={3} fill="url(#complianceFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div>
          <Card isDarkMode={isDarkMode} title="Risk Distribution" subtitle="Portfolio-wide contract risk">
            <div style={{ width: '100%', height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#CBD5E1'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1.5 text-xs mt-2">
              {riskDistribution.map(r => (
                <div key={r.name} className="flex justify-between items-center">
                  <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: RISK_COLORS[r.name] || '#CBD5E1', display: 'inline-block' }} />
                    {r.name}
                  </span>
                  <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{r.percent}%</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Contract Status + Renewal Timeline + Department Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card isDarkMode={isDarkMode} title="Contract Status" subtitle="Current portfolio breakdown">
          <div style={{ width: '100%', height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contractStatus} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {contractStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card isDarkMode={isDarkMode} title="Renewal Timeline" subtitle="Renewals scheduled by month">
          <div style={{ width: '100%', height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={renewalTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={40} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="renewals" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card isDarkMode={isDarkMode} title="Department Performance" subtitle="Share of healthy contracts">
          <div className="flex flex-col gap-2.5 mt-1">
            {deptPerformance.map(d => (
              <div key={d.department}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{d.department}</span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.performance}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div style={{ height: '100%', width: `${d.performance}%`, borderRadius: '999px', background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Contracts Table */}
      <div className={`rounded-2xl border p-5 ${
        isDarkMode ? 'bg-[#161f2e] border-slate-700/80 shadow-lg' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/40">
          <h2 className={`text-base font-bold m-0 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Contracts</h2>
          <button className="premium-button" style={{ width: 'auto', padding: '6px 14px', marginTop: 0 }} onClick={() => navigate('/contracts')}>View All</button>
        </div>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {recentContracts.map((contract, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 500 }}>{contract.type} · {contract.vendor}</td>
                <td>{contract.owner}</td>
                <td><span className={`badge ${String(contract.status || '').toLowerCase()}`}>{contract.status}</span></td>
                <td>
                  <span style={{ color: RISK_COLORS[contract.risk] || '#64748B', fontWeight: 600, fontSize: '13px' }}>
                    {contract.risk}
                  </span>
                </td>
                <td>{fmtValue(contract.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Deadlines + Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card isDarkMode={isDarkMode} title="Upcoming Deadlines" subtitle="Obligations due in the next 45 days">
          <div className="flex flex-col gap-3 mt-1.5">
            {deadlines.length === 0 && <p className="text-xs text-slate-500">Nothing due soon.</p>}
            {deadlines.map(d => (
              <div key={d.id} className="flex justify-between items-center pb-2.5 border-b border-slate-700/30">
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.title}</div>
                  <div className="text-[11px] text-slate-400">{d.contract} · due {d.dueDate}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  d.daysLeft <= 7 ? 'text-rose-500 bg-rose-500/10' : 'text-blue-500 bg-blue-500/10'
                }`}>
                  {d.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card isDarkMode={isDarkMode} title="Recent Activity" subtitle="Latest updates across your contracts">
          <div className="flex flex-col gap-3.5 mt-1.5">
            {activity.map(a => (
              <div key={a.id} className="flex gap-2.5 items-start">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#1E3A8A] text-white text-[11px] font-bold flex items-center justify-center">
                  {initials(a.user)}
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><strong>{a.user}</strong> {a.action}</div>
                  <div className="text-[11px] text-slate-400">{a.target} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatBox = ({ isDarkMode, label, value, trend, dir }) => (
  <div className={`rounded-xl border p-4 transition-all ${
    isDarkMode ? 'bg-[#161f2e] border-slate-700/70' : 'bg-white border-gray-200 shadow-sm'
  }`}>
    <div className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
    <div className={`text-2xl font-bold my-1.5 ${isDarkMode ? 'text-white' : 'text-[#1E3A8A]'}`}>{value}</div>
    {trend && (
      <span className={`text-[11px] font-bold ${dir === 'up' ? 'text-emerald-500' : dir === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
        {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '·'} {trend}
      </span>
    )}
  </div>
);

const Card = ({ isDarkMode, title, subtitle, children }) => (
  <div className={`rounded-2xl border p-5 transition-all ${
    isDarkMode ? 'bg-[#161f2e] border-slate-700/80 shadow-lg' : 'bg-white border-gray-200 shadow-sm'
  }`}>
    <h3 className={`text-sm font-bold m-0 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    {subtitle && <p className={`text-xs mt-1 mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
    {children}
  </div>
);

export default Dashboard;
