import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const RegisterFormFields = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Full Name / Organization Lead
        </label>
        <div className="relative">
          <i className={`fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}></i>
          <input 
            type="text" 
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
            }`}
            placeholder="e.g. Mahendra" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
      </div>

      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
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
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Password
          </label>
          <div className="relative">
            <i className={`fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}></i>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
              }`}
              placeholder="Min 6 chars" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Confirm Password
          </label>
          <div className="relative">
            <i className={`fa-solid fa-check-double absolute left-3.5 top-1/2 -translate-y-1/2 text-xs ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}></i>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
              }`}
              placeholder="Re-enter password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              minLength="6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFormFields;
