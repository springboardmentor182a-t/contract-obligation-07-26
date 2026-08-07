import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { logout } from "../../features/authentication/services/logout";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin User');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [quickActionDropdown, setQuickActionDropdown] = useState(false);
  
  // Theme context
  // Fallback to local state if useTheme is not provided correctly
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const toggleTheme = themeContext?.toggleTheme || (() => {
    document.documentElement.classList.toggle('dark');
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      } else {
        await fetch('/api/auth/logout', { method: 'POST' });
      }
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <nav className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 flex justify-between items-center px-4 md:px-8 z-20 sticky top-0 transition-colors duration-300">
      
      {/* Left side: Hamburger + Breadcrumb + Search */}
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          className="md:hidden text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors focus:outline-none"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors">ContractIQ</span>
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
        <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Calendar">
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
        <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Help Center">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button 
          className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
          onClick={() => navigate('/notifications')}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
        </button>
        
        {/* Quick Action */}
        <div className="relative hidden md:block">
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => setQuickActionDropdown(!quickActionDropdown)}
          >
            <Plus className="w-4 h-4" />
            <span>Quick Action</span>
          </button>
          
          {quickActionDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">New Contract</button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Add User</button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Upload PDF</button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Create Obligation</button>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1"></div>

        {/* User Profile */}
        <div className="relative">
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
                onClick={() => { setProfileDropdown(false); navigate('/profile'); }}
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
