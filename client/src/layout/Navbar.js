import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { API_BASE } from "../config/api";
import {
  canAccessRoute,
  getCurrentUserRole,
  hasQuickActions,
} from "../utils/sidebarPermissions";
import {
  getAuthHeaders,
} from "../utils/auth";
import {
  ChevRightSmIcon, SearchIcon, MoonIcon, SunIcon, HelpIcon, BellIcon, PlusIcon,
  FileIcon, BarIcon, ChevDownIcon, UserIcon, CalendarIcon,
  GearIcon, BellSmIcon, LogoutIcon, MenuIcon,
} from "../components/Icons";

const ROUTE_TITLES = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/renewal-dashboard": "Renewal Dashboard",
  "/repository": "Contract Repository",
  "/contract-repository": "Contract Repository",
  "/obligations": "Obligation Tracker",
  "/compliance": "Compliance",
  "/reports": "Reports & Analytics",
  "/settings": "Settings",
  "/notifications": "Notifications",
  "/calendar": "Calendar",
  "/profile": "My Profile",
  "/quick-actions": "Quick Actions",
  "/help": "Help & Support",
  "/audit": "Audit Logs",
  "/user-management": "User Management",
};

const NOTIF_COLORS = {
  Contracts: "#3B82F6",
  Compliance: "#10B981",
  Renewals: "#14B8A6",
  Workflow: "#F59E0B",
  "Risk Alerts": "#8B5CF6",
  Approvals: "#6366F1",
  System: "#64748B",
};

const SEARCH_INDEX = [
  { group: "Pages", label: "Dashboard", sub: "Overview, KPIs & charts", to: "/dashboard" },
  { group: "Pages", label: "Contract Repository", sub: "Manage and search contracts", to: "/repository" },
  { group: "Pages", label: "Obligation Tracker", sub: "Track deliverables & deadlines", to: "/obligations" },
  { group: "Pages", label: "Renewal Dashboard", sub: "Contract renewals tracking", to: "/renewal-dashboard" },
  { group: "Pages", label: "Compliance", sub: "Compliance controls & risk", to: "/compliance" },
  { group: "Pages", label: "Reports & Analytics", sub: "Data visualization & KPIs", to: "/reports" },
  { group: "Pages", label: "Notifications", sub: "Alert feed & history", to: "/notifications" },
  { group: "Pages", label: "Quick Actions", sub: "Instant operations grid", to: "/quick-actions" },
  { group: "Pages", label: "My Profile", sub: "Personal settings & authority", to: "/profile" },
  { group: "Pages", label: "Settings", sub: "App configuration & billing", to: "/settings" },
  { group: "Pages", label: "Help & Support", sub: "FAQs & ticket submission", to: "/help" },
  { group: "Pages", label: "Calendar", sub: "Compliance milestones & renewals calendar", to: "/calendar" },
  { group: "Pages", label: "Audit Logs", sub: "System audit trail", to: "/audit" },
  { group: "Pages", label: "User Management", sub: "Manage users & roles", to: "/user-management" },
];

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, handler]);
}

