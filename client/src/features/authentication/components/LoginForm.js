
import React, { useState } from 'react';
import { login } from '../services/login';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      
      if (response && response.access_token) {
        localStorage.setItem('token', response.access_token);
        window.location.href = '/';
      } else {
        setError('Invalid login credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Log in to ContractIQ.</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="form-input" 
            placeholder="arjun@example.com"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            className="form-input" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <p className="auth-link-text">
        Don't have an account? <a href="/signup" className="auth-link">Sign up</a>
      </p>
    </div>
  );
}

