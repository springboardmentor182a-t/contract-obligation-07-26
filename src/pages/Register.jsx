// Register.jsx

import React from "react";
import "../styles/Auth.css";

function Register() {
  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="overlay">
          <h1>ContractIQ</h1>
          <p>Create your workspace securely</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <h2>Create Account</h2>

          <form>

            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter name" />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter email" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Create password" />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm password" />
            </div>

            <div className="input-group">
              <label>Select Role</label>

              <select>
                <option>Administrator</option>
                <option>Legal Manager</option>
                <option>Compliance Officer</option>
                <option>Contract Manager</option>
                <option>Department Head</option>
                <option>Employee</option>
              </select>
            </div>

            <button className="login-btn">
              Register
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Register;