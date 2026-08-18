import React from 'react';

export const StatBox = ({ isDarkMode, label, value, trend, dir }) => (
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

export const Card = ({ isDarkMode, title, subtitle, children }) => (
  <div className={`rounded-xl border p-5 transition-all ${
    isDarkMode ? 'bg-[#161F2E] border-[#2A364F] shadow-lg' : 'bg-white border-slate-200 shadow-sm'
  }`}>
    <h3 className={`text-sm font-bold m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>{title}</h3>
    {subtitle && <p className={`text-xs mt-1 mb-3 ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>{subtitle}</p>}
    {children}
  </div>
);
