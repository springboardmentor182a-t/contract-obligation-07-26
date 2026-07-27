import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Activity,
  RefreshCw,
  Shield,
  BarChart2,
  Bell,
  BookOpen,
  Users,
  Settings,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ChevronUp,
  Cpu
} from "lucide-react";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [orgDropdown, setOrgDropdown] = useState(false);
  const [systemDropdown, setSystemDropdown] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Contract Repository", icon: FolderOpen },
    { name: "Obligation Tracker", icon: Activity },
    { name: "Renewal Dashboard", icon: RefreshCw },
    { name: "Compliance", icon: Shield },
    { name: "Reports & Analytics", icon: BarChart2 },
    { name: "Notifications", icon: Bell, badge: 2 },
    { name: "Audit Logs", icon: BookOpen },
    { name: "User Management", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Shield className="brand-icon" />
        </div>
        <div className="brand-text">
          <span className="brand-name">ContractIQ</span>
          <span className="brand-subtitle">AI-Powered Platform</span>
        </div>
        <button className="sidebar-collapse-btn">
          <ChevronUp style={{ transform: "rotate(-90deg)", width: "16px", height: "16px" }} />
        </button>
      </div>

      {/* Org Selector */}
      <div className="org-selector-container">
        <div className="org-selector" onClick={() => setOrgDropdown(!orgDropdown)}>
          <div className="org-avatar">A</div>
          <div className="org-details">
            <span className="org-name">Acme Corp</span>
            <span className="org-plan">Enterprise Plan</span>
          </div>
          <ChevronDown className="org-chevron" />
        </div>
        {orgDropdown && (
          <div className="org-dropdown-list">
            <div className="org-dropdown-item active">Acme Corp (Enterprise)</div>
            <div className="org-dropdown-item">Stark Industries (Pro)</div>
            <div className="org-dropdown-item">Wayne Enterprises (Free)</div>
          </div>
        )}
      </div>

      {/* Main Menu Label */}
      <div className="menu-section-label">MAIN MENU</div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <li key={item.name}>
                <button
                  className={`nav-item-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveMenu(item.name)}
                >
                  <div className="nav-item-left">
                    <Icon className="nav-icon" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer Widgets */}
      <div className="sidebar-footer">
        {/* System Operational widget */}
        <div className="system-status-widget">
          <div 
            className="system-status-header" 
            onClick={() => setSystemDropdown(!systemDropdown)}
          >
            <div className="status-indicator-dot"></div>
            <span className="status-text">System Operational</span>
            <ChevronDown className={`status-chevron ${systemDropdown ? "open" : ""}`} />
          </div>
          {systemDropdown && (
            <div className="status-details">
              <div className="status-detail-item">
                <span>API Gateway</span>
                <span className="status-value green">12ms</span>
              </div>
              <div className="status-detail-item">
                <span>AI Compute</span>
                <span className="status-value green">Idle</span>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant widget */}
        <div className="ai-assistant-widget">
          <div className="ai-assistant-header">
            <div className="ai-icon-wrapper">
              <Sparkles className="ai-icon" />
            </div>
            <div className="ai-info">
              <span className="ai-title">AI Assistant</span>
              <span className="ai-subtitle">Ask anything...</span>
            </div>
            <div className="ai-ping-dot"></div>
          </div>
        </div>
      </div>

      {/* Sidebar styling embedded inside Sidebar.js to avoid cluttering global.css unnecessarily */}
      <style>{`
        .sidebar {
          width: 260px;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-sidebar);
          display: flex;
          flex-direction: column;
          height: 100vh;
          flex-shrink: 0;
          color: #94A3B8;
          font-size: 0.875rem;
          user-select: none;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          padding: 1.5rem 1.25rem 1.25rem 1.25rem;
          gap: 0.75rem;
          position: relative;
        }

        .brand-icon-wrapper {
          background-color: rgba(16, 185, 129, 0.15);
          border-radius: 8px;
          padding: 0.35rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .brand-icon {
          color: #00E5A3;
          width: 22px;
          height: 22px;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          color: #FFFFFF;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: -0.025em;
        }

        .brand-subtitle {
          font-size: 0.7rem;
          color: #475569;
          font-weight: 500;
          margin-top: -1px;
        }

        .sidebar-collapse-btn {
          background: transparent;
          border: none;
          color: #475569;
          position: absolute;
          right: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
        }
        .sidebar-collapse-btn:hover {
          color: #94A3B8;
          background: rgba(255, 255, 255, 0.05);
        }

        /* Org Selector */
        .org-selector-container {
          padding: 0 1.25rem;
          margin-bottom: 1.25rem;
          position: relative;
        }

        .org-selector {
          background-color: #111A2E;
          border: 1px solid #1E293B;
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }
        .org-selector:hover {
          background-color: #1A2438;
          border-color: #2D3748;
        }

        .org-avatar {
          width: 26px;
          height: 26px;
          background-color: #3B82F6;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .org-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          text-align: left;
        }

        .org-name {
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.8rem;
          line-height: 1.2;
        }

        .org-plan {
          font-size: 0.65rem;
          color: #475569;
          font-weight: 500;
        }

        .org-chevron {
          width: 14px;
          height: 14px;
          color: #64748B;
        }

        .org-dropdown-list {
          position: absolute;
          top: calc(100% + 4px);
          left: 1.25rem;
          right: 1.25rem;
          background: #111A2E;
          border: 1px solid #1E293B;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          z-index: 100;
          overflow: hidden;
        }

        .org-dropdown-item {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: #94A3B8;
          cursor: pointer;
        }
        .org-dropdown-item:hover {
          background-color: #1A2438;
          color: #FFFFFF;
        }
        .org-dropdown-item.active {
          color: #3B82F6;
          font-weight: 600;
          background-color: #1E293B;
        }

        .menu-section-label {
          padding: 0 1.5rem;
          font-size: 0.65rem;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        /* Sidebar Nav */
        .sidebar-nav {
          flex-grow: 1;
          overflow-y: auto;
          padding: 0 0.75rem;
        }

        .sidebar-nav ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .nav-item-btn {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.55rem 0.75rem;
          color: #94A3B8;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background-color var(--transition-fast), color var(--transition-fast);
          font-size: 0.8rem;
          font-weight: 500;
          text-align: left;
        }

        .nav-item-btn:hover {
          background-color: rgba(255, 255, 255, 0.03);
          color: #FFFFFF;
        }

        .nav-item-btn.active {
          background-color: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          font-weight: 600;
        }
        .nav-item-btn.active .nav-icon {
          color: #3B82F6;
        }

        .nav-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-icon {
          width: 17px;
          height: 17px;
          color: #475569;
          transition: color var(--transition-fast);
        }
        .nav-item-btn:hover .nav-icon {
          color: #FFFFFF;
        }

        .nav-badge {
          background-color: #EF4444;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.05rem 0.35rem;
          border-radius: 10px;
          line-height: 1.3;
        }

        /* Sidebar Footer Widgets */
        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--border-sidebar);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .system-status-widget {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          padding: 0.45rem 0.65rem;
          cursor: pointer;
        }

        .system-status-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-indicator-dot {
          width: 6px;
          height: 6px;
          background-color: #10B981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10B981;
        }

        .status-text {
          font-size: 0.72rem;
          color: #475569;
          font-weight: 600;
          flex-grow: 1;
          text-align: left;
        }

        .status-chevron {
          width: 12px;
          height: 12px;
          color: #475569;
          transition: transform var(--transition-fast);
        }
        .status-chevron.open {
          transform: rotate(180deg);
        }

        .status-details {
          margin-top: 0.35rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.05);
          padding-top: 0.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .status-detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #475569;
        }
        .status-value.green {
          color: #10B981;
          font-weight: 600;
        }

        /* AI Assistant widget */
        .ai-assistant-widget {
          background: linear-gradient(135deg, rgba(88, 80, 236, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 10px;
          padding: 0.5rem 0.65rem;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        .ai-assistant-widget:hover {
          background: linear-gradient(135deg, rgba(88, 80, 236, 0.15) 0%, rgba(139, 92, 246, 0.25) 100%);
        }

        .ai-assistant-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-icon-wrapper {
          background-color: rgba(139, 92, 246, 0.2);
          padding: 0.3rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-icon {
          width: 14px;
          height: 14px;
          color: #8B5CF6;
        }

        .ai-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          text-align: left;
        }

        .ai-title {
          font-weight: 600;
          font-size: 0.72rem;
          color: #C084FC;
        }

        .ai-subtitle {
          font-size: 0.62rem;
          color: #475569;
        }

        .ai-ping-dot {
          width: 5px;
          height: 5px;
          background-color: #8B5CF6;
          border-radius: 50%;
          box-shadow: 0 0 6px #C084FC;
        }
      `}</style>
    </aside>
  );
}
