import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import "../styles/Auth.css";
import { API_BASE } from "../config/api";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!email.trim()) {
      setMessage("Please enter your registered email address.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
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
          data.detail || "Unable to verify this email address."
        );
        setMessageType("error");
        return;
      }

      setSent(true);
      setMessage(
        data.message ||
          "If an account exists for this email, a password reset link has been sent."
      );
      setMessageType("success");
    } catch (error) {
      console.error("Forgot password error:", error);

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

            {!sent ? (
              <>
                <div className="auth-page-icon">
                  <Mail size={24} />
                </div>

                <header className="premium-form-header">
                  <h2>Forgot Password?</h2>
                  <p>
                    Enter your registered email address to request a secure
                    password reset link.
                  </p>
                </header>

                <form
                  onSubmit={handleForgotPassword}
                  className="premium-login-form"
                >
                  <div className="premium-field">
                    <label htmlFor="forgot-email">
                      Email Address
                    </label>

                    <div className="premium-input-wrapper">
                      <Mail
                        size={15}
                        className="premium-input-icon"
                      />

                      <input
                        id="forgot-email"
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
                      ? "Sending Reset Link..."
                      : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              <div className="forgot-success-content">
                <div className="forgot-success-icon">
                  <CheckCircle size={30} />
                </div>

                <h2>Check Your Email</h2>

                <p>
                  If an active account matches that address, ContractIQ has
                  sent a secure password reset link.
                </p>

                {message && (
                  <div className="auth-message auth-message-success">
                    {message}
                  </div>
                )}

              </div>
            )}

            <Link to="/login" className="back-to-login-link">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
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

export default ForgotPassword;
