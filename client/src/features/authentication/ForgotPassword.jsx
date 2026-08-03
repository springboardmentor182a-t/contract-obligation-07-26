import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // Wizard Steps: 1: Email, 2: OTP Verification, 3: Reset Password, 4: Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  // Status & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer;
    if (step === 2 && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Step 1: Request 6-digit OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const emailClean = email.trim().toLowerCase();
    if (!emailClean) {
      setError('Please enter a valid corporate email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate OTP. Please check your email.');
      }

      if (data.dev_otp) {
        setDevOtp(data.dev_otp);
      }

      setSuccessMessage(data.message || `6-digit verification code sent to ${emailClean}`);
      setStep(2);
      setResendCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const emailClean = email.trim().toLowerCase();
    const otpClean = otp.trim();

    if (otpClean.length !== 6) {
      setError('Please enter the complete 6-digit numeric OTP code.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, otp: otpClean })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid or expired OTP code.');
      }

      setSuccessMessage('OTP verified successfully. Please enter your new password.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      setIsLoading(false);
      return;
    }

    const emailClean = email.trim().toLowerCase();
    const otpClean = otp.trim();

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailClean,
          otp: otpClean,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password.');
      }

      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend OTP.');
      }

      if (data.dev_otp) {
        setDevOtp(data.dev_otp);
      }

      setSuccessMessage('A fresh 6-digit OTP code has been generated.');
      setResendCountdown(60);
      setCanResend(false);
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

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-24 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDarkMode ? 'bg-blue-600' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'
        }`}></div>
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl relative z-10 transition-all ${
        isDarkMode
          ? 'bg-[#161f2e] border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
          : 'bg-white border-gray-200 shadow-xl'
      }`}>
        {/* Brand Header */}
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
            {step === 1 && 'Reset Your Password'}
            {step === 2 && 'Enter 6-Digit OTP'}
            {step === 3 && 'Set New Password'}
            {step === 4 && 'Password Reset Complete'}
          </h1>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {step === 1 && 'Enter your registered corporate email to receive a verification OTP.'}
            {step === 2 && `We dispatched a 6-digit OTP code for ${email}`}
            {step === 3 && 'Create a strong, secure password for your enterprise account.'}
            {step === 4 && 'Your credentials have been securely updated in the database.'}
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between mb-6 px-2">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? (isDarkMode ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'bg-[#1E3A8A] text-white shadow-md')
                      : step > s
                      ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-700')
                      : (isDarkMode ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-gray-100 text-gray-400')
                  }`}
                >
                  {step > s ? <i className="fa-solid fa-check text-[10px]"></i> : s}
                </div>
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-1.5 transition-all ${
                    step > s
                      ? (isDarkMode ? 'bg-emerald-500/50' : 'bg-emerald-500')
                      : (isDarkMode ? 'bg-slate-800' : 'bg-gray-200')
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Alert */}
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

        {/* Success Alert */}
        {successMessage && step !== 4 && (
          <div className={`p-3 rounded-xl text-xs font-medium mb-4 flex items-start gap-2 border ${
            isDarkMode 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <i className="fa-solid fa-circle-check text-sm mt-0.5 flex-shrink-0"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: Request OTP ================= */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="249XA33112@gprec.ac.in"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                  : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Generating Verification OTP...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 2: Verify OTP ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Dev OTP Helper Badge */}
            {devOtp && (
              <div className={`p-3 rounded-xl border text-xs text-center ${
                isDarkMode 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
                  <i className="fa-solid fa-key"></i>
                  <span>Verification Code:</span>
                </div>
                <code className="text-base font-black tracking-widest px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 inline-block">
                  {devOtp}
                </code>
                <span className="block text-[11px] mt-1 opacity-80">
                  (Enter this 6-digit code below to proceed)
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  6-Digit OTP Code
                </label>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  <i className="fa-regular fa-clock mr-1"></i>
                  Valid for 10 mins
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className={`w-full text-center tracking-[12px] text-xl font-bold py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border border-slate-700/80 text-blue-400 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border border-gray-300 text-[#1E3A8A] focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
                }`}
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`transition-colors cursor-pointer ${
                  isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <i className="fa-solid fa-arrow-left mr-1"></i>
                Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className={`font-semibold transition-colors cursor-pointer ${
                  canResend
                    ? (isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700')
                    : 'opacity-50 cursor-not-allowed text-slate-500'
                }`}
              >
                {canResend ? 'Resend Code' : `Resend in ${resendCountdown}s`}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                otp.length === 6 && !isLoading
                  ? (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md')
                  : 'bg-slate-700 opacity-60 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-check"></i>
                  <span>Verify OTP Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 3: Reset Password ================= */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
                  }`}
                  required
                  minLength="6"
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
                Confirm New Password
              </label>
              <div className="relative">
                <i className={`fa-solid fa-check-double absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] shadow-sm'
                  }`}
                  required
                  minLength="6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                  : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Updating PostgreSQL Password...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-key"></i>
                  <span>Reset & Save New Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 4: Success Screen ================= */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl border ${
              isDarkMode
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
            }`}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            
            <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Password Successfully Reset!
            </h2>
            
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Your account password has been updated in the database. You can now log in securely with your new password.
            </p>

            <button
              onClick={() => navigate('/login')}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' 
                  : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
              }`}
            >
              <span>Go to Login Portal</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        )}

        {/* Footer Back to Sign In Link */}
        {step !== 4 && (
          <div className={`mt-6 pt-4 border-t text-center text-xs ${
            isDarkMode ? 'border-slate-700/60 text-slate-400' : 'border-gray-200 text-slate-500'
          }`}>
            Remembered your password?{' '}
            <Link
              to="/login"
              className={`font-bold transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#1E3A8A] hover:text-blue-700'
              }`}
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
