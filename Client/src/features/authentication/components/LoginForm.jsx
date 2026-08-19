import React, { useState } from 'react';
import FormInput from '../../../components/Form/FormInput';
import Checkbox from '../../../components/Form/Checkbox';
import Button from '../../../components/Buttons/Button';
import { Mail, Lock, User, Briefcase, BadgeCheck, Building, Users, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const rolesList = [];

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      


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
        <div className="input-with-icon" style={{ position: 'relative' }}>
          <Lock size={18} className="input-icon" />
          <FormInput 
            type={showPassword ? 'text' : 'password'} 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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

      <Button type="submit" variant="primary" fullWidth className="mt-4" style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}>
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
