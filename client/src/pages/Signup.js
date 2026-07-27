import React from 'react';
import SignupForm from '../features/authentication/components/SignupForm';

const Signup = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p>Join ContractIQ today</p>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;