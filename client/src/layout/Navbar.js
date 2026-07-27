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
              import React, {useState, useRef, useEffect} from "react";
              import {Link, useNavigate, useLocation} from "react-router-dom";
              import {useUI} from "../context/UIContext";
              import {
                ChevRightSmIcon, SearchIcon, MoonIcon, SunIcon, HelpIcon, BellIcon, PlusIcon,
                FileIcon, BarIcon, ChevDownIcon, UserIcon,
                GearIcon, BellSmIcon, LogoutIcon, MenuIcon,
} from "../components/Icons";

              const ROUTE_TITLES = {
                "/": "Dashboard",
              "/renewal-dashboard": "Renewal Dashboard",
              "/reports": "Reports & Analytics",
              "/settings": "Settings",
              "/notifications": "Notifications",
              "/calendar": "Calendar",
              "/profile": "My Profile",
              "/quick-actions": "Quick Actions",
              "/help": "Help & Support",
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
              {group: "Pages", label: "Reports & Analytics", sub: "Data visualization & KPIs", to: "/reports" },
              {group: "Pages", label: "Notifications", sub: "Alert feed & history", to: "/notifications" },
              {group: "Pages", label: "Quick Actions", sub: "Instant operations grid", to: "/quick-actions" },
              {group: "Pages", label: "My Profile", sub: "Personal settings & authority", to: "/profile" },
              {group: "Pages", label: "Settings", sub: "App configuration & billing", to: "/settings" },
              {group: "Pages", label: "Help & Support", sub: "FAQs & ticket submission", to: "/help" },
              {group: "Pages", label: "Calendar", sub: "Compliance milestones & renewals calendar", to: "/calendar" },
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

              export default function Navbar({onToggleSidebar}) {
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

              const {notificationCount, user, toggleTheme, theme} = useUI();

  useEffect(() => {
                async function loadNotifs() {
                  try {
                    const res = await fetch("/api/notifications");
                    if (res.ok) {
                      const data = await res.json();
                      // Filter to show the first 3 notifications
                      setNotifPreview(data.slice(0, 3));
                    }
                  } catch (err) {
                    console.warn("Failed to load notifications for topbar preview", err);
                  }
                }
    loadNotifs();
  }, [notificationCount]);

              const navigate = useNavigate();
              const location = useLocation();
  const initials = (user?.name || "AM").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
              const pageTitle =ROUTE_TITLES[location.pathname] || "ContractIQ";

              const q = query.trim().toLowerCase();
  const matches = q ? SEARCH_INDEX.filter((it) => (it.label + " " + it.sub + " " + it.group).toLowerCase().includes(q)).slice(0, 8) : [];
              let lastGroup = "";

              function goTo(path) {
                navigate(path);
              setOpen(false); setBellOpen(false); setQaOpen(false);
  }

              return (
              <header className="topbar">
                <button className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle menu" title="Toggle menu">
                  <MenuIcon />
                </button>
                <div className="breadcrumb">
                  <span>ContractIQ</span> <ChevRightSmIcon /> <span className="active">{pageTitle}</span>
                </div>

                <div className="search-wrap">
                  <span className="search-ico"><SearchIcon /></span>
                  <input
                    type="text" autoComplete="off" placeholder="Search pages, settings, help..."
                    value={query} onChange={(e) => setQuery(e.target.value)}
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
                  <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                  </button>

                  <Link to="/help" className="icon-btn" title="Help & Support"><HelpIcon /></Link>

                  <div className="dropdown-wrap" ref={bellRef}>
                    <button className="icon-btn" title="Notifications" onClick={() => setBellOpen((o) => !o)}>
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
                          <button key={n.id} type="button" className="bell-preview-item" onClick={() => goTo("/notifications")}>
                            <span className="dot" style={{ background: NOTIF_COLORS[n.cat] || "#64748B", marginTop: 5 }} />
                            <div><strong>{n.title}</strong><p>{n.desc}</p><div className="time">{n.time}</div></div>
                          </button>
                        ))}
                        <button type="button" className="dd-viewall" onClick={() => goTo("/notifications")}>View all notifications</button>
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
        <div className="dropdown-wrap" ref={qaRef}>
          <button className="quick-action" type="button" onClick={() => setQaOpen((o) => !o)}>
            <PlusIcon /> Quick Action
          </button>
          {qaOpen && (
            <div className="dropdown" style={{ width: 236 }}>
              <button type="button" className="dd-item" onClick={() => goTo("/quick-actions")}><PlusIcon size={17} color="#3B82F6" /> Open Quick Actions</button>
              <button type="button" className="dd-item" onClick={() => goTo("/reports")}><BarIcon size={17} color="#F59E0B" /> View Analytics</button>
              <button type="button" className="dd-item" onClick={() => goTo("/help")}><HelpIcon size={17} color="#10B981" /> File Support Ticket</button>
              <button type="button" className="dd-item" onClick={() => goTo("/profile")}><UserIcon size={17} color="#8B5CF6" /> Manage Profile</button>
            </div>
          )}
        </div>

        <div className="dropdown-wrap" ref={ref}>
          <button className="user-block" onClick={() => setOpen((s) => !s)} aria-haspopup="true" aria-expanded={open}>
            <div className="avatar-purple">{initials}</div>
            <div className="user-meta"><strong>{user?.name || "Guest"}</strong><span>{user?.role || "User"}</span></div>
            <span className="chev" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .18s ease" }}><ChevDownIcon /></span>
          </button>
          {open && (
            <div className="dropdown" role="menu">
              <div className="dd-header">
                <div className="avatar-purple">{initials}</div>
                <div><strong>{user?.name || "Guest"}</strong><span>{user?.email || ""}</span></div>
              </div>
              <button type="button" className="dd-item" onClick={() => goTo("/profile")}><UserIcon /> My Profile</button>
              <button type="button" className="dd-item" onClick={() => goTo("/settings")}><GearIcon /> Settings</button>
              <button type="button" className="dd-item" onClick={() => goTo("/notifications")}><BellSmIcon /> Notifications</button>
              <button type="button" className="dd-item" onClick={() => goTo("/help")}><HelpIcon /> Help & Support</button>
              <div className="dd-sep" />
              <button type="button" className="dd-item red" onClick={() => goTo("/reports")}><LogoutIcon /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
