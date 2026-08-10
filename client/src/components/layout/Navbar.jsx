import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  Calendar,
  Moon,
  Sun,
  HelpCircle,
  Bell,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Sliders,
  Menu
} from 'lucide-react';
import { logout } from '../../features/authentication/services/logout';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin User');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [quickActionDropdown, setQuickActionDropdown] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const notifMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const quickActionRef = useRef(null);

  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const toggleTheme = themeContext?.toggleTheme || (() => {
    document.documentElement.classList.toggle('dark');
  });

  const { 
    notifications = [], 
    unreadCount = 0, 
    markAsRead = () => {}, 
    markAllAsRead = () => {} 
  } = useNotifications() || {};

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target)) {
        setQuickActionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      } else {
        await axios.post('/api/auth/logout');
      }
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
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

  const recentNotifications = Array.isArray(notifications) ? notifications.slice(0, 5) : [];

  return (
    <nav className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 flex justify-between items-center px-4 md:px-8 z-20 sticky top-0 transition-colors duration-300">
      
      {/* Left side: Hamburger + Breadcrumb + Search */}
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          className="md:hidden text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span onClick={() => navigate('/dashboard')} className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors">ContractIQ</span>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide">Dashboard</span>
        </div>

        <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900/30 transition-all shadow-inner w-64 lg:w-80 ml-2 md:ml-4">
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search contracts, obligations..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* Right side: Controls + Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* Calendar */}
        <button 
          onClick={() => navigate('/obligations')}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
          title="Calendar"
        >
          <Calendar className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button 
          className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Help */}
        <button 
          onClick={() => navigate('/reports')}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
          title="Help Center"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Live Notifications Bell & Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none" 
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center border-2 border-white dark:border-gray-900 shadow-sm animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/90 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map(n => {
                    const s = getSemanticIcon(n.type);
                    return (
                      <div 
                        key={n.id}
                        onClick={() => {
                          if (!n.is_read) markAsRead(n.id);
                          setIsNotifDropdownOpen(false);
                          navigate('/notifications');
                        }}
                        className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${!n.is_read ? 'bg-blue-50/60 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${s.bg} ${s.color}`}>
                          <i className={s.icon}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{n.title}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{n.message}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-gray-400 dark:text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-2.5 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800/90">
                <button
                  onClick={() => { setIsNotifDropdownOpen(false); navigate('/notifications'); }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Activity →
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Action */}
        <div className="relative hidden md:block" ref={quickActionRef}>
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => setQuickActionDropdown(!quickActionDropdown)}
          >
            <Plus className="w-4 h-4" />
            <span>Quick Action</span>
          </button>
          
          {quickActionDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => { setQuickActionDropdown(false); navigate('/contracts'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">New Contract</button>
              <button onClick={() => { setQuickActionDropdown(false); navigate('/users'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Add User</button>
              <button onClick={() => { setQuickActionDropdown(false); navigate('/contracts'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Upload PDF</button>
              <button onClick={() => { setQuickActionDropdown(false); navigate('/obligations'); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Create Obligation</button>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1"></div>

        {/* User Profile */}
        <div className="relative" ref={profileMenuRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow border-2 border-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-900">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{userName}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Administrator</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 hidden lg:block transition-colors" />
          </div>

          {profileDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1 lg:hidden">
                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100">{userName}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">Administrator</span>
              </div>
              <button 
                onClick={() => { setProfileDropdown(false); navigate('/settings'); }}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" /> My Profile
              </button>
              <button 
                onClick={() => { setProfileDropdown(false); navigate('/settings'); }}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Sliders className="w-4 h-4 text-gray-400" /> Account Settings
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
