import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import { getDefaultRouteForRole } from "../utils/sidebarPermissions";
import { useUI } from "../context/UIContext";
import "../styles/Auth.css";
import { API_BASE } from "../config/api";
import { clearStoredAuth } from "../utils/auth";
const ROLES = [
  "Administrator",
  "Legal Manager",
  "Compliance Officer",
  "Contract Manager",
  "Department Head",
  "Employee",
];

function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useUI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Administrator");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter your email and password.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setMessage(data.detail || "Login failed. Please try again.");
        setMessageType("error");
        return;
      }

      if (!data.role) {
        setMessage("Login failed. Please try again.");
        setMessageType("error");
        return;
      }

      const authenticatedRole = data.role;
      const defaultRoute = getDefaultRouteForRole(authenticatedRole);
      if (!defaultRoute) {
        setMessage("This account role is not configured for application access.");
        setMessageType("error");
        return;
      }

      clearStoredAuth();

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("token", data.access_token);
      storage.setItem("role", authenticatedRole);
      storage.setItem("name", data.name || "ContractIQ User");
      storage.setItem("email", email.trim());

      setMessage("Login successful. Redirecting...");
      setMessageType("success");

      if (refreshUser) {
        const verifiedUser = await refreshUser();
        if (!verifiedUser || verifiedUser.role !== authenticatedRole) {
          clearStoredAuth();
          setMessage("Unable to verify the authenticated account.");
          setMessageType("error");
          return;
        }
      }

      navigate(defaultRoute);
    } catch (error) {

      console.error("Login error:", error);

      setMessage(
        "Unable to connect to the server. Please start the backend and try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className="premium-login-page">
      <AuthLeftPanel />

      <section className="premium-login-right">
        <div className="premium-login-wrapper">
          <div className="premium-login-card">
            <div className="premium-mobile-brand">
              <div className="premium-brand-icon">
                <ShieldCheck size={19} />
              </div>

              <span>ContractIQ</span>
            </div>

            <header className="premium-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your secure enterprise workspace</p>
            </header>

            <form
              onSubmit={handleLogin}
              className="premium-login-form"
            >
              <div className="premium-field">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="premium-input-wrapper">
                  <Mail
                    size={15}
                    className="premium-input-icon"
                  />

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="premium-field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="premium-input-wrapper">
                  <Lock
                    size={15}
                    className="premium-input-icon"
                  />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="premium-field">
                <label htmlFor="login-role">Role</label>

                <div className="premium-input-wrapper premium-select-wrapper">
                  <Briefcase
                    size={15}
                    className="premium-input-icon"
                  />

                  <select
                    id="login-role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                    disabled={loading}
                  >
                    {ROLES.map((roleName) => (
                      <option
                        value={roleName}
                        key={roleName}
                      >
                        {roleName}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="premium-select-arrow"
                  />
                </div>
              </div>

              <div className="premium-login-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) =>
                      setRemember(event.target.checked)
                    }
                    disabled={loading}
                  />

                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password-link"
                >
                  Forgot Password?
                </Link>
              </div>

              {message && (
                <div
                  className={`auth-message ${
                    messageType === "success"
                      ? "auth-message-success"
                      : "auth-message-error"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="premium-sign-in-button"
                disabled={loading}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In to ContractIQ"}
              </button>

              <div className="premium-divider">
                <span>or</span>
              </div>

              <Link
                to="/signup"
                className="premium-create-account-button"
              >
                Create New Account
              </Link>
            </form>
          </div>

          <footer className="premium-form-footer">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-of-service">Terms of Service</Link>
            <span>•</span>
            <Link to="/help">Help Center</Link>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Login;
