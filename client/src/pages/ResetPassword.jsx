import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/theme.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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
      // Since it's a mock, we'll just simulate a successful password reset request
      // In a real app, you would send { token, password } to the backend.
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
    <div className="auth-page">
      <div className="auth-card">
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(0,217,36,0.1)', color: 'var(--success-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px auto' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h1 className="auth-title">Password Reset!</h1>
            <p className="auth-subtitle">
              Your password has been successfully reset.
            </p>
            <Link to="/login" className="premium-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 20px', width: 'auto', marginTop: '24px' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Create New Password</h1>
            <p className="auth-subtitle">Please enter your new password below.</p>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="premium-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={!token}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="premium-input" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  disabled={!token}
                />
              </div>
              <button type="submit" className="premium-button" disabled={isLoading || !token}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            
            <div className="auth-link" style={{ marginTop: '32px' }}>
              <Link to="/login"><i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
