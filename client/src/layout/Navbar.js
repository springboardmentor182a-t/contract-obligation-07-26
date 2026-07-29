import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useUI } from "../context/UIContext";

import {
  ChevRightSmIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
  HelpIcon,
  BellIcon,
  PlusIcon,
  FileIcon,
  BarIcon,
  ChevDownIcon,
  UserIcon,
  GearIcon,
  BellSmIcon,
  LogoutIcon,
  MenuIcon,
} from "../components/Icons";

const ROUTE_TITLES = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/renewal-dashboard": "Renewal Dashboard",
  "/obligations": "Obligation Tracker",
  "/compliance": "Compliance",
  "/contract-repository": "Contract Repository",
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
  {
    group: "Pages",
    label: "Reports & Analytics",
    sub: "Data visualization & KPIs",
    to: "/reports",
  },
  {
    group: "Pages",
    label: "Notifications",
    sub: "Alert feed & history",
    to: "/notifications",
  },
  {
    group: "Pages",
    label: "Quick Actions",
    sub: "Instant operations grid",
    to: "/quick-actions",
  },
  {
    group: "Pages",
    label: "My Profile",
    sub: "Personal settings & authority",
    to: "/profile",
  },
  {
    group: "Pages",
    label: "Settings",
    sub: "App configuration & billing",
    to: "/settings",
  },
  {
    group: "Pages",
    label: "Help & Support",
    sub: "FAQs & ticket submission",
    to: "/help",
  },
  {
    group: "Pages",
    label: "Calendar",
    sub: "Compliance milestones & renewals calendar",
    to: "/calendar",
  },
  { group: "Pages", label: "Reports & Analytics", sub: "Data visualization & KPIs", to: "/reports" },
  { group: "Pages", label: "Notifications", sub: "Alert feed & history", to: "/notifications" },
  { group: "Pages", label: "Quick Actions", sub: "Instant operations grid", to: "/quick-actions" },
  { group: "Pages", label: "My Profile", sub: "Personal settings & authority", to: "/profile" },
  { group: "Pages", label: "Settings", sub: "App configuration & billing", to: "/settings" },
  { group: "Pages", label: "Help & Support", sub: "FAQs & ticket submission", to: "/help" },
  { group: "Pages", label: "Calendar", sub: "Compliance milestones & renewals calendar", to: "/calendar" },
  {group: "Pages",label: "Contract Repository",sub: "Manage and search contracts",to: "/repository"},
];

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function onClick(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        handler();
      }
    }

    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        onClick
      );
    };
  }, [ref, handler]);
}

