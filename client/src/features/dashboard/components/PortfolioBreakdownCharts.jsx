import React from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import { Card } from './DashboardShared';

const STATUS_COLORS = { Active: '#10B981', Pending: '#F59E0B', Expired: '#94A3B8', Rejected: '#EF4444', Terminated: '#EF4444', Approved: '#3B82F6' };

export const PortfolioBreakdownCharts = ({ isDarkMode, contractStatus, renewalTimeline, deptPerformance }) => {
  return (
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
  );
};
