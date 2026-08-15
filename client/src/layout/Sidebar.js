import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bot } from "lucide-react";
import ChatbotPanel from "../components/Chatbot/ChatbotPanel";
import { useUI } from "../context/UIContext";
import { useHealthCheck } from "../hooks/useHealthCheck";
import {
  canAccessSidebarItem,
  getCurrentUserRole,
} from "../utils/sidebarPermissions";
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
  PlusIcon,
  BuildingIcon,
} from "../components/Icons";

const MENU = [
  { to: "/dashboard",          label: "Dashboard",           Icon: GridIcon,      implemented: true },
  { to: "/repository",         label: "Contract Repository", Icon: FileIcon,      implemented: true },
  { to: "/obligations",        label: "Obligation Tracker",  Icon: ClipboardIcon, implemented: true },
  { to: "/renewal-dashboard",  label: "Renewal Dashboard",   Icon: RepeatIcon,    implemented: true },
  { to: "/compliance",         label: "Compliance",          Icon: ShieldIcon,    implemented: true },
  { to: "/reports",            label: "Reports & Analytics", Icon: BarIcon,       implemented: true },
  { to: "/notifications",      label: "Notifications",       Icon: BellIcon,      badgeKey: "notifications", implemented: true },
  { to: "/quick-actions",      label: "Quick Actions",       Icon: PlusIcon,      implemented: true },
  { to: "/calendar",           label: "Calendar",            Icon: CalendarIcon,  implemented: true },
  { to: "/audit",              label: "Audit Logs",          Icon: BookIcon,      implemented: true },
  { to: "/user-management",    label: "User Management",     Icon: UsersIcon,     implemented: true },
  { to: "/organizations",      label: "Organization Management", Icon: BuildingIcon, implemented: true },
  { to: "/settings",           label: "Settings",            Icon: GearIcon,      implemented: true },
];

export default function Sidebar({ collapsed = false, mobileOpen = false }) {
  const { notificationCount, showToast, user } = useUI();
  const [statusCollapsed, setStatusCollapsed] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const health = useHealthCheck(15000);
  const currentRole = getCurrentUserRole(user?.role);
  const visibleMenuItems = MENU.filter((item) =>
    canAccessSidebarItem(currentRole, item.label)
  );

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
    <aside className={`sidebar${mobileOpen ? " mobile-open" : ""}`} aria-label="Main navigation">
      <div className="sb-brand">
        <div className="mark">
          <ShieldIcon size={14} color="#fff" />
        </div>
        <h1>ContractIQ</h1>
      </div>

      <div className="sb-divider" />
      <div className="sb-menu-label">MAIN MENU</div>

      <div className="sb-nav">
        {visibleMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={(e) => handleItemClick(e, item)}
            className={({ isActive }) =>
              `sb-item${isActive && item.implemented ? " active" : ""}`
            }
          >
            <item.Icon size={14} />
            <span>{item.label}</span>
            {item.badgeKey === "notifications" && notificationCount > 0 ? (
              <span className="sb-badge">{notificationCount}</span>
            ) : null}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '0 1rem', marginTop: 'auto', marginBottom: '1rem' }}>
          <div 
              onClick={() => setIsChatbotOpen(true)}
              style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  borderRadius: '1rem', 
                  border: '1px solid #5b21b6', 
                  backgroundColor: 'rgba(46, 16, 101, 0.5)', 
                  padding: '1.25rem', 
                  color: '#ddd6fe', 
                  boxShadow: 'inset 0 2px 4px 0 rgba(46, 16, 101, 0.2)',
                  cursor: 'pointer'
              }}
          >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 'bold' }}>
                  <Bot size={20} />
                  <span>AI Assistant</span>
              </div>
              <span style={{ height: '0.75rem', width: '0.75rem', borderRadius: '9999px', backgroundColor: '#a78bfa', boxShadow: '0 1px 2px 0 rgba(167, 139, 250, 0.4)' }} />
          </div>
      </div>

      {/* Live System Operational Widget */}
      <div className="sb-status">
        <button
          type="button"
          className="sb-status-head"
          onClick={() => setStatusCollapsed((c) => !c)}
        >
          <span className={`dot ${getOverallDotClass(health.status)}`} />
          <span className="status-text">System {getOverallStatusText(health.status)}</span>
          <span className={`chev${statusCollapsed ? " collapsed" : ""}`}>
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

      <ChatbotPanel 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </aside>
  );
}