export default function Navbar({
  onToggleSidebar,
}) {
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifPreview, setNotifPreview] =
    useState([]);

  const ref = useRef();
  const bellRef = useRef();
  const qaRef = useRef();

  useOutsideClick(ref, () => setOpen(false));
  useOutsideClick(
    bellRef,
    () => setBellOpen(false)
  );
  useOutsideClick(
    qaRef,
    () => setQaOpen(false)
  );

  const {
    notificationCount,
    user,
    toggleTheme,
    theme,
  } = useUI();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadNotifs() {
      try {
        const response = await fetch(
          "/api/notifications"
        );

        if (response.ok) {
          const data = await response.json();
          setNotifPreview(data.slice(0, 3));
        }
      } catch (error) {
        console.warn(
          "Failed to load notifications for topbar preview",
          error
        );
      }
    }

    loadNotifs();
  }, [notificationCount]);

  const initials = (user?.name || "AM")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pageTitle =
    ROUTE_TITLES[location.pathname] ||
    "ContractIQ";

  const normalizedQuery = query
    .trim()
    .toLowerCase();

  const matches = normalizedQuery
    ? SEARCH_INDEX.filter((item) =>
        `${item.label} ${item.sub} ${item.group}`
          .toLowerCase()
          .includes(normalizedQuery)
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

    navigate("/login", {
      replace: true,
    });
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
        <span>ContractIQ</span>
        <ChevRightSmIcon />
        <span className="active">
          {pageTitle}
        </span>
      </div>

      <div className="search-wrap">
        <span className="search-ico">
          <SearchIcon />
        </span>

        <input
          type="text"
          autoComplete="off"
          placeholder="Search pages, settings, help..."
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />

        {normalizedQuery && (
          <div className="search-results">
            {matches.length === 0 && (
              <div className="sr-empty">
                No results for "{query}"
              </div>
            )}

            {matches.map((match, index) => {
              const showLabel =
                match.group !== lastGroup;

              lastGroup = match.group;

              return (
                <React.Fragment key={index}>
                  {showLabel && (
                    <div className="sr-group-label">
                      {match.group}
                    </div>
                  )}

                  <div
                    className="sr-item"
                    onClick={() => {
                      goTo(match.to);
                      setQuery("");
                    }}
                  >
                    <div className="ico">
                      <FileIcon size={15} />
                    </div>

                    <div>
                      <strong>
                        {match.label}
                      </strong>
                      <span>{match.sub}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      <div className="top-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "light" ? (
            <MoonIcon />
          ) : (
            <SunIcon />
          )}
        </button>

        <Link
          to="/help"
          className="icon-btn"
          title="Help & Support"
        >
          <HelpIcon />
        </Link>

        <div
          className="dropdown-wrap"
          ref={bellRef}
        >
          <button
            type="button"
            className="icon-btn"
            title="Notifications"
            onClick={() =>
              setBellOpen(
                (currentValue) =>
                  !currentValue
              )
            }
          >
            <BellIcon />

            {notificationCount > 0 && (
              <span className="bell-badge">
                {notificationCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div
              className="dropdown"
              style={{ width: 320 }}
            >
              <div
                className="dd-header"
                style={{
                  justifyContent:
                    "space-between",
                }}
              >
                <strong
                  style={{ fontSize: 13.5 }}
                >
                  Notifications
                </strong>

                <span className="badge danger">
                  {notificationCount} unread
                </span>
              </div>

              {notifPreview.map(
                (notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className="bell-preview-item"
                    onClick={() =>
                      goTo("/notifications")
                    }
                  >
                    <span
                      className="dot"
                      style={{
                        background:
                          NOTIF_COLORS[
                            notification.cat
                          ] || "#64748B",
                        marginTop: 5,
                      }}
                    />

                    <div>
                      <strong>
                        {notification.title}
                      </strong>

                      <p>
                        {notification.desc}
                      </p>

                      <div className="time">
                        {notification.time}
                      </div>
                    </div>
                  </button>
                )
              )}

              <button
                type="button"
                className="dd-viewall"
                onClick={() =>
                  goTo("/notifications")
                }
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div
          className="dropdown-wrap"
          ref={qaRef}
        >
          <button
            className="quick-action"
            type="button"
            onClick={() =>
              setQaOpen(
                (currentValue) =>
                  !currentValue
              )
            }
          >
            <PlusIcon />
            Quick Action
          </button>

          {qaOpen && (
            <div
              className="dropdown"
              style={{ width: 236 }}
            >
              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/quick-actions")
                }
              >
                <PlusIcon
                  size={17}
                  color="#3B82F6"
                />
                Open Quick Actions
              </button>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/reports")
                }
              >
                <BarIcon
                  size={17}
                  color="#F59E0B"
                />
                View Analytics
              </button>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/help")
                }
              >
                <HelpIcon
                  size={17}
                  color="#10B981"
                />
                File Support Ticket
              </button>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/profile")
                }
              >
                <UserIcon
                  size={17}
                  color="#8B5CF6"
                />
                Manage Profile
              </button>
            </div>
          )}
        </div>

        <div
          className="dropdown-wrap"
          ref={ref}
        >
          <button
            type="button"
            className="user-block"
            onClick={() =>
              setOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-haspopup="true"
            aria-expanded={open}
          >
            <div className="avatar-purple">
              {initials}
            </div>

            <div className="user-meta">
              <strong>
                {user?.name || "Guest"}
              </strong>
              <span>
                {user?.role || "User"}
              </span>
            </div>

            <span
              className="chev"
              style={{
                transform: open
                  ? "rotate(180deg)"
                  : "none",
                transition:
                  "transform .18s ease",
              }}
            >
              <ChevDownIcon />
            </span>
          </button>

          {open && (
            <div
              className="dropdown"
              role="menu"
            >
              <div className="dd-header">
                <div className="avatar-purple">
                  {initials}
                </div>

                <div>
                  <strong>
                    {user?.name || "Guest"}
                  </strong>
                  <span>
                    {user?.email || ""}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/profile")
                }
              >
                <UserIcon />
                My Profile
              </button>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/settings")
                }
              >
                <GearIcon />
                Settings
              </button>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/notifications")
                }
              >
                <BellSmIcon />
                Notifications
              </button>

              <button
                type="button"
                className="dd-item"
                onClick={() =>
                  goTo("/help")
                }
              >
                <HelpIcon />
                Help & Support
              </button>

              <div className="dd-sep" />

              <button
                type="button"
                className="dd-item red"
                onClick={handleLogout}
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}