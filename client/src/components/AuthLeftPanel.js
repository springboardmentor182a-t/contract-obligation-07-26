import React from "react";
import {
  BarChart2,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles size={18} />,
    title: "AI Contract Analysis",
    description: "AI-powered clause detection",
    className: "feature-purple",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Compliance Monitoring",
    description: "Real-time obligation tracking",
    className: "feature-green",
  },
  {
    icon: <Zap size={18} />,
    title: "Automated Approvals",
    description: "Workflow automation engine",
    className: "feature-yellow",
  },
  {
    icon: <Lock size={18} />,
    title: "Enterprise Security",
    description: "Secure role-based access",
    className: "feature-blue",
  },
  {
    icon: <Users size={18} />,
    title: "Team Collaboration",
    description: "Department-based workflows",
    className: "feature-teal",
  },
  {
    icon: <BarChart2 size={18} />,
    title: "Risk Intelligence",
    description: "Predictive risk scoring",
    className: "feature-red",
  },
];

function AuthLeftPanel() {
  return (
    <section className="premium-login-left">
      <div className="login-background-pattern" />
      <div className="login-background-glow" />

      <header className="premium-brand">
        <div className="premium-brand-icon">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h1>ContractIQ</h1>
          <p>AI-powered contract platform</p>
        </div>
      </header>

      <div className="premium-left-content">
        <div className="premium-feature-grid">
          {FEATURES.map((feature) => (
            <article
              className={`premium-feature-card ${feature.className}`}
              key={feature.title}
            >
              <div className="premium-feature-icon">
                {feature.icon}
              </div>

              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="compliance-card">
          <div className="compliance-header">
            <div className="compliance-live">
              <span className="live-dot" />
              <span>Live Contract Assurance</span>
            </div>

            <div className="ai-monitored-badge">
              <Sparkles size={11} />
              <span>AI Monitored</span>
            </div>
          </div>

          <div className="compliance-value-row">
            <strong>XX%</strong>

            <span className="compliance-trend">
              <TrendingUp size={15} />
              Live insights
            </span>
          </div>

          <div className="compliance-progress">
            <div className="compliance-progress-value" />
          </div>

          <div className="compliance-details">
            <span>Contract assurance overview</span>
            <span>Updated recently</span>
          </div>
        </section>
      </div>

      <footer className="premium-left-footer">
        <blockquote>
          “Strong compliance builds stronger organizations.”
        </blockquote>

        <p>
          Manage contracts securely, automate approvals, monitor
          compliance, and reduce organizational risks using AI-powered
          workflows.
        </p>
      </footer>
    </section>
  );
}

export default AuthLeftPanel;