import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, FolderOpen, RefreshCw, Shield,
  Users, Settings, ChevronDown, Sparkles, ChevronUp, LogOut
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Contract Repository", icon: FolderOpen, path: "/dashboard" },
  { name: "Renewal Dashboard", icon: RefreshCw, path: "/renewals" },
  { name: "Compliance", icon: Shield, path: "/dashboard" },
  { name: "User Management", icon: Users, path: "/users" },
  { name: "Settings", icon: Settings, path: "/dashboard" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [orgDropdown, setOrgDropdown] = useState(false);

  const handleNav = (path) => navigate(path);
  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (item) => {
    if (item.path === "/renewals") return location.pathname === "/renewals";
    if (item.path === "/users") return location.pathname === "/users";
    if (item.path === "/dashboard") return location.pathname === "/dashboard";
    return false;
  };

  const roleLabel = (role) => {
    if (!role) return "User";
    return role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper"><Shield className="brand-icon" /></div>
        <div className="brand-text">
          <span className="brand-name">ContractIQ</span>
          <span className="brand-subtitle">AI-Powered Platform</span>
        </div>
      </div>

      {/* Org selector showing logged-in user */}
      <div className="org-selector-container">
        <div className="org-selector" onClick={() => setOrgDropdown(!orgDropdown)}>
          <div className="org-avatar">{user?.initials?.[0] || "U"}</div>
          <div className="org-details">
            <span className="org-name">{user?.name || "User"}</span>
            <span className="org-plan">{roleLabel(user?.role)}</span>
          </div>
          <ChevronDown className="org-chevron" />
        </div>
        {orgDropdown && (
          <div className="org-dropdown-list">
            <div className="org-dropdown-item" style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
              {user?.email}
            </div>
            <div className="org-dropdown-item" style={{ color: "#ef4444", cursor: "pointer" }} onClick={handleLogout}>
              Sign Out
            </div>
          </div>
        )}
      </div>

      <div className="menu-section-label">MAIN MENU</div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <li key={item.name}>
                <button
                  className={`nav-item-btn ${active ? "active" : ""}`}
                  onClick={() => handleNav(item.path)}
                >
                  <div className="nav-item-left">
                    <Icon className="nav-icon" />
                    <span>{item.name}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-widget">
          <div className="system-status-header">
            <div className="status-indicator-dot"></div>
            <span className="status-text">System Operational</span>
          </div>
        </div>

        <div className="ai-assistant-widget">
          <div className="ai-assistant-header">
            <div className="ai-icon-wrapper"><Sparkles className="ai-icon" /></div>
            <div className="ai-info">
              <span className="ai-title">ContractIQ AI</span>
              <span className="ai-subtitle">Renewal insights active</span>
            </div>
            <div className="ai-ping-dot"></div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 0.65rem", background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px",
            color: "#ef4444", cursor: "pointer", fontSize: "0.78rem", fontWeight: "600",
          }}
        >
          <LogOut style={{ width: "14px", height: "14px" }} />
          Sign Out
        </button>
      </div>

      <style>{`
        .sidebar{width:260px;background-color:var(--bg-sidebar);border-right:1px solid var(--border-sidebar);display:flex;flex-direction:column;height:100vh;flex-shrink:0;color:#94A3B8;font-size:.875rem;user-select:none;}
        .sidebar-brand{display:flex;align-items:center;padding:1.5rem 1.25rem 1.25rem;gap:.75rem;}
        .brand-icon-wrapper{background:rgba(16,185,129,.15);border-radius:8px;padding:.35rem;display:flex;align-items:center;justify-content:center;border:1px solid rgba(16,185,129,.25);}
        .brand-icon{color:#00E5A3;width:22px;height:22px;}
        .brand-text{display:flex;flex-direction:column;}
        .brand-name{color:#FFFFFF;font-weight:700;font-size:1.05rem;letter-spacing:-.025em;}
        .brand-subtitle{font-size:.7rem;color:#475569;font-weight:500;}
        .org-selector-container{padding:0 1.25rem;margin-bottom:1.25rem;position:relative;}
        .org-selector{background:#111A2E;border:1px solid #1E293B;border-radius:10px;padding:.5rem .75rem;display:flex;align-items:center;gap:.65rem;cursor:pointer;}
        .org-selector:hover{background:#1A2438;border-color:#2D3748;}
        .org-avatar{width:28px;height:28px;background:linear-gradient(135deg,#8B5CF6,#6D28D9);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem;}
        .org-details{display:flex;flex-direction:column;flex-grow:1;text-align:left;}
        .org-name{color:#FFFFFF;font-weight:600;font-size:.8rem;line-height:1.2;}
        .org-plan{font-size:.65rem;color:#475569;font-weight:500;}
        .org-chevron{width:14px;height:14px;color:#64748B;}
        .org-dropdown-list{position:absolute;top:calc(100% + 4px);left:1.25rem;right:1.25rem;background:#111A2E;border:1px solid #1E293B;border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,.5);z-index:100;}
        .org-dropdown-item{padding:.5rem .75rem;font-size:.75rem;color:#94A3B8;cursor:pointer;}
        .org-dropdown-item:hover{background:#1A2438;color:#fff;}
        .menu-section-label{padding:0 1.5rem;font-size:.65rem;font-weight:700;color:#475569;letter-spacing:.05em;margin-bottom:.5rem;}
        .sidebar-nav{flex-grow:1;overflow-y:auto;padding:0 .75rem;}
        .sidebar-nav ul{list-style:none;display:flex;flex-direction:column;gap:.15rem;}
        .nav-item-btn{width:100%;background:transparent;border:none;padding:.55rem .75rem;color:#94A3B8;border-radius:8px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-size:.8rem;font-weight:500;text-align:left;}
        .nav-item-btn:hover{background:rgba(255,255,255,.03);color:#FFFFFF;}
        .nav-item-btn.active{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);color:#3B82F6;font-weight:600;}
        .nav-item-btn.active .nav-icon{color:#3B82F6;}
        .nav-item-left{display:flex;align-items:center;gap:.75rem;}
        .nav-icon{width:17px;height:17px;color:#475569;}
        .nav-item-btn:hover .nav-icon{color:#FFFFFF;}
        .sidebar-footer{padding:1rem .75rem;border-top:1px solid var(--border-sidebar);display:flex;flex-direction:column;gap:.75rem;}
        .system-status-widget{background:rgba(0,0,0,.15);border-radius:8px;padding:.45rem .65rem;}
        .system-status-header{display:flex;align-items:center;gap:.5rem;}
        .status-indicator-dot{width:6px;height:6px;background:#10B981;border-radius:50%;box-shadow:0 0 8px #10B981;}
        .status-text{font-size:.72rem;color:#475569;font-weight:600;flex-grow:1;}
        .ai-assistant-widget{background:linear-gradient(135deg,rgba(88,80,236,.1),rgba(139,92,246,.15));border:1px solid rgba(139,92,246,.2);border-radius:10px;padding:.5rem .65rem;}
        .ai-assistant-header{display:flex;align-items:center;gap:.5rem;}
        .ai-icon-wrapper{background:rgba(139,92,246,.2);padding:.3rem;border-radius:6px;display:flex;}
        .ai-icon{width:14px;height:14px;color:#8B5CF6;}
        .ai-info{display:flex;flex-direction:column;flex-grow:1;}
        .ai-title{font-weight:600;font-size:.72rem;color:#C084FC;}
        .ai-subtitle{font-size:.62rem;color:#475569;}
        .ai-ping-dot{width:5px;height:5px;background:#8B5CF6;border-radius:50%;box-shadow:0 0 6px #C084FC;}
      `}</style>
    </aside>
  );
}
