import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import "../styles/Auth.css";
import { API_BASE } from "../config/api";
function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetToken = useMemo(
    () => searchParams.get("token") || "",
    [searchParams]
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [linkStatus, setLinkStatus] = useState(
    resetToken ? "checking" : "invalid"
  );

  useEffect(() => {
    let cancelled = false;

    if (!resetToken) {
      setMessage("This password reset link is invalid or has expired.");
      setMessageType("error");
      setLinkStatus("invalid");
      return undefined;
    }

    async function validateLink() {
      try {
        const response = await fetch(
          `${API_BASE}/auth/reset-password/validate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: resetToken }),
          }
        );

        if (cancelled) return;

        if (!response.ok) {
          setLinkStatus("invalid");
          setMessage("This password reset link is invalid or has expired.");
          setMessageType("error");
          return;
        }

        setLinkStatus("valid");
        setMessage("");
        setMessageType("");
      } catch {
        if (cancelled) return;
        setLinkStatus("invalid");
        setMessage("Unable to validate this password reset link.");
        setMessageType("error");
      }
    }

    validateLink();
    return () => {
      cancelled = true;
    };
  }, [resetToken]);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (linkStatus !== "valid" || !resetToken) {
      setMessage("This password reset link is invalid or has expired.");
      setMessageType("error");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("Please enter and confirm your new password.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          new_password: newPassword,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 400) {
          setLinkStatus("invalid");
        }
        setMessage(
          data.detail || "Unable to reset your password."
        );
        setMessageType("error");
        return;
      }

      setResetComplete(true);
      setMessage(
        data.message ||
          "Your password has been reset successfully."
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error("Reset password error:", error);

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

            {!resetComplete ? (
              <>
                <div className="auth-page-icon">
                  <KeyRound size={24} />
                </div>

                <header className="premium-form-header">
                  <h2>Create New Password</h2>
                  <p>
                    Choose a strong password to secure your ContractIQ
                    account.
                  </p>
                </header>

                {linkStatus === "checking" && (
                  <div className="auth-message auth-message-success" role="status">
                    Validating your secure reset link...
                  </div>
                )}

                {linkStatus === "invalid" && (
                  <>
                    {message && (
                      <div className="auth-message auth-message-error" role="alert">
                        {message}
                      </div>
                    )}
                    <Link
                      to="/forgot-password"
                      className="premium-sign-in-button auth-link-button"
                    >
                      Request a New Reset Link
                    </Link>
                  </>
                )}

                {linkStatus === "valid" && (
                  <form
                    onSubmit={handleResetPassword}
                    className="premium-login-form"
                  >
                  <div className="premium-field">
                    <label htmlFor="new-password">
                      New Password
                    </label>

                    <div className="premium-input-wrapper">
                      <Lock
                        size={15}
                        className="premium-input-icon"
                      />

                      <input
                        id="new-password"
                        type={
                          showNewPassword ? "text" : "password"
                        }
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        disabled={loading}
                        required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowNewPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showNewPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        disabled={loading}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="premium-field">
                    <label htmlFor="confirm-new-password">
                      Confirm New Password
                    </label>

                    <div className="premium-input-wrapper">
                      <Lock
                        size={15}
                        className="premium-input-icon"
                      />

                      <input
                        id="confirm-new-password"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Re-enter new password"
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

                  <div className="password-requirements">
                    <p>Password should contain:</p>

                    <ul>
                      <li>At least 8 characters</li>
                      <li>Uppercase and lowercase letters</li>
                      <li>At least one number or symbol</li>
                    </ul>
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
                      ? "Resetting Password..."
                      : "Reset Password"}
                  </button>
                  </form>
                )}
              </>
            ) : (
              <div className="forgot-success-content">
                <div className="forgot-success-icon">
                  <CheckCircle size={30} />
                </div>

                <h2>Password Reset Successful</h2>

                <p>
                  Your password has been updated successfully. You will be
                  redirected to the login page.
                </p>

                {message && (
                  <div className="auth-message auth-message-success">
                    {message}
                  </div>
                )}

                <Link
                  to="/login"
                  className="premium-sign-in-button auth-link-button"
                >
                  Continue to Sign In
                </Link>
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

export default ResetPassword;
