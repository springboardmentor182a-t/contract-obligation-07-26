import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin User');
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifMenuRef = useRef(null);

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const getSemanticIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('renewal')) {
      return { icon: 'fa-solid fa-calendar-days', color: 'text-amber-400', bg: 'bg-amber-500/15' };
    }
    if (t.includes('approval')) {
      return { icon: 'fa-solid fa-circle-check', color: 'text-emerald-400', bg: 'bg-emerald-500/15' };
    }
    if (t.includes('risk')) {
      return { icon: 'fa-solid fa-shield-halved', color: 'text-rose-400', bg: 'bg-rose-500/15' };
    }
    return { icon: 'fa-solid fa-clipboard-check', color: 'text-blue-400', bg: 'bg-blue-500/15' };
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <nav className="px-6 h-16 bg-white/70 backdrop-blur-lg text-slate-800 flex justify-between items-center shadow-sm relative z-30 border-b border-white/40 sticky top-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-[#1E3A8A] to-[#3b82f6] rounded-lg flex items-center justify-center mr-3 shadow-md shadow-blue-500/20">
          <i className="fa-solid fa-file-signature text-white text-sm"></i>
        </div>
        <h2 className="m-0 text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A8A] to-[#3b82f6] mr-8">ContractIQ</h2>
        
        <div className="hidden md:flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors">Dashboard</button>
          <button onClick={() => navigate('/contracts')} className="text-sm font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors">Contracts</button>
          <button onClick={() => navigate('/obligations')} className="text-sm font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors">Obligations</button>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Notification Bell & Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative cursor-pointer text-slate-500 hover:text-[#1E3A8A] transition-colors p-1.5 rounded-lg focus:outline-none"
          >
            <i className="fa-regular fa-bell text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white shadow-sm animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 bg-white z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800">Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-blue-600 font-semibold hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {recentNotifications.map(n => {
                  const s = getSemanticIcon(n.type);
                  return (
                    <div 
                      key={n.id}
                      onClick={() => {
                        if (!n.is_read) markAsRead(n.id);
                        setIsNotifDropdownOpen(false);
                        navigate('/notifications');
                      }}
                      className={`p-3 flex items-start gap-3 cursor-pointer ${!n.is_read ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${s.bg} ${s.color}`}>
                        <i className={s.icon}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">{n.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{n.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50">
                <button
                  onClick={() => { setIsNotifDropdownOpen(false); navigate('/notifications'); }}
                  className="text-xs font-semibold text-[#1E3A8A] hover:underline"
                >
                  View All Activity →
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 leading-none">{userName}</span>
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
