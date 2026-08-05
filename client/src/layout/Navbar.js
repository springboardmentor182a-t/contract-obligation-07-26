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
    </nav>
  );
};

export default Navbar;
