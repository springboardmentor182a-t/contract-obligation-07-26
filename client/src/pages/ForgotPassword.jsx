import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/theme.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
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
        if (data.preview_url) {
          setPreviewUrl(data.preview_url);
        }
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

            {previewUrl && (
              <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'rgba(99,91,255,0.1)', borderRadius: '12px', border: '1px solid rgba(99,91,255,0.2)' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  <i className="fa-solid fa-flask" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i>
                  Test Mode Active
                </p>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Since you don't have a real SMTP provider configured, we intercepted the email using <strong>Ethereal Email</strong>.
                </p>
                <a href={previewUrl} target="_blank" rel="noreferrer" className="premium-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 20px', width: 'auto', fontSize: '14px' }}>
                  Open Ethereal Inbox
                </a>
              </div>
            )}
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
