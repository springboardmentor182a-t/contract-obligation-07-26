import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendForgotPasswordOTP, verifyOTP, resetPassword } from '../features/authentication/services/forgotPassword';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const data = await sendForgotPasswordOTP(email);
      setSuccessMsg(data.message || 'OTP has been sent to your registered email.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const data = await verifyOTP(email, otp);
      setSuccessMsg(data.message || 'OTP verified successfully.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      await resetPassword(email, newPassword);
      setSuccessMsg('Password has been reset successfully! You can now login.');
      setStep(4); // Success screen
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card text-center" style={{ margin: '0 auto', width: '100%', maxWidth: '420px', padding: '2.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
        
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Forgot Password</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter your email to receive a reset OTP.</p>
            
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #f87171' }}>{error}</div>}
            
            <input 
              type="email" 
              placeholder="Email address" 
              className="form-input" 
              style={{ width: '100%', marginBottom: '1rem' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Verify OTP</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>We sent a 6-digit code to <strong>{email}</strong>.</p>
            
            {successMsg && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #34d399' }}>{successMsg}</div>}
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #f87171' }}>{error}</div>}
            
            <input 
              type="text" 
              placeholder="Enter OTP (e.g., 123456)" 
              className="form-input" 
              style={{ width: '100%', marginBottom: '1rem', textAlign: 'center', letterSpacing: '2px', fontSize: '1.1rem' }} 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              maxLength={6}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
              <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}>Change Email</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Reset Password</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Create a new strong password for your account.</p>
            
            {successMsg && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #34d399' }}>{successMsg}</div>}
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #f87171' }}>{error}</div>}
            
            <input 
              type="password" 
              placeholder="New Password" 
              className="form-input" 
              style={{ width: '100%', marginBottom: '1rem' }} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              className="form-input" 
              style={{ width: '100%', marginBottom: '1.5rem' }} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Set New Password'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Password Reset</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{successMsg}</p>
            <button type="button" onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Login
            </button>
          </div>
        )}

        {step !== 4 && (
          <div className="mt-4" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Back to Login</Link>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ForgotPassword;
