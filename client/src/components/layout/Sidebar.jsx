import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardIcon, ContractsIcon, ObligationsIcon, ComplianceIcon, SettingsIcon, ReportsIcon, UsersIcon } from '../DashboardIcons';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-white/10 text-white border-l-4 border-emerald-400' : 'text-gray-300 hover:bg-white/5 hover:text-white';
  };

  const linkClass = "flex items-center px-4 py-3 mb-2 rounded-r-lg font-medium transition-colors duration-200 group";

  return (
    <aside className="w-64 bg-[#1E3A8A] text-white flex flex-col h-full overflow-y-auto">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4 pt-6">
        Main Menu
      </div>
      <nav className="flex-1 pr-4">
        <Link to="/dashboard" className={`${linkClass} ${isActive('/dashboard')}`}>
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 group-hover:scale-110 transition-transform mr-3">
            <DashboardIcon className="w-5 h-5" />
          </div>
          Dashboard
        </Link>
        <Link to="/contracts" className={`${linkClass} ${isActive('/contracts')}`}>
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform mr-3">
            <ContractsIcon className="w-5 h-5" />
          </div>
          Contract Repository
        </Link>
        <Link to="/obligations" className={`${linkClass} ${isActive('/obligations')}`}>
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform mr-3">
            <ObligationsIcon className="w-5 h-5" />
          </div>
          Obligation Tracker
        </Link>
        <Link to="/compliance" className={`${linkClass} ${isActive('/compliance')}`}>
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform mr-3">
            <ComplianceIcon className="w-5 h-5" />
          </div>
          Compliance Dashboard
        </Link>
        <Link to="/reports" className={`${linkClass} ${isActive('/reports')}`}>
          <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 group-hover:scale-110 transition-transform mr-3">
            <ReportsIcon className="w-5 h-5" />
          </div>
          Reports & Analytics
        </Link>
      </nav>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4 mt-8">
        System
      </div>
      <nav className="pr-4 mb-4">
        <Link to="/users" className={`${linkClass} ${isActive('/users')}`}>
          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 group-hover:scale-110 transition-transform mr-3">
            <UsersIcon className="w-5 h-5" />
          </div>
          User Management
        </Link>
        <Link to="/settings" className={`${linkClass} ${isActive('/settings')}`}>
          <div className="p-2 rounded-lg bg-slate-500/20 text-slate-300 group-hover:scale-110 transition-transform mr-3">
            <SettingsIcon className="w-5 h-5" />
          </div>
          Settings
        </Link>
      </nav>
      
      <div className="mt-auto border-t border-white/10">
        <Link to="/settings" className="pt-4 pb-4 flex items-center px-4 hover:bg-white/5 transition-colors no-underline text-white">
          <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold mr-3 shadow-md">
            {(localStorage.getItem('userName') || 'U').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold">{localStorage.getItem('userName')}</div>
          </div>
        </Link>
        
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/login';
          }}
          className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 font-medium transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
