// Login.jsx

import React, { useState } from "react";
import "../styles/Auth.css";

function Login() {
  const [role, setRole] = useState("");

  return (
    <div className="auth-container">
      
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="overlay">
          <h1>ContractIQ</h1>
          <p>
            Smart Contract & Compliance Management Platform
          </p>

          <div className="quote-box">
            <h3>Welcome Back 👋</h3>
            <p>
              “Securely manage contracts, obligations, renewals,
              compliance, and reports in one intelligent platform.”
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Login</h2>
          <p className="subtitle">
            Access your ContractIQ workspace
          </p>

          <form>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="input-group">
              <label>Select Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Choose Role</option>
                <option>Administrator</option>
                <option>Legal Manager</option>
                <option>Compliance Officer</option>
                <option>Contract Manager</option>
                <option>Department Head</option>
                <option>Employee</option>
              </select>
            </div>

            <div className="remember">
              <label>
                <input type="checkbox" />
                Remember Me
              </label>

              <a href="/forgot-password">
                Forgot Password?
              </a>
            </div>

            <button className="login-btn">
              Login
            </button>
          </form>

          <div className="bottom-text">
            Don’t have an account?
            <a href="/register"> Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;