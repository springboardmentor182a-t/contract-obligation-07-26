import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/theme.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        // In a real SMTP configuration, we just rely on the backend sending the email.
        // We do not set any preview URL for security reasons.
      } else {
        setError(data.detail || "Failed to send reset link.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {!isSubmitted ? (
          <>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter your email and we'll send you a link to reset your password.</p>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input 
                  type="email" 
                  className="premium-input" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="premium-button" disabled={isLoading}>
                {isLoading ? 'Sending Email...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(0,217,36,0.1)', color: 'var(--success-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px auto' }}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-subtitle">
              We've sent a password reset link to <strong style={{color: 'var(--primary-color)'}}>{email}</strong>.
            </p>

          </div>
        )}

        <div className="auth-link" style={{ marginTop: '32px' }}>
          <Link to="/login"><i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
