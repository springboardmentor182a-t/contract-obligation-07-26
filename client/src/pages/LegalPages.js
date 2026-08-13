import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import AuthLeftPanel from "../components/AuthLeftPanel";
import "../styles/Auth.css";


const PRIVACY_SECTIONS = [
  {
    title: "Information handled by ContractIQ",
    content: [
      "ContractIQ handles account and profile information used to identify users and apply role-based access. It also handles contract records and uploaded contract documents, together with related obligation, renewal, compliance, notification, reporting, and audit-log information entered or generated through the application.",
      "Application usage and security events may be recorded where the existing audit and operational features require them.",
    ],
  },
  {
    title: "How application data is used",
    content: [
      "Information is used to authenticate users, display authorized application features, manage contracts and documents, track obligations and renewals, monitor compliance signals, deliver notifications and reports, and maintain application history.",
      "ContractIQ AI features may process relevant application data supplied by the backend to generate contract insights, renewal recommendations, compliance analysis, forecasts, or portfolio assurance information. AI services are not given direct database access.",
    ],
  },
  {
    title: "Access and security",
    content: [
      "Access should be limited to authorized users and the permissions assigned to their accounts. Users are responsible for protecting their credentials, signing out of shared devices, and promptly reporting suspected unauthorized access.",
      "ContractIQ uses application authentication and role information to control access, but users and administrators remain responsible for configuring accounts and permissions appropriately.",
    ],
  },
  {
    title: "Data disclosure and retention",
    content: [
      "Application data is exposed only through configured ContractIQ functionality and services needed to operate that functionality. ContractIQ does not claim a fixed retention period where none is configured in the project; retention and deletion depend on the application database, organizational practices, and authorized administrative actions.",
    ],
  },
  {
    title: "Accuracy and user responsibilities",
    content: [
      "Users should provide accurate information, upload only documents they are authorized to handle, and review generated reports and AI-assisted results before relying on them. Questions about account or application data can be raised through ContractIQ Help & Support.",
    ],
  },
];

const TERMS_SECTIONS = [
  {
    title: "Authorized use",
    content: [
      "ContractIQ may be used only for authorized contract-management activities. Users must follow the permissions assigned to their accounts and must not attempt to access another user's account, restricted application areas, or data outside their responsibilities.",
    ],
  },
  {
    title: "Accounts and role-based permissions",
    content: [
      "Users are responsible for keeping their credentials confidential and for activity performed through their accounts. A selected login role must match the role assigned to the authenticated database account. Role-based access does not authorize a user to misuse information that they can view.",
    ],
  },
  {
    title: "Contract operations",
    content: [
      "Users may use ContractIQ to manage contract records and documents, obligations, renewals, compliance tracking, notifications, reports, and related workflows. Users remain responsible for the accuracy, authorization, and business use of information they enter or upload.",
    ],
  },
  {
    title: "Audit information and prohibited activity",
    content: [
      "The application may record supported audit and usage events. Users must not bypass access controls, submit malicious content, interfere with application operation, falsify records, or use ContractIQ for unlawful or unauthorized purposes.",
    ],
  },
  {
    title: "AI-assisted features",
    content: [
      "AI-generated insights, assessments, forecasts, and recommendations are decision-support information. They are not automatic legal advice, do not replace professional review, and do not guarantee legal, regulatory, compliance, renewal, or business outcomes. Users must verify AI-assisted results before taking legal or business action.",
    ],
  },
  {
    title: "Availability and limitations",
    content: [
      "Application features may be unavailable during maintenance, configuration changes, database or network interruptions, or third-party service outages. ContractIQ does not guarantee that every notification, report, compliance signal, or AI result will be complete or error-free, and users should maintain appropriate operational review processes.",
    ],
  },
];

const styles = {
  right: {
    alignItems: "flex-start",
    overflowY: "auto",
  },
  wrapper: {
    width: "100%",
    maxWidth: 760,
  },
  card: {
    width: "100%",
    maxWidth: 760,
  },
  section: {
    marginTop: 22,
  },
  heading: {
    margin: "0 0 8px",
    color: "#0f172a",
    fontSize: 16,
  },
  paragraph: {
    margin: "0 0 9px",
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.7,
  },
  updated: {
    marginTop: 8,
    color: "#94a3b8",
    fontSize: 11,
  },
  backLink: {
    display: "inline-block",
    marginTop: 24,
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 700,
  },
};

function LegalPage({ title, introduction, sections }) {
  return (
    <main className="premium-login-page">
      <AuthLeftPanel />

      <section className="premium-login-right" style={styles.right}>
        <div className="premium-login-wrapper" style={styles.wrapper}>
          <article className="premium-login-card" style={styles.card}>
            <div className="premium-mobile-brand">
              <div className="premium-brand-icon">
                <ShieldCheck size={19} />
              </div>
              <span>ContractIQ</span>
            </div>

            <header className="premium-form-header">
              <h2>{title}</h2>
              <p>{introduction}</p>
              <div style={styles.updated}>Last updated: August 11, 2026</div>
            </header>

            {sections.map((section) => (
              <section key={section.title} style={styles.section}>
                <h3 style={styles.heading}>{section.title}</h3>
                {section.content.map((paragraph) => (
                  <p key={paragraph} style={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <Link to="/login" style={styles.backLink}>
              Back to Sign In
            </Link>
          </article>

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

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      introduction="This policy explains how ContractIQ handles information used by its contract-management and AI-assisted features."
      sections={PRIVACY_SECTIONS}
    />
  );
}

export function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      introduction="These terms describe the authorized use and practical limitations of the ContractIQ application."
      sections={TERMS_SECTIONS}
    />
  );
}
