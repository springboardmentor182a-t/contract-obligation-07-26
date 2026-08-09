import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { Card } from './DashboardShared';

const RISK_COLORS = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Critical: '#EF4444' };
const STATUS_COLORS = { Active: '#10B981', Pending: '#F59E0B', Expired: '#94A3B8', Rejected: '#EF4444', Terminated: '#EF4444', Approved: '#3B82F6' };

export const ComplianceRiskCharts = ({ isDarkMode, complianceTrend, riskDistribution }) => {
  return (
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
  );
};
