import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import LoginForm from "../features/authentication/components/LoginForm";
import "../styles/Auth.css";

function Login() {
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

            <LoginForm />
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
