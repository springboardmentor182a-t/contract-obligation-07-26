import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardIcon, ContractsIcon, ObligationsIcon, ComplianceIcon, SettingsIcon, ReportsIcon } from '../components/DashboardIcons';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { unreadCount } = useNotifications();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-white/10 text-white border-l-4 border-emerald-400' : 'text-gray-300 hover:bg-white/5 hover:text-white';
  };

  const linkClass = "flex items-center px-4 py-3 mb-2 rounded-r-lg font-medium transition-colors duration-200 group";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 ${isDarkMode ? 'bg-[#060B19] border-r border-white/10' : 'bg-[#1E3A8A]'} text-white flex flex-col h-full overflow-y-auto transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="flex items-center justify-between p-4 mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <i className="fa-solid fa-file-signature text-white text-sm"></i>
            </div>
            <h2 className="m-0 text-xl font-extrabold tracking-tight text-white">ContractIQ</h2>
          </div>
          <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">
          Menu
        </div>
        <nav className="flex-1 pr-4">
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/dashboard')}`}>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 mr-3">
              <DashboardIcon className="w-5 h-5" />
            </div>
            Dashboard
          </Link>
          <Link to="/contracts" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/contracts')}`}>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 mr-3">
              <ContractsIcon className="w-5 h-5" />
            </div>
            Contracts
          </Link>
          <Link to="/ai-analysis" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/ai-analysis') || isActive('/contract-details')}`}>
            <div className="p-2 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 text-white mr-3 shadow-md">
              <i className="fa-solid fa-microchip-ai w-5 h-5 flex items-center justify-center"></i>
            </div>
            AI Risk & Fraud
          </Link>
          <Link to="/obligations" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/obligations')}`}>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 mr-3">
              <ObligationsIcon className="w-5 h-5" />
            </div>
            Obligations
          </Link>
          <Link to="/renewals" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/renewals')}`}>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-300 mr-3">
              <i className="fa-solid fa-calendar-check w-5 h-5 flex items-center justify-center"></i>
            </div>
            Renewals
          </Link>
          <Link to="/compliance" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/compliance')}`}>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mr-3">
              <ComplianceIcon className="w-5 h-5" />
            </div>
            Compliance
          </Link>
          <Link to="/reports" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/reports')}`}>
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 mr-3">
              <ReportsIcon className="w-5 h-5" />
            </div>
            Reports
          </Link>
          <Link to="/notifications" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/notifications')}`}>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 mr-3">
              <i className="fa-regular fa-bell w-5 h-5 flex items-center justify-center"></i>
            </div>
            <span className="flex-1">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4 mt-8">
          System
        </div>
        <nav className="pr-4 mb-4">
          <Link to="/transactions" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/transactions')}`}>
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300 mr-3">
              <i className="fa-solid fa-money-bill-transfer w-5 h-5 flex items-center justify-center"></i>
            </div>
            Transactions
          </Link>
          <Link to="/tax-estimators" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/tax-estimators')}`}>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 mr-3">
              <i className="fa-solid fa-calculator w-5 h-5 flex items-center justify-center"></i>
            </div>
            Tax Estimators
          </Link>
          <Link to="/users" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/users')}`}>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 mr-3">
              <i className="fa-solid fa-users w-5 h-5 flex items-center justify-center"></i>
            </div>
            User Management
          </Link>
          <Link to="/settings" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/settings')}`}>
            <div className="p-2 rounded-lg bg-slate-500/20 text-slate-300 mr-3">
              <SettingsIcon className="w-5 h-5" />
            </div>
            Settings
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
