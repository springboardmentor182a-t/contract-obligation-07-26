import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import LoginForm from '../features/authentication/components/LoginForm';
import { loginService } from '../features/authentication/services/login';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLoginSubmit = async (credentials) => {
    setError('');
    setLoading(true);
    try {
      await loginService(credentials);
      await refreshProfile();
      // Only navigate if login is fully successful
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card-wide" style={{ margin: '0 auto', padding: 0, overflow: 'hidden', display: 'flex', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '900px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>

        {/* Card Left - Graphic Area */}
        <div className="hidden-on-mobile" style={{
          flex: 1,
          background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
          color: 'white',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Background Pattern */}
          <ShieldCheck size={250} style={{ position: 'absolute', opacity: 0.05, transform: 'rotate(-20deg)', top: '10%', left: '-10%' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '1rem', backdropFilter: 'blur(10px)' }}>
              <ShieldCheck size={32} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>ContractIQ</h2>
            <p style={{ opacity: 0.85, fontSize: '1rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
              The intelligent way to manage contracts and track obligations.
            </p>
          </div>
        </div>

        {/* Card Right - Form Area */}
        <div className="auth-form-area">
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '0.25rem' }}>Welcome Back</h1>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sign in to access your account</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #f87171' }}>
              {error}
            </div>
          )}

          <LoginForm onSubmit={handleLoginSubmit} disabled={loading} />

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Request Access</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
