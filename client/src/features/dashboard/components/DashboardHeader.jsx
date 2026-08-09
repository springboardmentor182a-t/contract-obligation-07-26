import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = ({ firstName, isDarkMode }) => {
  const navigate = useNavigate();
  return (
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
  );
};
