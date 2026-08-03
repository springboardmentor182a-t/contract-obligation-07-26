import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin User');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
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
      console.error('Logout error:', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const getSemanticIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('renewal')) {
      return {
        icon: 'fa-solid fa-calendar-days',
        color: isDarkMode ? 'text-amber-400' : 'text-amber-700',
        bg: isDarkMode ? 'bg-amber-500/15' : 'bg-amber-100'
      };
    }
    if (t.includes('approval') || t.includes('compliance')) {
      return {
        icon: 'fa-solid fa-circle-check',
        color: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
        bg: isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-100'
      };
    }
    if (t.includes('risk') || t.includes('danger') || t.includes('warning')) {
      return {
        icon: 'fa-solid fa-shield-halved',
        color: isDarkMode ? 'text-rose-400' : 'text-rose-700',
        bg: isDarkMode ? 'bg-rose-500/15' : 'bg-rose-100'
      };
    }
    if (t.includes('obligation')) {
      return {
        icon: 'fa-solid fa-clipboard-check',
        color: isDarkMode ? 'text-blue-400' : 'text-blue-700',
        bg: isDarkMode ? 'bg-blue-500/15' : 'bg-blue-100'
      };
    }
    return {
      icon: 'fa-solid fa-bolt',
      color: isDarkMode ? 'text-purple-400' : 'text-purple-700',
      bg: isDarkMode ? 'bg-purple-500/15' : 'bg-purple-100'
    };
  };

  const formatShortTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }
    setIsNotifDropdownOpen(false);
    if (item.link) {
      navigate(item.link);
    } else {
      navigate('/notifications');
    }
  };

  // Show 3 most recent notifications in the top popover
  const recentNotifications = notifications.slice(0, 3);

  return (
    <nav className={`h-16 shadow-sm flex justify-between items-center px-4 md:px-6 z-30 border-b sticky top-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4">
        {/* Hamburger Menu for Mobile */}
        <button 
          className={`md:hidden focus:outline-none ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-[#1E3A8A]'}`}
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Input */}
        <div className={`hidden sm:flex items-center rounded-lg px-3 py-2 border focus-within:ring-1 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 focus-within:border-blue-500 focus-within:ring-blue-500' : 'bg-gray-100 border-gray-200 focus-within:border-[#1E3A8A] focus-within:ring-[#1E3A8A]'}`}>
          <i className={`fa-solid fa-search mr-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}></i>
          <input 
            type="text" 
            placeholder="Search contracts, obligations..." 
            className={`bg-transparent border-none outline-none text-sm w-48 lg:w-64 ${isDarkMode ? 'text-slate-200 placeholder-slate-500' : 'text-gray-700 placeholder-gray-400'}`}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <div 
          className={`relative cursor-pointer transition-colors p-1.5 rounded-lg ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-gray-500 hover:text-[#1E3A8A] hover:bg-gray-100'}`}
          onClick={toggleTheme}
          title="Toggle Bright/Night Light"
        >
          {isDarkMode ? (
            <i className="fa-solid fa-moon text-lg"></i>
          ) : (
            <i className="fa-solid fa-sun text-lg"></i>
          )}
        </div>

        {/* Notification Bell with Badge & Dropdown Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className={`relative p-2 rounded-lg transition-all focus:outline-none ${
              isNotifDropdownOpen
                ? (isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-[#1E3A8A]')
                : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-[#1E3A8A] hover:bg-gray-100')
            }`}
            title="Notifications"
          >
            <i className="fa-regular fa-bell text-xl"></i>
            
            {/* Unread Red Circular Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-[#0f172a] shadow-sm animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Styled Notifications Popover Dropdown */}
          {isNotifDropdownOpen && (
            <div 
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-fadeIn ${
                isDarkMode ? 'bg-[#0f172a] border-slate-700/80 divide-slate-800' : 'bg-white border-gray-200 divide-gray-100'
              }`}
            >
              {/* Dropdown Header */}
              <div className={`px-4 py-3.5 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800 bg-[#131d33]' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isDarkMode 
                        ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className={`text-xs font-semibold transition-colors ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'
                    }`}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Recent Notifications List */}
              <div className={`max-h-80 overflow-y-auto divide-y ${isDarkMode ? 'divide-slate-800/50' : 'divide-gray-100'}`}>
                {recentNotifications.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <i className="fa-solid fa-bell-slash text-2xl text-slate-500 mb-2"></i>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      No notifications right now
                    </p>
                  </div>
                ) : (
                  recentNotifications.map((item) => {
                    const iconStyle = getSemanticIcon(item.type);
                    const isUnread = !item.is_read;

                    return (
                      <div
                        key={item.id || item.notification_id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                          isUnread
                            ? (isDarkMode ? 'bg-[#162238] hover:bg-[#1c2c48]' : 'bg-blue-50/70 hover:bg-blue-100/60')
                            : (isDarkMode ? 'hover:bg-slate-800/60 opacity-80 hover:opacity-100' : 'hover:bg-gray-50')
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${iconStyle.bg} ${iconStyle.color}`}>
                          <i className={iconStyle.icon}></i>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className={`text-xs truncate ${isUnread ? (isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold') : (isDarkMode ? 'text-slate-300 font-medium' : 'text-gray-700')}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">
                              {formatShortTime(item.created_at)}
                            </span>
                          </div>
                          <p className={`text-[11px] line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {item.message}
                          </p>
                        </div>

                        {/* Unread indicator dot */}
                        {isUnread && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 shadow-[0_0_6px_rgba(59,130,246,0.6)]"></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer: View All Activity */}
              <div className={`p-2.5 border-t text-center ${isDarkMode ? 'border-slate-800 bg-[#131d33]' : 'border-gray-100 bg-gray-50'}`}>
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(false);
                    navigate('/notifications');
                  }}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    isDarkMode
                      ? 'text-blue-400 hover:text-white hover:bg-blue-600/20'
                      : 'text-[#1E3A8A] hover:bg-blue-100/50'
                  }`}
                >
                  <span>View All Activity</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className={`h-6 w-px hidden sm:block ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col">
              <span className={`text-sm font-semibold leading-none ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{userName}</span>
            </div>
            <i className={`fa-solid fa-chevron-down text-xs hidden md:block ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}></i>
          </div>

          {/* User Menu */}
          {isUserDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 border z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
              <div className={`px-4 py-2 text-xs border-b mb-1 ${isDarkMode ? 'text-slate-400 border-slate-700' : 'text-gray-500 border-gray-100'}`}>
                Signed in as <br /><strong className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>{userName}</strong>
              </div>
              <button 
                onClick={() => { setIsUserDropdownOpen(false); navigate('/notifications'); }}
                className={`w-full text-left block px-4 py-2 text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-[#1E3A8A]'}`}
              >
                <i className="fa-regular fa-bell mr-2 w-4 text-center"></i> Notifications
              </button>
              <button 
                onClick={() => { setIsUserDropdownOpen(false); navigate('/settings'); }}
                className={`w-full text-left block px-4 py-2 text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-[#1E3A8A]'}`}
              >
                <i className="fa-solid fa-gear mr-2 w-4 text-center"></i> Settings
              </button>
              <button 
                onClick={handleLogout}
                className={`w-full text-left block px-4 py-2 text-sm ${isDarkMode ? 'text-red-400 hover:bg-slate-700 hover:text-red-300' : 'text-red-600 hover:bg-gray-50 hover:text-red-700'}`}
              >
                <i className="fa-solid fa-arrow-right-from-bracket mr-2 w-4 text-center"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
