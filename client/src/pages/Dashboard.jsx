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
        bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50',
        border: isDarkMode ? 'border-amber-500/30' : 'border-amber-200'
      };
    }
    if (t.includes('approval') || t.includes('compliance')) {
      return {
        icon: 'fa-solid fa-circle-check',
        color: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
        bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
        border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200'
      };
    }
    if (t.includes('risk') || t.includes('danger') || t.includes('warning')) {
      return {
        icon: 'fa-solid fa-shield-halved',
        color: isDarkMode ? 'text-rose-400' : 'text-rose-700',
        bg: isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50',
        border: isDarkMode ? 'border-rose-500/30' : 'border-rose-200'
      };
    }
    if (t.includes('obligation')) {
      return {
        icon: 'fa-solid fa-clipboard-check',
        color: isDarkMode ? 'text-blue-400' : 'text-blue-700',
        bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
        border: isDarkMode ? 'border-blue-500/30' : 'border-blue-200'
      };
    }
    return {
      icon: 'fa-solid fa-bolt',
      color: isDarkMode ? 'text-purple-400' : 'text-purple-700',
      bg: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50',
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
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>
            Good morning, {firstName}
          </h1>
          <p className={`text-sm mt-1 m-0 ${isDarkMode ? 'text-[#8E9BAE]' : 'text-[#64748B]'}`}>
            Here's what needs your attention across the organization today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL Live Sync</span>
          </div>
          <button
            onClick={() => window.print()}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#161F2E] hover:bg-slate-800 text-slate-200 border-[#2A364F]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <i className="fa-solid fa-file-export mr-1.5"></i>
            Export
          </button>
          <button
            onClick={() => navigate('/contracts')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <i className="fa-solid fa-plus"></i>
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
      <div className={`rounded-xl border p-5 sm:p-6 transition-all ${
        isDarkMode ? 'bg-[#161F2E] border-[#2A364F] shadow-lg' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex items-center justify-between pb-4 mb-4 border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
              isDarkMode ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div>
              <h2 className={`text-sm sm:text-base font-bold m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>
                Live Database Notifications & Alerts
              </h2>
              <span className={`text-[11px] ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>
                Directly queried from PostgreSQL <code className={`text-[10px] px-1 py-0.5 rounded ${isDarkMode ? 'bg-[#0B1121] text-slate-300' : 'bg-slate-100 text-slate-700'}`}>notifications</code> table
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {unreadCount} Unread
              </span>
            )}
            <button
              onClick={() => navigate('/notifications')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isDarkMode ? 'bg-[#0B1121] hover:bg-slate-800 text-blue-400 border-[#2A364F]' : 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200 shadow-sm'
              }`}
            >
              <span>View All Feed</span>
              <i className="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Notifications Grid */}
        {dashboardFeed.length === 0 ? (
          <div className={`py-6 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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
                          ? 'bg-[#0B1121] border-blue-500/40 hover:border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'bg-[#0B1121]/60 border-[#2A364F] hover:bg-[#0B1121] text-slate-300')
                      : (isUnread
                          ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/70 shadow-sm'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-700')
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border ${iconStyle.bg} ${iconStyle.color} ${iconStyle.border}`}>
                    <i className={iconStyle.icon}></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3 className={`text-xs truncate font-bold ${
                        isDarkMode ? (isUnread ? 'text-white' : 'text-slate-200') : (isUnread ? 'text-[#1E293B]' : 'text-slate-700')
                      }`}>
                        {item.title}
                      </h3>
                      <span className={`text-[10px] whitespace-nowrap ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {formatShortTime(item.created_at)}
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed m-0 ${
                      isDarkMode ? 'text-[#8E9BAE]' : 'text-[#64748B]'
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
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2A364F' : '#E2E8F0'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#8E9BAE' : '#64748B', fontSize: 12 }} />
                  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#8E9BAE' : '#64748B', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#161F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A364F' : '#E2E8F0', borderRadius: '8px', color: isDarkMode ? '#FFF' : '#1E293B' }} />
                  <Area type="monotone" dataKey="target" stroke={isDarkMode ? '#64748B' : '#94A3B8'} strokeDasharray="4 4" fill="none" />
                  <Area type="monotone" dataKey="compliance" stroke="#2563EB" strokeWidth={3} fill="url(#complianceFill)" />
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
                  <strong className={isDarkMode ? 'text-white' : 'text-[#1E293B]'}>{r.percent}%</strong>
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
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#161F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A364F' : '#E2E8F0', borderRadius: '8px', color: isDarkMode ? '#FFF' : '#1E293B' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card isDarkMode={isDarkMode} title="Renewal Timeline" subtitle="Renewals scheduled by month">
          <div style={{ width: '100%', height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={renewalTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#8E9BAE' : '#64748B', fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={40} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#8E9BAE' : '#64748B', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#161F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A364F' : '#E2E8F0', borderRadius: '8px', color: isDarkMode ? '#FFF' : '#1E293B' }} />
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
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>{d.performance}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-[#0B1121]' : 'bg-slate-100'}`}>
                  <div style={{ height: '100%', width: `${d.performance}%`, borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#8B5CF6)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Contracts Table */}
      <div className={`rounded-xl border p-5 transition-all ${
        isDarkMode ? 'bg-[#161F2E] border-[#2A364F] shadow-lg' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex items-center justify-between pb-4 mb-4 border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-100'}`}>
          <h2 className={`text-base font-bold m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>Recent Contracts</h2>
          <button 
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#0B1121] hover:bg-slate-800 text-slate-200 border-[#2A364F]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
            }`}
            onClick={() => navigate('/contracts')}
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#0B1121]/60 text-[#8E9BAE]' : 'bg-slate-50 text-slate-500'} border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-200'}`}>
              <tr>
                <th className="px-4 py-3">Contract</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Value</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#2A364F]/60' : 'divide-slate-100'}`}>
              {recentContracts.map((contract, index) => {
                const isCompliant = ['active', 'approved', 'completed'].includes(String(contract.status || '').toLowerCase());
                const isPending = ['pending', 'in review'].includes(String(contract.status || '').toLowerCase());

                const badgeClass = isCompliant
                  ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                  : isPending
                  ? (isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200')
                  : (isDarkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200');

                return (
                  <tr key={index} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors`}>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{contract.type} · {contract.vendor}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{contract.owner}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: RISK_COLORS[contract.risk] || '#64748B', fontWeight: 600, fontSize: '13px' }}>
                        {contract.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{fmtValue(contract.value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Deadlines + Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card isDarkMode={isDarkMode} title="Upcoming Deadlines" subtitle="Obligations due in the next 45 days">
          <div className="flex flex-col gap-3 mt-1.5">
            {deadlines.length === 0 && <p className="text-xs text-slate-500">Nothing due soon.</p>}
            {deadlines.map(d => (
              <div key={d.id} className={`flex justify-between items-center pb-2.5 border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-100'}`}>
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>{d.title}</div>
                  <div className={`text-[11px] ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>{d.contract} · due {d.dueDate}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  d.daysLeft <= 7 
                    ? (isDarkMode ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-rose-700 bg-rose-50 border-rose-200')
                    : (isDarkMode ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : 'text-blue-700 bg-blue-50 border-blue-200')
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
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {initials(a.user)}
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}><strong className="font-semibold">{a.user}</strong> {a.action}</div>
                  <div className={`text-[11px] ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>{a.target} · {a.time}</div>
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
    isDarkMode ? 'bg-[#161F2E] border-[#2A364F]' : 'bg-white border-slate-200 shadow-sm'
  }`}>
    <div className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>{label}</div>
    <div className={`text-2xl font-bold my-1.5 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>{value}</div>
    {trend && (
      <span className={`text-[11px] font-bold ${dir === 'up' ? 'text-emerald-500' : dir === 'down' ? 'text-rose-500' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '·'} {trend}
      </span>
    )}
  </div>
);

const Card = ({ isDarkMode, title, subtitle, children }) => (
  <div className={`rounded-xl border p-5 transition-all ${
    isDarkMode ? 'bg-[#161F2E] border-[#2A364F] shadow-lg' : 'bg-white border-slate-200 shadow-sm'
  }`}>
    <h3 className={`text-sm font-bold m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>{title}</h3>
    {subtitle && <p className={`text-xs mt-1 mb-3 ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>{subtitle}</p>}
    {children}
  </div>
);

export default Dashboard;
