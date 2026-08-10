import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  Users,
  Settings,
  X,
  FileSignature,
  CalendarCheck,
  CreditCard,
  Calculator
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`) 
      ? 'bg-blue-600/20 text-white border-l-4 border-blue-400' 
      : 'text-gray-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent';
  };

  const linkClass = "flex items-center px-6 py-3.5 mb-1 font-medium transition-all duration-200 group";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-[#0f172a] to-[#1e293b] border-r border-gray-800 text-white flex flex-col h-full overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0
      `}>
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800/60 mb-4 sticky top-0 bg-[#0f172a]/90 backdrop-blur-md z-10">
          <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <FileSignature className="w-5 h-5 text-white" />
            </div>
            <h2 className="m-0 text-2xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ContractIQ</h2>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-white focus:outline-none transition-colors" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Menu */}
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-6">
          Main Menu
        </div>
        <nav className="flex-1 pb-4">
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/dashboard')}`}>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all mr-4">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            Dashboard
          </Link>
          <Link to="/contracts" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/contracts')}`}>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all mr-4">
              <FileText className="w-5 h-5" />
            </div>
            Contracts
          </Link>
          <Link to="/obligations" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/obligations')}`}>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all mr-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            Obligations
          </Link>
          <Link to="/renewals" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/renewals')}`}>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 group-hover:scale-110 transition-all mr-4">
              <CalendarCheck className="w-5 h-5" />
            </div>
            Renewals
          </Link>
          <Link to="/compliance" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/compliance')}`}>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all mr-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            Compliance
          </Link>
          <Link to="/reports" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/reports')}`}>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 group-hover:scale-110 transition-all mr-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            Reports
          </Link>
        </nav>

        {/* System Settings */}
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-6 mt-4">
          System
        </div>
        <nav className="pb-6">
          <Link to="/transactions" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/transactions')}`}>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all mr-4">
              <CreditCard className="w-5 h-5" />
            </div>
            Transactions
          </Link>
          <Link to="/tax-estimators" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/tax-estimators')}`}>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all mr-4">
              <Calculator className="w-5 h-5" />
            </div>
            Tax Estimators
          </Link>
          <Link to="/users" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/users')}`}>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all mr-4">
              <Users className="w-5 h-5" />
            </div>
            User Management
          </Link>
          <Link to="/settings" onClick={() => setIsOpen(false)} className={`${linkClass} ${isActive('/settings')}`}>
            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400 group-hover:bg-slate-500/20 group-hover:scale-110 transition-all mr-4">
              <Settings className="w-5 h-5" />
            </div>
            Settings
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
