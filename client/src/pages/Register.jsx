import React from 'react';
import AuthLayout from '../features/authentication/components/AuthLayout.jsx';
import RegisterForm from '../features/authentication/components/RegisterForm.jsx';

const Register = () => {
  return (
    <AuthLayout mode="split">
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
