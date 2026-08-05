import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import GoogleAuthButton from './GoogleAuthButton.jsx';
import RegisterFormFields from './RegisterFormFields.jsx';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

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
      const response = await fetch(`${API_BASE}/api/auth/register`, {
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
      if (!response.ok) throw new Error(data.detail || 'Failed to create enterprise account.');

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
    <div>
      <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Request Enterprise Access
      </h1>
      <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Create your account to start managing contracts and obligation audits.
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
        <GoogleAuthButton text="Sign up with Google" disabled={isLoading} />
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-gray-200'}`}></div>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          or register with corporate email
        </span>
        <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-gray-200'}`}></div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <RegisterFormFields 
          name={name} setName={setName} 
          email={email} setEmail={setEmail} 
          password={password} setPassword={setPassword} 
          confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} 
        />

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
            }`}
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i><span>Creating Account...</span></>
            ) : (
              <><i className="fa-solid fa-user-plus"></i><span>Create Enterprise Account</span></>
            )}
          </button>
        </div>
      </form>

      <div className={`mt-6 pt-4 border-t text-center text-xs ${isDarkMode ? 'border-slate-700/60 text-slate-400' : 'border-gray-200 text-slate-500'}`}>
        Already have an existing enterprise account?{' '}
        <Link to="/login" className={`font-bold transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'}`}>
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
