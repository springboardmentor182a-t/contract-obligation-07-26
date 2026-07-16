import React, { useState } from 'react';
import FormInput from '../../../components/Form/FormInput';
import Checkbox from '../../../components/Form/Checkbox';
import Button from '../../../components/Buttons/Button';
import { Mail, Lock, User, Briefcase, BadgeCheck, Building, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const rolesList = [
  { id: 'Admin', title: 'Admin', icon: <User size={16} /> },
  { id: 'Legal Manager', title: 'Legal Manager', icon: <Briefcase size={16} /> },
  { id: 'Compliance Officer', title: 'Compliance Officer', icon: <BadgeCheck size={16} /> },
  { id: 'Contract Manager', title: 'Contract Manager', icon: <Building size={16} /> },
];

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, role, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      
      <div className="input-group" style={{ marginBottom: '1rem' }}>
        <label className="input-label" style={{ marginBottom: '0.75rem', display: 'block', textAlign: 'center' }}>Select Your Role</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.5rem' }}>
          {rolesList.map(r => {
            const isSelected = role === r.id;
            return (
              <div 
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  padding: '0.5rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isSelected ? 'white' : 'var(--color-text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {r.icon}
                <span>{r.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '1rem' }}>
        <label className="input-label">Email Address</label>
        <div className="input-with-icon">
          <Mail size={18} className="input-icon" />
          <FormInput 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@contractiq.com" 
            required 
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '0.5rem' }}>
        <label className="input-label">Password</label>
        <div className="input-with-icon">
          <Lock size={18} className="input-icon" />
          <FormInput 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="auth-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <Checkbox 
          label="Remember me" 
          name="rememberMe" 
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)} 
        />
        <Link to="/forgot-password" className="text-sm font-semibold" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Forgot Password?</Link>
      </div>

      <Button type="submit" variant="primary" fullWidth className="mt-4" style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }} disabled={!role}>
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
