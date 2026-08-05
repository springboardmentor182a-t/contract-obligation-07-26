import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Make sure the backend is running and seeded.');
    } finally {
      setDemoLoading(false);
    }
  };

  const fillDemo = (email) => {
    setForm({ email, password: 'Password@123' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}><Shield size={22} color="#10b981" /></div>
          <span style={styles.brandName}>ContractIQ</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account to continue</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ ...styles.input, paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}><span>or continue with demo</span></div>

        <button onClick={handleDemo} disabled={demoLoading} style={styles.demoBtn}>
          {demoLoading ? 'Loading...' : '⚡ Access Demo (Legal Manager)'}
        </button>

        {/* Demo credentials reference */}
        <div style={styles.credBox}>
          <p style={styles.credTitle}>Demo Credentials (password: Password@123)</p>
          <div style={styles.credGrid}>
            {[
              { label: 'Legal Manager', email: 'legal.manager@contractiq.com' },
              { label: 'Compliance Officer', email: 'compliance@contractiq.com' },
              { label: 'Contract Manager', email: 'contracts@contractiq.com' },
            ].map((c) => (
              <button key={c.email} onClick={() => fillDemo(c.email)} style={styles.credBtn}>
                <span style={styles.credRole}>{c.label}</span>
                <span style={styles.credEmail}>{c.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0d1a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  card: {
    background: 'rgba(17,24,39,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(20px)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginBottom: '1.75rem',
  },
  brandIcon: {
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '10px',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#fff',
    fontWeight: '800',
    fontSize: '1.2rem',
    letterSpacing: '-0.02em',
  },
  title: { color: '#fff', fontSize: '1.6rem', fontWeight: '700', margin: '0 0 0.4rem 0' },
  subtitle: { color: '#64748b', fontSize: '0.875rem', margin: '0 0 1.5rem 0' },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#f87171',
    fontSize: '0.82rem',
    marginBottom: '1.25rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '0.85rem', color: '#475569', pointerEvents: 'none' },
  input: {
    width: '100%',
    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.85rem',
    background: 'none',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
  primaryBtn: {
    marginTop: '0.5rem',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
    transition: 'opacity 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0 1rem',
    color: '#334155',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '::before': { content: '""', flex: 1, borderTop: '1px solid rgba(255,255,255,0.06)' },
  },
  demoBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '10px',
    color: '#10b981',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginBottom: '1.5rem',
  },
  credBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '1rem',
  },
  credTitle: { color: '#475569', fontSize: '0.72rem', fontWeight: '600', margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.04em' },
  credGrid: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  credBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    padding: '0.55rem 0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    transition: 'background 0.15s',
  },
  credRole: { color: '#94a3b8', fontSize: '0.72rem', fontWeight: '700' },
  credEmail: { color: '#3b82f6', fontSize: '0.75rem' },
};
