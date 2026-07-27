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
      <div className="sb-brand" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem 1.25rem 0.75rem 1.25rem" }}>
        <div className="mark" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldIcon size={18} color="#fff" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#FFFFFF", lineHeight: 1.2 }}>ContractIQ</h1>
          <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: "500" }}>AI-Powered Platform</span>
        </div>
      </div>

      {/* Org Selector Box */}
      <div style={{ margin: "0.85rem 1rem", padding: "0.65rem 0.85rem", backgroundColor: "#111B2A", border: "1px solid #1E293B", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOrgOpen(!orgOpen)}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#2563EB", color: "#FFFFFF", fontWeight: "700", fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#FFFFFF", lineHeight: 1.2 }}>Acme Corp</span>
            <span style={{ fontSize: "0.68rem", color: "#64748B" }}>Enterprise Plan</span>
          </div>
        </div>
        <ChevDownIcon size={14} color="#64748B" />
      </div>

      <div className="sb-divider" style={{ margin: "0.5rem 1rem", height: "1px", backgroundColor: "#1E293B" }} />

      {/* Main Menu Label */}
      <div className="sb-menu-label" style={{ padding: "0.5rem 1.25rem 0.25rem 1.25rem", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.1em", color: "#475569" }}>MAIN MENU</div>

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
            <item.Icon size={15} />
            <span>{item.label}</span>
            {item.badgeKey === "notifications" ? (
              <span className="sb-badge" style={{ backgroundColor: "#EF4444", color: "#FFFFFF", fontSize: "0.68rem", fontWeight: "700", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>2</span>
            ) : null}
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer Widgets */}
      <div style={{ marginTop: "auto", padding: "1rem" }}>
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
        <div style={{ marginTop: "0.65rem", padding: "0.6rem 0.85rem", backgroundColor: "#111B2A", border: "1px solid #1E293B", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#8B5CF6", boxShadow: "0 0 6px #8B5CF6" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "#C084FC" }}>AI Assistant</span>
          </div>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#8B5CF6" }} />
        </div>
      </div>
    </aside>
  );
}
