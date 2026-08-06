
import React, { useState, useEffect } from "react";
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
  Sliders
} from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [quickActionDropdown, setQuickActionDropdown] = useState(false);

  // Initialize theme from system or body classes
  useEffect(() => {
    const isDark = document.body.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="navbar">
      {/* Breadcrumb Left */}
      <div className="breadcrumb-area">
        <span className="breadcrumb-parent">ContractIQ</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Dashboard</span>
      </div>

      {/* Search Center-Left */}
      <div className="search-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search contracts, obligations, users..."
        />
      </div>

      {/* Right Navigation Controls */}
      <div className="nav-controls">
        {/* Calendar button */}
        <button className="icon-control-btn" title="Calendar">
          <Calendar className="control-icon" />
        </button>

        {/* Theme Toggle */}
        <button className="icon-control-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {isDarkMode ? (
            <Sun className="control-icon text-yellow" />
          ) : (
            <Moon className="control-icon" />
          )}
        </button>

        {/* Help Center */}
        <button className="icon-control-btn" title="Help Center">
          <HelpCircle className="control-icon" />
        </button>

        {/* System Alerts */}
        <button className="icon-control-btn alert-badge-wrapper" title="Notifications">
          <Bell className="control-icon" />
          <span className="notification-badge-dot">2</span>
        </button>

        {/* Quick Action Button */}
        <div className="quick-action-container">
          <button 
            className="quick-action-btn"
            onClick={() => setQuickActionDropdown(!quickActionDropdown)}
          >
            <Plus className="quick-action-icon" />
            <span>Quick Action</span>
          </button>
          {quickActionDropdown && (
            <div className="dropdown-menu quick-action-menu">
              <div className="dropdown-item">New Contract</div>
              <div className="dropdown-item">Add User</div>
              <div className="dropdown-item">Upload PDF</div>
              <div className="dropdown-item">Create Obligation</div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="profile-container">
          <div className="profile-trigger" onClick={() => setProfileDropdown(!profileDropdown)}>
            <div className="profile-avatar">AM</div>
            <div className="profile-info">
              <span className="profile-name">Arjun Mehta</span>
              <span className="profile-role">Administrator</span>
            </div>
            <ChevronDown className="profile-chevron" />
          </div>
          {profileDropdown && (
            <div className="dropdown-menu profile-menu">
              <div className="dropdown-item">
                <User className="dropdown-item-icon" />
                <span>My Profile</span>
              </div>
              <div className="dropdown-item">
                <Sliders className="dropdown-item-icon" />
                <span>Account Settings</span>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item text-danger">
                <LogOut className="dropdown-item-icon" />
                <span>Log Out</span>
              </div>

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin User');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className={`h-16 shadow-sm flex justify-between items-center px-4 md:px-6 z-20 border-b sticky top-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-gray-200'}`}>
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
            placeholder="Search..." 
            className={`bg-transparent border-none outline-none text-sm w-48 lg:w-64 ${isDarkMode ? 'text-slate-200 placeholder-slate-500' : 'text-gray-700 placeholder-gray-400'}`}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <div 
          className={`relative cursor-pointer transition-colors ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-gray-500 hover:text-[#1E3A8A]'}`}
          onClick={toggleTheme}
          title="Toggle Bright/Night Light"
        >
          {isDarkMode ? (
            <i className="fa-solid fa-moon text-xl"></i>
          ) : (
            <i className="fa-solid fa-sun text-xl"></i>
          )}
        </div>

        {/* Notification Bell */}
        <div className={`relative cursor-pointer transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-[#1E3A8A]'}`} onClick={() => navigate('/notifications')}>
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
        </div>
        
        <div className={`h-6 w-px hidden sm:block ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col">
              <span className={`text-sm font-semibold leading-none ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{userName}</span>
            </div>
            <i className={`fa-solid fa-chevron-down text-xs hidden md:block ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}></i>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 border z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
              <div className={`px-4 py-2 text-xs border-b mb-1 ${isDarkMode ? 'text-slate-400 border-slate-700' : 'text-gray-500 border-gray-100'}`}>
                Signed in as <br /><strong className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>{userName}</strong>
              </div>
              <button 
                onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
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


      <style>{`
        .navbar {
          height: 70px;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          flex-shrink: 0;
          z-index: 10;
          transition: background-color var(--transition-normal), border-color var(--transition-normal);
        }

        .breadcrumb-area {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .breadcrumb-parent {
          color: var(--text-muted);
        }

        .breadcrumb-separator {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Search input bar */
        .search-wrapper {
          position: relative;
          width: 320px;
          margin-left: 2rem;
          margin-right: auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 38px;
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          padding: 0 1rem 0 2.5rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          transition: border-color var(--transition-fast), background-color var(--transition-normal);
        }
        .search-input:focus {
          border-color: var(--color-blue);
          background-color: var(--bg-card);
        }

        /* Right Nav controls */
        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .icon-control-btn {
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }
        .icon-control-btn:hover {
          background-color: var(--bg-app);
          border-color: var(--border-color);
          color: var(--text-primary);
        }

        .control-icon {
          width: 18px;
          height: 18px;
        }
        .control-icon.text-yellow {
          color: #EAB308;
        }

        .alert-badge-wrapper {
          position: relative;
        }

        .notification-badge-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          background-color: #EF4444;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-card);
        }

        /* Quick Action */
        .quick-action-container {
          position: relative;
        }

        .quick-action-btn {
          height: 38px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .quick-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
        }

        .quick-action-icon {
          width: 15px;
          height: 15px;
        }

        /* User profile */
        .profile-container {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background-color var(--transition-fast);
        }
        .profile-trigger:hover {
          background-color: var(--bg-app);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          background-color: #8B5CF6;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .profile-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .profile-role {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .profile-chevron {
          width: 14px;
          height: 14px;
          color: var(--text-muted);
        }

        /* Dropdown common styles */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: var(--shadow-lg);
          min-width: 180px;
          z-index: 50;
          overflow: hidden;
          animation: fadeIn 0.15s ease-out forwards;
        }

        .quick-action-menu {
          right: 0;
        }

        .dropdown-item {
          padding: 0.65rem 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color var(--transition-fast), color var(--transition-fast);
          text-align: left;
        }
        .dropdown-item:hover {
          background-color: var(--bg-app);
          color: var(--text-primary);
        }

        .dropdown-item-icon {
          width: 15px;
          height: 15px;
          color: var(--text-muted);
        }

        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--border-color);
          margin: 0;
        }

        .text-danger {
          color: var(--color-red) !important;
        }
        .text-danger .dropdown-item-icon {
          color: var(--color-red) !important;
        }
      `}</style>
    </header>
  );
}

    </nav>
  );
};

export default Navbar;

