import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import RegisterForm from "../features/authentication/components/RegisterForm";
import "../styles/Auth.css";

function Signup() {
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
                Join your organization's secure ContractIQ workspace
              </p>
            </header>

            <RegisterForm />
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
