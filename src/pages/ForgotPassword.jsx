// ForgotPassword.jsx

import React from "react";
import "../styles/Auth.css";

function ForgotPassword() {
  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="overlay">
          <h1>Password Recovery</h1>
          <p>
            Reset your password securely
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <h2>Forgot Password</h2>

          <form>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <button className="login-btn">
              Send Reset Link
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;