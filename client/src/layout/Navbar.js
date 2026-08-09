<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { API_BASE } from "../config/api";
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
=======
import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Moon,
  Sun,
  HelpCircle,
  Bell,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Sliders
} from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [quickActionDropdown, setQuickActionDropdown] = useState(false);

  // Initialize theme from system or body classes
  useEffect(() => {
    const isDark = document.body.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="navbar">
      {/* Breadcrumb Left */}
      <div className="breadcrumb-area">
        <span className="breadcrumb-parent">ContractIQ</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Dashboard</span>
      </div>

      {/* Search Center-Left */}
      <div className="search-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search contracts, obligations, users..."
        />
      </div>

      {/* Right Navigation Controls */}
      <div className="nav-controls">
        {/* Calendar button */}
        <button className="icon-control-btn" title="Calendar">
          <Calendar className="control-icon" />
        </button>

        {/* Theme Toggle */}
        <button className="icon-control-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {isDarkMode ? (
            <Sun className="control-icon text-yellow" />
          ) : (
            <Moon className="control-icon" />
          )}
        </button>

        {/* Help Center */}
        <button className="icon-control-btn" title="Help Center">
          <HelpCircle className="control-icon" />
        </button>

        {/* System Alerts */}
        <button className="icon-control-btn alert-badge-wrapper" title="Notifications">
          <Bell className="control-icon" />
          <span className="notification-badge-dot">2</span>
        </button>

        {/* Quick Action Button */}
        <div className="quick-action-container">
          <button 
            className="quick-action-btn"
            onClick={() => setQuickActionDropdown(!quickActionDropdown)}
          >
            <Plus className="quick-action-icon" />
            <span>Quick Action</span>
          </button>
          {quickActionDropdown && (
            <div className="dropdown-menu quick-action-menu">
              <div className="dropdown-item">New Contract</div>
              <div className="dropdown-item">Add User</div>
              <div className="dropdown-item">Upload PDF</div>
              <div className="dropdown-item">Create Obligation</div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="profile-container">
          <div className="profile-trigger" onClick={() => setProfileDropdown(!profileDropdown)}>
            <div className="profile-avatar">AM</div>
            <div className="profile-info">
              <span className="profile-name">Arjun Mehta</span>
              <span className="profile-role">Administrator</span>
            </div>
            <ChevronDown className="profile-chevron" />
          </div>
          {profileDropdown && (
            <div className="dropdown-menu profile-menu">
              <div className="dropdown-item">
                <User className="dropdown-item-icon" />
                <span>My Profile</span>
              </div>
              <div className="dropdown-item">
                <Sliders className="dropdown-item-icon" />
                <span>Account Settings</span>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item text-danger">
                <LogOut className="dropdown-item-icon" />
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          height: 70px;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          flex-shrink: 0;
          z-index: 10;
          transition: background-color var(--transition-normal), border-color var(--transition-normal);
        }

        .breadcrumb-area {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .breadcrumb-parent {
          color: var(--text-muted);
        }

        .breadcrumb-separator {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Search input bar */
        .search-wrapper {
          position: relative;
          width: 320px;
          margin-left: 2rem;
          margin-right: auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 38px;
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          padding: 0 1rem 0 2.5rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          transition: border-color var(--transition-fast), background-color var(--transition-normal);
        }
        .search-input:focus {
          border-color: var(--color-blue);
          background-color: var(--bg-card);
        }

        /* Right Nav controls */
        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .icon-control-btn {
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }
        .icon-control-btn:hover {
          background-color: var(--bg-app);
          border-color: var(--border-color);
          color: var(--text-primary);
        }

        .control-icon {
          width: 18px;
          height: 18px;
        }
        .control-icon.text-yellow {
          color: #EAB308;
        }

        .alert-badge-wrapper {
          position: relative;
        }

        .notification-badge-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          background-color: #EF4444;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-card);
        }

        /* Quick Action */
        .quick-action-container {
          position: relative;
        }

        .quick-action-btn {
          height: 38px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .quick-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
        }

        .quick-action-icon {
          width: 15px;
          height: 15px;
        }

        /* User profile */
        .profile-container {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background-color var(--transition-fast);
        }
        .profile-trigger:hover {
          background-color: var(--bg-app);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          background-color: #8B5CF6;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .profile-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .profile-role {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .profile-chevron {
          width: 14px;
          height: 14px;
          color: var(--text-muted);
        }

        /* Dropdown common styles */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: var(--shadow-lg);
          min-width: 180px;
          z-index: 50;
          overflow: hidden;
          animation: fadeIn 0.15s ease-out forwards;
        }

        .quick-action-menu {
          right: 0;
        }

        .dropdown-item {
          padding: 0.65rem 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color var(--transition-fast), color var(--transition-fast);
          text-align: left;
        }
        .dropdown-item:hover {
          background-color: var(--bg-app);
          color: var(--text-primary);
        }

        .dropdown-item-icon {
          width: 15px;
          height: 15px;
          color: var(--text-muted);
        }

        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--border-color);
          margin: 0;
        }

        .text-danger {
          color: var(--color-red) !important;
        }
        .text-danger .dropdown-item-icon {
          color: var(--color-red) !important;
        }
      `}</style>
    </header>
  );
>>>>>>> d6b4c61da0bb69a7680fb1d1ae420d136d713987
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

  const { notificationCount, user, toggleTheme, theme } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadNotifs() {
      try {
        const response = await fetch(`${API_BASE}/notifications`);

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

  const initials = (user?.name || "AM")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pageTitle = ROUTE_TITLES[location.pathname] || "ContractIQ";

  const q = query.trim().toLowerCase();
  const matches = q
    ? SEARCH_INDEX.filter((it) =>
        (it.label + " " + it.sub + " " + it.group).toLowerCase().includes(q)
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.clear();
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
        title="Toggle menu"
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
        <Link to="/calendar" className="icon-btn" title="Calendar">
          <CalendarIcon size={16} />
        </Link>

        <button type="button" className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        <Link to="/help" className="icon-btn" title="Help & Support">
          <HelpIcon />
        </Link>

        <div className="dropdown-wrap" ref={bellRef}>
          <button
            type="button"
            className="icon-btn"
            title="Notifications"
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
              <button type="button" className="dd-item" onClick={() => goTo("/reports")}>
                <BarIcon size={17} color="#F59E0B" /> View Analytics
              </button>
              <button type="button" className="dd-item" onClick={() => goTo("/help")}>
                <HelpIcon size={17} color="#10B981" /> File Support Ticket
              </button>
              <button type="button" className="dd-item" onClick={() => goTo("/profile")}>
                <UserIcon size={17} color="#8B5CF6" /> Manage Profile
              </button>
            </div>
          )}
        </div>

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
              <strong>{user?.name || "Guest"}</strong>
              <span>{user?.role || "User"}</span>
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
                  <strong>{user?.name || "Guest"}</strong>
                  <span>{user?.email || ""}</span>
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