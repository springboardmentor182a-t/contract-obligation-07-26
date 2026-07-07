// ResetPassword.jsx

import React from "react";
import "../styles/Auth.css";

function ResetPassword() {
  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="overlay">
          <h1>Create New Password</h1>
          <p>
            Secure your ContractIQ account
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <h2>Reset Password</h2>

          <form>

            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
              />
            </div>

            <button className="login-btn">
              Update Password
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;