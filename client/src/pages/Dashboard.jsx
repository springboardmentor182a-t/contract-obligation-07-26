import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

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

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Good morning, {firstName}</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Here's what needs your attention across the organization today.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px' }}
          >
            Export
          </button>
          <button onClick={() => navigate('/contracts')} className="premium-button" style={{ width: 'auto', padding: '10px 20px' }}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Contract
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', margin: '24px 0' }}>
        <StatBox label="Active Contracts" value={stats?.activeContracts?.metric ?? '—'} trend={stats?.activeContracts?.trendText} dir={stats?.activeContracts?.trendDirection} />
        <StatBox label="Pending Obligations" value={stats?.pendingObligations?.metric ?? '—'} trend={stats?.pendingObligations?.trendText} dir={stats?.pendingObligations?.trendDirection} />
        <StatBox label="Upcoming Renewals" value={stats?.upcomingRenewals?.metric ?? '—'} trend={stats?.upcomingRenewals?.trendText} dir={stats?.upcomingRenewals?.trendDirection} />
        <StatBox label="Compliance Rate" value={stats?.complianceRate?.metric ?? '—'} trend={stats?.complianceRate?.trendText} dir={stats?.complianceRate?.trendDirection} />
        <StatBox label="High Risk" value={stats?.highRisk?.metric ?? '—'} trend={stats?.highRisk?.trendText} dir={stats?.highRisk?.trendDirection} />
        <StatBox label="Expired" value={stats?.expired?.metric ?? '—'} trend={stats?.expired?.trendText} dir={stats?.expired?.trendDirection} />
      </div>

      {/* Compliance Trend + Risk Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card title="Compliance Trend" subtitle="Rolling 12-month compliance vs. target">
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="complianceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="compliance" stroke="#3B82F6" strokeWidth={3} fill="url(#complianceFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Risk Distribution" subtitle="Portfolio-wide contract risk">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginTop: '8px' }}>
            {riskDistribution.map(r => (
              <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: RISK_COLORS[r.name] || '#CBD5E1', display: 'inline-block' }} />
                  {r.name}
                </span>
                <strong style={{ color: 'var(--primary-color)' }}>{r.percent}%</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Contract Status + Renewal Timeline + Department Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card title="Contract Status" subtitle="Current portfolio breakdown">
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

        <Card title="Renewal Timeline" subtitle="Renewals scheduled by month">
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

        <Card title="Department Performance" subtitle="Share of healthy contracts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            {deptPerformance.map(d => (
              <div key={d.department}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{d.department}</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{d.performance}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: '#eef2f7' }}>
                  <div style={{ height: '100%', width: `${d.performance}%`, borderRadius: '999px', background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Contracts */}
      <div className="premium-table-container" style={{ marginBottom: '20px' }}>
        <div className="table-header">
          <h2 className="table-title">Recent Contracts</h2>
          <button className="premium-button" style={{ width: 'auto', padding: '8px 16px', marginTop: 0 }} onClick={() => navigate('/contracts')}>View All</button>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card title="Upcoming Deadlines" subtitle="Obligations due in the next 45 days">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            {deadlines.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Nothing due soon.</p>}
            {deadlines.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--primary-color)' }}>{d.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{d.contract} · due {d.dueDate}</div>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
                  color: d.daysLeft <= 7 ? '#DC2626' : '#2563EB',
                  background: d.daysLeft <= 7 ? '#FEE2E2' : '#DBEAFE',
                }}>
                  {d.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Latest updates across your contracts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            {activity.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', flexShrink: 0, borderRadius: '50%', background: '#1E3A8A', color: 'white', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {initials(a.user)}
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--primary-color)' }}><strong>{a.user}</strong> {a.action}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{a.target} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, trend, dir }) => (
  <div style={{ background: 'var(--background-white)', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-color)', margin: '6px 0' }}>{value}</div>
    {trend && (
      <span style={{
        fontSize: '11px', fontWeight: 700,
        color: dir === 'up' ? '#059669' : dir === 'down' ? '#DC2626' : '#64748B',
      }}>
        {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '·'} {trend}
      </span>
    )}
  </div>
);

const Card = ({ title, subtitle, children }) => (
  <div style={{ background: 'var(--background-white)', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--primary-color)' }}>{title}</h3>
    {subtitle && <p style={{ margin: '4px 0 12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{subtitle}</p>}
    {children}
  </div>
);

export default Dashboard;
