import React from 'react';
import LoginForm from '../features/authentication/components/LoginForm';

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to ContractIQ</h2>
        <p>Please login to your account</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;