import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="px-6 h-16 bg-white/70 backdrop-blur-lg text-slate-800 flex justify-between items-center shadow-sm relative z-20 border-b border-white/40 sticky top-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-[#1E3A8A] to-[#3b82f6] rounded-lg flex items-center justify-center mr-3 shadow-md shadow-blue-500/20">
          <i className="fa-solid fa-file-signature text-white text-sm"></i>
        </div>
        <h2 className="m-0 text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A8A] to-[#3b82f6]">ContractIQ</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer text-slate-400 hover:text-[#1E3A8A] transition-colors" onClick={() => navigate('/notifications')}>
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute -top-0.5 -right-0.5 bg-[#EF4444] w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse"></span>
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 group-hover:border-[#1E3A8A] transition-colors">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 leading-none">Admin User</span>
            <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Online</span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-md cursor-pointer text-sm font-semibold transition-colors flex items-center shadow-sm ml-2"
        >
          <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
