import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroShield from '../components/HeroShield';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      localStorage.setItem('token', data.access_token || data.token || 'jwt-session-token');
      if (data.user) {
        if (data.user.name) localStorage.setItem('userName', data.user.name);
        if (data.user.email) localStorage.setItem('userEmail', data.user.email);
      } else {
        localStorage.setItem('userName', email.split('@')[0]);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Demo login failed');
      localStorage.setItem('token', data.access_token || data.token);
      localStorage.setItem('userName', data.user?.name || 'Demo User');
      localStorage.setItem('userEmail', data.user?.email || 'demo@contractiq.com');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 ${
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

          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Secure Portal Login
          </h1>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Access your contract obligations, compliance reports, and audits.
          </p>
          
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

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="249XA33112@gprec.ac.in" 
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-4 pt-4 border-t border-slate-700/40 text-center">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isDarkMode
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60 hover:text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border-gray-200'
              }`}
            >
              <i className="fa-solid fa-bolt text-amber-400"></i>
              <span>One-Click Demo Sandbox Login</span>
            </button>
          </div>

          <div className={`mt-6 text-center text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Don't have an account or need new credentials?{' '}
            <Link 
              to="/register" 
              className={`font-bold transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'
              }`}
            >
              Request Access
            </Link>
          </div>
        </div>
      </div>

      {/* Right Branding Panel */}
      <div className={`hidden lg:flex lg:w-1/2 items-center justify-center flex-col relative overflow-hidden p-12 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#0f172a] via-[#161f2e] to-[#0b1121] border-l border-slate-800' 
          : 'bg-[#1E3A8A] text-white'
      }`}>
        <div className="z-10 text-center max-w-md flex flex-col items-center justify-center">
          <div className="w-64 h-64 mb-6 drop-shadow-2xl">
            <HeroShield />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-white">
            Enterprise Grade Security
          </h2>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>
            End-to-end encrypted contract intelligence, continuous obligation tracking, and automated risk detection.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-8 w-full text-left">
            <div className={`p-3.5 rounded-xl border text-xs ${
              isDarkMode 
                ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' 
                : 'bg-white/10 border-white/20 text-white'
            }`}>
              <i className="fa-solid fa-database text-blue-400 mb-1.5 block text-sm"></i>
              <span className="font-bold block">PostgreSQL Core</span>
              <span className="text-[11px] opacity-80">Full relational ACID transactions</span>
            </div>
            <div className={`p-3.5 rounded-xl border text-xs ${
              isDarkMode 
                ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' 
                : 'bg-white/10 border-white/20 text-white'
            }`}>
              <i className="fa-solid fa-key text-emerald-400 mb-1.5 block text-sm"></i>
              <span className="font-bold block">OTP Verification</span>
              <span className="text-[11px] opacity-80">10-minute expiry safety protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
