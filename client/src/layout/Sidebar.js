import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useHealthCheck } from "../hooks/useHealthCheck";
import {
  GridIcon,
  FileIcon,
  ClipboardIcon,
  RepeatIcon,
  ShieldIcon,
  BarIcon,
  BellIcon,
  BookIcon,
  UsersIcon,
  GearIcon,
  ChevDownIcon,
  CalendarIcon,
  ChevLeftIcon
} from "../components/Icons";

const MENU = [
  { to: "/dashboard", label: "Dashboard", Icon: GridIcon, implemented: true },
  { to: "/repository", label: "Contract Repository", Icon: FileIcon, implemented: false },
  { to: "/obligations", label: "Obligation Tracker", Icon: ClipboardIcon, implemented: false },
  { to: "/renewal-dashboard", label: "Renewal Dashboard", Icon: RepeatIcon, implemented: true },
  { to: "/compliance", label: "Compliance", Icon: ShieldIcon, implemented: false },
  { to: "/reports", label: "Reports & Analytics", Icon: BarIcon, implemented: true },
  { to: "/notifications", label: "Notifications", Icon: BellIcon, badgeKey: "notifications", implemented: true },
  { to: "/calendar", label: "Calendar", Icon: CalendarIcon, implemented: true },
  { to: "/audit", label: "Audit Logs", Icon: BookIcon, implemented: true },
  { to: "/users", label: "User Management", Icon: UsersIcon, implemented: false },
  { to: "/settings", label: "Settings", Icon: GearIcon, implemented: true },
];

export default function Sidebar({ collapsed = false, mobileOpen = false }) {
  const { notificationCount, showToast } = useUI();
  const [statusCollapsed, setStatusCollapsed] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const health = useHealthCheck(15000);

  if (collapsed && !mobileOpen) return null;

  const handleItemClick = (e, item) => {
    if (!item.implemented) {
      e.preventDefault();
      showToast(`${item.label} is coming soon!`);
    }
  };

  const getOverallDotClass = (status) => {
    if (status === "OK") return "success";
    if (status === "DEGRADED") return "warning";
    if (status === "OFFLINE") return "danger";
    return "checking";
  };

  const getOverallStatusText = (status) => {
    if (status === "OK") return "Operational";
    if (status === "DEGRADED") return "Degraded";
    if (status === "OFFLINE") return "Offline";
    return "Connecting...";
  };

  return (
    <aside className={"sidebar" + (mobileOpen ? " mobile-open" : "")} aria-label="Main navigation">
      {/* Brand Header */}
      <div className="sb-brand">
        <div className="mark">
          <ShieldIcon size={18} color="#fff" />
        </div>
        <div className="sb-brand-text">
          <h1>ContractIQ</h1>
          <span>AI-Powered Platform</span>
        </div>
        <button type="button" className="sb-collapse-btn" title="Collapse Sidebar">
          <ChevLeftIcon size={16} color="#64748B" />
        </button>
      </div>

      {/* Org Selector Box */}
      <div className="sb-org" onClick={() => setOrgOpen(!orgOpen)}>
        <div className="sb-org-left">
          <div className="sb-org-avatar">A</div>
          <div className="sb-org-meta">
            <strong>Acme Corp</strong>
            <span>Enterprise Plan</span>
          </div>
        </div>
        <ChevDownIcon size={14} color="#64748B" />
      </div>

      <div className="sb-divider" />

      {/* Main Menu Label */}
      <div className="sb-menu-label">MAIN MENU</div>

      {/* Navigation Links */}
      <div className="sb-nav">
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={(e) => handleItemClick(e, item)}
            className={({ isActive }) =>
              "sb-item" + (isActive && item.implemented ? " active" : "")
            }
          >
            <item.Icon size={16} />
            <span>{item.label}</span>
            {item.badgeKey === "notifications" ? (
              <span className="sb-badge-red">2</span>
            ) : null}
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer Widgets */}
      <div className="sb-footer">
        {/* System Operational widget */}
        <div className="sb-status">
          <button
            type="button"
            className="sb-status-head"
            onClick={() => setStatusCollapsed((c) => !c)}
          >
            <span className={`dot ${getOverallDotClass(health.status)}`} />
            <span className="status-text">System {getOverallStatusText(health.status)}</span>
            <span className={"chev" + (statusCollapsed ? " collapsed" : "")}>
              <ChevDownIcon size={12} />
            </span>
          </button>
          {!statusCollapsed && (
            <div className="sb-status-body">
              <div className="sb-status-row">
                <span>API Server</span>
                <span className={`status-val ${health.details.api.status.toLowerCase()}`}>
                  {health.details.api.status}
                </span>
              </div>
              <div className="sb-status-row">
                <span>Database</span>
                <span className={`status-val ${health.details.database.status.toLowerCase()}`}>
                  {health.details.database.status}
                </span>
              </div>
              <div className="sb-status-row">
                <span>Queue</span>
                <span className={`status-val ${health.details.queue.status.toLowerCase()}`}>
                  {health.details.queue.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Widget */}
        <div className="sb-ai-widget">
          <div className="sb-ai-left">
            <span className="sb-ai-dot-ping" />
            <span className="sb-ai-title">AI Assistant</span>
          </div>
          <span className="sb-ai-dot-solid" />
        </div>
      </div>
    </aside>
  );
}
