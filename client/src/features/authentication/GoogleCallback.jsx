import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const error = searchParams.get('error');
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');

        if (error) {
          throw new Error(decodeURIComponent(error) || 'Google SSO authentication was cancelled or failed.');
        }

        if (!token) {
          throw new Error('Authentication token was missing from the Google OAuth response.');
        }

        // Securely store token and user session profile
        localStorage.setItem('token', token);
        if (email) localStorage.setItem('userEmail', decodeURIComponent(email));
        if (name) localStorage.setItem('userName', decodeURIComponent(name));
        else if (email) localStorage.setItem('userName', email.split('@')[0]);

        setStatus('success');

        // Short smooth transition to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 800);
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred during Google SSO.');
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0b1121] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDarkMode ? 'bg-blue-600' : 'bg-blue-300'
        }`}></div>
      </div>

      <div className={`w-full max-w-md p-8 rounded-2xl border text-center shadow-2xl relative z-10 ${
        isDarkMode 
          ? 'bg-[#161f2e] border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.6)]' 
          : 'bg-white border-gray-200 shadow-xl'
      }`}>
        {/* Brand Shield */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-lg ${
            isDarkMode ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-[#1E3A8A] text-white shadow-md'
          }`}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
        </div>

        {status === 'processing' && (
          <div>
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className={`text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Verifying Google Credentials
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Authenticating session with ContractIQ security vault...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className={`text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Authentication Successful
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Redirecting to your Enterprise Dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Authentication Failed
            </h2>
            <p className={`text-xs mb-6 ${isDarkMode ? 'text-rose-300' : 'text-rose-600'}`}>
              {errorMessage}
            </p>
            <Link
              to="/login"
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white shadow-md transition-all ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#1E3A8A] hover:bg-[#152a6b]'
              }`}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
