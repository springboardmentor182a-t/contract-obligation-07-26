
import React, { useState } from 'react';
import { signup } from '../services/signup';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await signup({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      if (response && response.id) {
        setSuccess(true);
        setFormData({ fullName: '', email: '', password: '' });
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Join ContractIQ today.</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Account created successfully!</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            className="form-input" 
            placeholder="Arjun Doe"
            value={formData.fullName}
            onChange={handleChange}
            required 
          />
        </div>
        
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
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="auth-link-text">
        Already have an account? <a href="/login" className="auth-link">Log in</a>
      </p>
    </div>
  );
}