export default function Navbar({ onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifPreview, setNotifPreview] = useState([]);
  const ref = useRef();
  const bellRef = useRef();
  const qaRef = useRef();

  useOutsideClick(ref, () => setOpen(false));
  useOutsideClick(bellRef, () => setBellOpen(false));
  useOutsideClick(qaRef, () => setQaOpen(false));

  const { notificationCount, user, logout, toggleTheme, theme } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const currentRole = getCurrentUserRole(user?.role);
  const showQuickActions = hasQuickActions(currentRole);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const response = await fetch(`${API_BASE}/notifications`, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setNotifPreview(data.slice(0, 3));
        }
      } catch (err) {
        console.warn("Failed to load notifications for topbar preview", err);
      }
    }
    loadNotifs();
  }, [notificationCount]);

  const userName = user?.name || localStorage.getItem("name") || sessionStorage.getItem("name") || "User";
  const userRole = user?.role || "User";
  const userEmail = user?.email || localStorage.getItem("email") || sessionStorage.getItem("email") || "";

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pageTitle = ROUTE_TITLES[location.pathname] || "ContractIQ";

  const q = query.trim().toLowerCase();
  const matches = q
    ? SEARCH_INDEX.filter(
        (it) =>
          canAccessRoute(currentRole, it.to) &&
          (it.label + " " + it.sub + " " + it.group)
            .toLowerCase()
            .includes(q)
      ).slice(0, 8)
    : [];

  let lastGroup = "";

  function goTo(path) {
    navigate(path);
    setOpen(false);
    setBellOpen(false);
    setQaOpen(false);
  }

  function handleLogout() {
    logout();
    setOpen(false);
    setBellOpen(false);
    setQaOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>

      <div className="breadcrumb">
        <span>ContractIQ</span> <ChevRightSmIcon /> <span className="active">{pageTitle}</span>
      </div>

      <div className="search-wrap">
        <span className="search-ico"><SearchIcon /></span>
        <input
          type="text"
          autoComplete="off"
          placeholder="Search contracts, obligations, users, pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {q && (
          <div className="search-results">
            {matches.length === 0 && <div className="sr-empty">No results for "{query}"</div>}
            {matches.map((m, i) => {
              const showLabel = m.group !== lastGroup;
              lastGroup = m.group;
              return (
                <React.Fragment key={i}>
                  {showLabel && <div className="sr-group-label">{m.group}</div>}
                  <div className="sr-item" onClick={() => { goTo(m.to); setQuery(""); }}>
                    <div className="ico"><FileIcon size={15} /></div>
                    <div><strong>{m.label}</strong><span>{m.sub}</span></div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      <div className="top-actions">
        <Link to="/calendar" className="icon-btn" aria-label="Calendar">
          <CalendarIcon size={16} />
        </Link>

        <button type="button" className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        <Link to="/help" className="icon-btn" aria-label="Help & Support">
          <HelpIcon />
        </Link>

        <div className="dropdown-wrap" ref={bellRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => setBellOpen((o) => !o)}
          >
            <BellIcon />
            {notificationCount > 0 && <span className="bell-badge">{notificationCount}</span>}
          </button>
          {bellOpen && (
            <div className="dropdown" style={{ width: 320 }}>
              <div className="dd-header" style={{ justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13.5 }}>Notifications</strong>
                <span className="badge danger">{notificationCount} unread</span>
              </div>
              {notifPreview.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="bell-preview-item"
                  onClick={() => goTo("/notifications")}
                >
                  <span
                    className="dot"
                    style={{ background: NOTIF_COLORS[n.cat] || "#64748B", marginTop: 5 }}
                  />
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.desc}</p>
                    <div className="time">{n.time}</div>
                  </div>
                </button>
              ))}
              <button type="button" className="dd-viewall" onClick={() => goTo("/notifications")}>
                View all notifications
              </button>
            </div>
          )}
        </div>

        {showQuickActions && (
        <div className="dropdown-wrap" ref={qaRef}>
          <button
            className="quick-action"
            type="button"
            onClick={() => setQaOpen((o) => !o)}
          >
            <PlusIcon /> Quick Action
          </button>
          {qaOpen && (
            <div className="dropdown" style={{ width: 236 }}>
              <button type="button" className="dd-item" onClick={() => goTo("/quick-actions")}>
                <PlusIcon size={17} color="#3B82F6" /> Open Quick Actions
              </button>
              {canAccessRoute(currentRole, "/reports") && (
                <button type="button" className="dd-item" onClick={() => goTo("/reports")}>
                  <BarIcon size={17} color="#F59E0B" /> View Analytics
                </button>
              )}
              <button type="button" className="dd-item" onClick={() => goTo("/help")}>
                <HelpIcon size={17} color="#10B981" /> File Support Ticket
              </button>
              <button type="button" className="dd-item" onClick={() => goTo("/profile")}>
                <UserIcon size={17} color="#8B5CF6" /> Manage Profile
              </button>
            </div>
          )}
        </div>
        )}

        <div className="dropdown-wrap" ref={ref}>
          <button
            type="button"
            className="user-block"
            onClick={() => setOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <div className="avatar-purple">{initials}</div>
            <div className="user-meta">
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
            <span
              className="chev"
              style={{
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform .18s ease",
              }}
            >
              <ChevDownIcon />
            </span>
          </button>
          {open && (
            <div className="dropdown" role="menu">
              <div className="dd-header">
                <div className="avatar-purple">{initials}</div>
                <div>
                  <strong>{userName}</strong>
                  <span>{userEmail}</span>
                </div>
              </div>

              <button type="button" className="dd-item" onClick={() => goTo("/profile")}>
                <UserIcon /> My Profile
              </button>
              <button type="button" className="dd-item" onClick={() => goTo("/settings")}>
                <GearIcon /> Settings
              </button>
              <button type="button" className="dd-item" onClick={() => goTo("/notifications")}>
                <BellSmIcon /> Notifications
              </button>
              <button type="button" className="dd-item" onClick={() => goTo("/help")}>
                <HelpIcon /> Help & Support
              </button>
              <div className="dd-sep" />
              <button type="button" className="dd-item red" onClick={handleLogout}>
                <LogoutIcon /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
