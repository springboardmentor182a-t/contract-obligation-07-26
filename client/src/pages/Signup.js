import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import "../styles/Auth.css";
import { API_BASE } from "../config/api";
const ROLES = [
  "Administrator",
  "Legal Manager",
  "Compliance Officer",
  "Contract Manager",
  "Department Head",
  "Employee",
];

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    department: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const {
      name,
      organization,
      department,
      phone,
      email,
      password,
      confirmPassword,
      role,
    } = formData;

    if (
      !name.trim() ||
      !organization.trim() ||
      !department.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setMessage("Please complete all required fields.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match.");
      setMessageType("error");
      return;
    }

    if (!acceptedTerms) {
      setMessage(
        "Please accept the Terms of Service and Privacy Policy."
      );
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          organization: organization.trim(),
          department: department.trim(),
          phone: phone.trim(),
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
        setMessage(
          data.detail ||
            "Unable to create the account. Please try again."
        );
        setMessageType("error");
        return;
      }

      setMessage(
        "Account created successfully. Redirecting to login..."
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Unable to connect to the server. Please make sure the backend is running."
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
        <div className="premium-login-wrapper signup-wrapper">
          <div className="premium-login-card signup-card">
            <div className="premium-mobile-brand">
              <div className="premium-brand-icon">
                <ShieldCheck size={19} />
              </div>

              <span>ContractIQ</span>
            </div>

            <header className="premium-form-header">
              <h2>Create Account</h2>
              <p>
                Join your organization&apos;s secure ContractIQ workspace
              </p>
            </header>

            <form
              onSubmit={handleSignup}
              className="premium-login-form"
            >
              <div className="signup-grid">
                <div className="premium-field">
                  <label htmlFor="signup-name">Full Name</label>

                  <div className="premium-input-wrapper">
                    <User
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="premium-field">
                  <label htmlFor="signup-organization">
                    Organization
                  </label>

                  <div className="premium-input-wrapper">
                    <Building2
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Organization name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="premium-field">
                  <label htmlFor="signup-department">
                    Department
                  </label>

                  <div className="premium-input-wrapper">
                    <Briefcase
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-department"
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Legal / IT / Finance"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="premium-field">
                  <label htmlFor="signup-phone">
                    Phone Number
                  </label>

                  <div className="premium-input-wrapper">
                    <Phone
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="premium-field signup-full-width">
                  <label htmlFor="signup-email">
                    Email Address
                  </label>

                  <div className="premium-input-wrapper">
                    <Mail
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="premium-field">
                  <label htmlFor="signup-password">
                    Password
                  </label>

                  <div className="premium-input-wrapper">
                    <Lock
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
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
                  <label htmlFor="signup-confirm-password">
                    Confirm Password
                  </label>

                  <div className="premium-input-wrapper">
                    <Lock
                      size={15}
                      className="premium-input-icon"
                    />

                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="premium-field signup-full-width">
                  <label htmlFor="signup-role">
                    Select Role
                  </label>

                  <div className="premium-input-wrapper">
                    <Briefcase
                      size={15}
                      className="premium-input-icon"
                    />

                    <select
                      id="signup-role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
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
              </div>

              <label className="signup-terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  disabled={loading}
                />

                <span>
                  I accept the{" "}
                  <Link
                    to="/terms-of-service"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

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
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

              <p className="signup-login-text">
                Already have an account?{" "}
                <Link to="/login">Sign In</Link>
              </p>
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

export default Signup;
