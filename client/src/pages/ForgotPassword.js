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
      const response = await fetch("/api/auth/forgot-password", {
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
          "Email verified. You can now reset your password."
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
                    Enter your registered email address to continue with
                    password reset.
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
                      ? "Verifying Email..."
                      : "Verify Email Address"}
                  </button>
                </form>
              </>
            ) : (
                            <div className="forgot-success-content">
                <div className="forgot-success-icon">
                  <CheckCircle size={30} />
                </div>

                <h2>Email Verified</h2>

                <p>
                  Your account has been verified successfully. Continue to
                  create a new password.
                </p>

                {message && (
                  <div className="auth-message auth-message-success">
                    {message}
                  </div>
                )}

                <Link
                  to={`/reset-password?email=${encodeURIComponent(
                    email.trim()
                  )}`}
                  className="premium-sign-in-button auth-link-button"
                >
                  Continue to Reset Password
                </Link>
              </div>
            )}

            <Link to="/login" className="back-to-login-link">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>

          <footer className="premium-form-footer">
            <button type="button">Privacy Policy</button>
            <span>•</span>
            <button type="button">Terms of Service</button>
            <span>•</span>
            <button type="button">Help Center</button>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;