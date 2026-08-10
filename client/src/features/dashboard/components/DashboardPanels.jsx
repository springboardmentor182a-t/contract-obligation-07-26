import React from 'react';
import { Card } from './DashboardShared';

export const UpcomingDeadlines = ({ isDarkMode, deadlines }) => {
  return (
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
  );
};

export const RecentActivity = ({ isDarkMode, activity }) => {
  const initials = (name) => (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
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
  );
};
