import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import AuthBrandingPanel from './AuthBrandingPanel.jsx';

const AuthLayout = ({ children, mode = 'split' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`relative min-h-screen flex overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0b1121] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Floating Theme Toggle Switch */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
            isDarkMode
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80 hover:text-white'
              : 'bg-white hover:bg-gray-100 text-slate-700 border-gray-200 shadow-sm'
          }`}
          title="Toggle Light / Dark Mode"
        >
          {isDarkMode ? (
            <>
              <i className="fa-solid fa-sun text-amber-400 text-sm"></i>
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-moon text-blue-600 text-sm"></i>
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Ambient background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 ${
          isDarkMode ? 'bg-blue-600' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          isDarkMode ? 'bg-indigo-600' : 'bg-purple-300'
        }`}></div>
      </div>

      {/* Left Form Panel */}
      <div className={`w-full ${mode === 'split' ? 'lg:w-1/2' : 'max-w-xl mx-auto'} flex items-center justify-center p-6 sm:p-12 z-10 ${
        isDarkMode ? 'bg-[#0b1121]/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
      }`}>
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg ${
              isDarkMode 
                ? 'bg-blue-600 text-white shadow-blue-600/30' 
                : 'bg-[#1E3A8A] text-white shadow-md'
            }`}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E3A8A]'}`}>
                Contract<span className="text-blue-500">IQ</span>
              </span>
              <span className={`block text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enterprise Platform
              </span>
            </div>
          </div>

          {children}
        </div>
      </div>

      {/* Right Branding Panel (for split mode) */}
      {mode === 'split' && <AuthBrandingPanel isDarkMode={isDarkMode} />}
    </div>
  );
};

export default AuthLayout;
