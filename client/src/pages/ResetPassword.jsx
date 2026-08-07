import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../assets/theme.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Extract token from URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      setTimeout(() => {
        setSuccess(true);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("An error occurred. Please try again.");
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

      {/* Main Card */}
      <div className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl relative z-10 transition-all ${
        isDarkMode
          ? 'bg-[#161f2e] border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
          : 'bg-white border-gray-200 shadow-xl'
      }`}>
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl border ${
              isDarkMode
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
            }`}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h1 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Password Successfully Reset!
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Your new password has been applied. You can now access your account.
            </p>
            <button
              onClick={() => navigate('/login')}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                  : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
              }`}
            >
              <span>Back to Login</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-black shadow-lg ${
                  isDarkMode 
                    ? 'bg-blue-600 text-white shadow-blue-600/30' 
                    : 'bg-[#1E3A8A] text-white shadow-md'
                }`}>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E3A8A]'}`}>
                  Contract<span className="text-blue-500">IQ</span>
                </span>
              </div>
              <h1 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Create New Password
              </h1>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Please choose a secure new password for your account.
              </p>
            </div>
            
            {error && (
              <div className={`p-3 rounded-xl text-xs font-medium mb-4 flex items-start gap-2 border ${
                isDarkMode 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <i className="fa-solid fa-circle-exclamation text-sm mt-0.5 flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  New Password
                </label>
                <div className="relative">
                  <i className={`fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}></i>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                        : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
                    }`}
                    placeholder="Min 6 characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength="6"
                    disabled={!token}
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

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <i className={`fa-solid fa-check-double absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}></i>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                        : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
                    }`}
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    minLength="6"
                    disabled={!token}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                    : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
                }`}
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-key"></i>
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
            
            <div className={`mt-6 pt-4 border-t text-center text-xs ${
              isDarkMode ? 'border-slate-700/60 text-slate-400' : 'border-gray-200 text-slate-500'
            }`}>
              <Link 
                to="/login"
                className={`font-bold transition-colors inline-flex items-center gap-1 ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'
                }`}
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
                <span>Back to login</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
