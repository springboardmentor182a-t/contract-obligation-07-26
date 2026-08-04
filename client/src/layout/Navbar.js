import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUI } from "../context/UIContext";
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

  const { notificationCount, user, toggleTheme, theme } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadNotifs() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifPreview(data.slice(0, 3));
        }
      } catch (err) {
        console.warn("Failed to load notifications for topbar preview", err);
      }
    }
    loadNotifs();
  }, [notificationCount]);

  const displayName = user?.name || user?.full_name || localStorage.getItem("name") || "Arjun Mehta";
  const displayRole = user?.role || localStorage.getItem("role") || "Administrator";
  const displayEmail = user?.email || localStorage.getItem("email") || "arjun.mehta@contractiq.com";

  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pageTitle = ROUTE_TITLES[location.pathname] || "Dashboard";

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
    localStorage.removeItem("name");
    localStorage.removeItem("email");
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

        {/* Notification Bell Button */}
        <div className="dropdown-wrap" ref={bellRef}>
          <button
            type="button"
            className="icon-btn"
            title="Notifications"
            onClick={() => setBellOpen((o) => !o)}
            style={{ position: "relative" }}
          >
            <BellIcon />
            <span className="badge" style={{ backgroundColor: "#EF4444", color: "#FFFFFF", fontSize: "0.62rem", fontWeight: "700", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: "2px", right: "2px" }}>
              {notifPreview.length || 2}
            </span>
          </button>
          {bellOpen && (
            <div className="dropdown" style={{ width: 300 }}>
              <div className="dd-header">
                <strong>Notifications ({notifPreview.length || 2})</strong>
              </div>
              {notifPreview.length === 0 ? (
                <div className="sr-empty">No recent notifications</div>
              ) : (
                notifPreview.map((n) => (
                  <div key={n.id} className="dd-item" onClick={() => goTo("/notifications")}>
                    <div>
                      <strong>{n.title}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{n.description || n.message}</div>
                    </div>
                  </div>
                ))
              )}
              <button type="button" className="dd-viewall" onClick={() => goTo("/notifications")}>
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="dropdown-wrap" ref={qaRef}>
          <button
            className="quick-action"
            type="button"
            onClick={() => setQaOpen((o) => !o)}
            style={{ backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "0.45rem 0.9rem", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: "600", fontSize: "0.82rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
          >
            <PlusIcon size={15} /> Quick Action
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

        {/* Profile Pill */}
        <div className="dropdown-wrap" ref={ref}>
          <button
            type="button"
            className="user-block"
            onClick={() => setOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={open}
            style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.25rem 0.65rem", borderRadius: "8px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <div className="avatar-purple" style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#8B5CF6", color: "#FFFFFF", fontWeight: "700", fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {initials}
            </div>
            <div className="user-meta" style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <strong style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.2 }}>{displayName}</strong>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "500" }}>{displayRole}</span>
            </div>
            <span className="chev" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .18s ease" }}>
              <ChevDownIcon size={14} color="var(--text-muted)" />
            </span>
          </button>
          {open && (
            <div className="dropdown" role="menu">
              <div className="dd-header">
                <div className="avatar-purple">{initials}</div>
                <div>
                  <strong>{displayName}</strong>
                  <span>{displayEmail}</span>
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