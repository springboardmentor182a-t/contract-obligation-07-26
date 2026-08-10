import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import GoogleAuthButton from './GoogleAuthButton.jsx';
import LoginFormFields from './LoginFormFields.jsx';
import DemoLoginButton from './DemoLoginButton.jsx';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid email or password');
      localStorage.setItem('token', data.access_token || data.token || 'jwt-session-token');
      if (data.user?.name) localStorage.setItem('userName', data.user.name);
      if (data.user?.email) localStorage.setItem('userEmail', data.user.email);
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
      const res = await fetch(`${API_BASE}/api/auth/demo-login`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Demo login failed');
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
    <div>
      <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Secure Portal Login
      </h1>
      <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Access your contract obligations, compliance reports, and audits.
      </p>
      
      {error && (
        <div className={`p-3.5 rounded-xl text-xs font-medium mb-6 flex items-start gap-2.5 border ${
          isDarkMode ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <i className="fa-solid fa-circle-exclamation text-sm mt-0.5 flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="mb-5">
        <GoogleAuthButton text="Sign in with Google" disabled={isLoading} />
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-gray-200'}`}></div>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          or continue with email
        </span>
        <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-gray-200'}`}></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <LoginFormFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            isDarkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
          }`} 
        >
          {isLoading ? (
            <><i className="fa-solid fa-spinner fa-spin"></i><span>Authenticating...</span></>
          ) : (
            <><i className="fa-solid fa-arrow-right-to-bracket"></i><span>Secure Login</span></>
          )}
        </button>
      </form>

      <DemoLoginButton onDemoLogin={handleDemoLogin} isLoading={isLoading} />

      <div className={`mt-6 text-center text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Don't have an account or need new credentials?{' '}
        <Link to="/register" className={`font-bold transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'}`}>
          Request Access
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
