import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLeftPanel from "../components/AuthLeftPanel";
import FormInput from "../components/Form/FormInput";
import { API_BASE } from "../config/api";
import "../styles/Auth.css";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  
  const navigate = useNavigate();

  async function handleRequestOtp(e) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to request OTP");
      setSuccessMsg("An OTP has been sent to your email.");
      setTimeout(() => setSuccessMsg(""), 3000);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid or expired OTP");
      setSuccessMsg("OTP verified successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reset password");
      setSuccessMsg("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="premium-login-page">
      <AuthLeftPanel />
      <section className="premium-login-right">
        <div className="premium-login-wrapper">
          <Link to="/login" className="back-to-login" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "20px", fontSize: "13px", fontWeight: "600" }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
          
          <div className="premium-login-card">
            <div className="premium-mobile-brand">
              <div className="premium-brand-icon">
                <ShieldCheck size={19} />
              </div>
              <span>ContractIQ</span>
            </div>

            <header className="premium-form-header">
              <h2>{step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "8px" }}>
                {step === 1 && "Enter your email to receive a secure reset code"}
                {step === 2 && `Enter the 6-digit code sent to ${email}`}
                {step === 3 && "Create a new strong password for your account"}
              </p>
            </header>

            {successMsg && (
              <div className="auth-success" style={{ padding: "12px", background: "var(--emerald-10)", color: "var(--emerald)", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "500" }}>
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            {step === 1 && (
              <form className="auth-form" onSubmit={handleRequestOtp}>
                <FormInput 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@contractiq.com" 
                />
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="quick-action auth-submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <FormInput 
                  label="6-Digit OTP" 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="123456" 
                  maxLength={6}
                />
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="quick-action auth-submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            {step === 3 && (
              <form className="auth-form" onSubmit={handleResetPassword}>
                <FormInput 
                  label="New Password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Enter new password" 
                />
                <FormInput 
                  label="Confirm New Password" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password" 
                />
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="quick-action auth-submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
