import React from 'react';
import AuthLayout from '../features/authentication/components/AuthLayout.jsx';
import LoginForm from '../features/authentication/components/LoginForm.jsx';

const Login = () => {
  return (
    <AuthLayout mode="split">
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
