import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const LoginFormFields = ({ email, setEmail, password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Corporate Email Address
        </label>
        <div className="relative">
          <i className={`fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}></i>
          <input 
            type="email" 
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
            }`}
            placeholder="name@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={`block text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Password
          </label>
          <Link 
            to="/forgot-password" 
            className={`text-xs font-semibold transition-colors ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'
            }`}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <i className={`fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}></i>
          <input 
            type={showPassword ? 'text' : 'password'} 
            className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
            }`}
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginFormFields;
