import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password, 
          confirm_password: confirmPassword 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create enterprise account.');
      }

      // On successful registration, save user session and redirect to dashboard
      localStorage.setItem('token', data.access_token || data.token || 'jwt-session-token');
      localStorage.setItem('userName', data.user?.name || name.trim() || email.split('@')[0]);
      localStorage.setItem('userEmail', data.user?.email || email.trim().toLowerCase());
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${
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
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-25 ${
          isDarkMode ? 'bg-blue-600' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDarkMode ? 'bg-emerald-600' : 'bg-emerald-300'
        }`}></div>
      </div>

      {/* Main Registration Card */}
      <div className={`w-full max-w-lg rounded-2xl border p-6 sm:p-10 shadow-2xl relative z-10 transition-all ${
        isDarkMode
          ? 'bg-[#161f2e] border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
          : 'bg-white border-gray-200 shadow-xl'
      }`}>
        {/* Header with Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg ${
              isDarkMode 
                ? 'bg-blue-600 text-white shadow-blue-600/30' 
                : 'bg-[#1E3A8A] text-white shadow-md'
            }`}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <span className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E3A8A]'}`}>
              Contract<span className="text-blue-500">IQ</span>
            </span>
          </div>

          <h1 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Request Enterprise Access
          </h1>
          <p className={`text-xs sm:text-sm mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Create your account to start managing contracts and obligation audits.
          </p>
        </div>
        
        {error && (
          <div className={`p-3.5 rounded-xl text-xs font-medium mb-6 flex items-start gap-2.5 border ${
            isDarkMode 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <i className="fa-solid fa-circle-exclamation text-sm mt-0.5 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder="Mahendra (or Admin Name)" 
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
                placeholder="249XA33112@gprec.ac.in" 
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
                  placeholder="Min 6 characters" 
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

          <div className="pt-2">
            <button 
              type="submit" 
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                  : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Creating Account & Provisioning...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Create Account & Grant Access</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className={`mt-6 pt-4 border-t text-center text-xs ${
          isDarkMode ? 'border-slate-700/60 text-slate-400' : 'border-gray-200 text-slate-500'
        }`}>
          Already have an existing enterprise account?{' '}
          <Link 
            to="/login" 
            className={`font-bold transition-colors ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'
            }`}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
