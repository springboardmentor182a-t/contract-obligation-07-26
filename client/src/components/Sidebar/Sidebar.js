import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
  FiCalendar,
  FiFolder,
  FiCheckSquare,
  FiBarChart2,
  FiBell,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

import "../../styles/sidebar.css";

const menuItems = [
  { icon: <FiHome size={18} />, text: "Dashboard", path: "/dashboard" },
  { icon: <FiFileText size={18} />, text: "Contracts", path: "/contracts" },
  { icon: <FiCheckCircle size={18} />, text: "Obligations", path: "/obligations" },
  { icon: <FiRefreshCw size={18} />, text: "Renewals", path: "/renewals" },
  { icon: <FiShield size={18} />, text: "Compliance", path: "/compliance" },
  { icon: <FiCalendar size={18} />, text: "Calendar", path: "/calendar" },
  { icon: <FiFolder size={18} />, text: "Documents", path: "/documents" },
  { icon: <FiCheckSquare size={18} />, text: "Tasks", path: "/tasks" },
  { icon: <FiBarChart2 size={18} />, text: "Reports", path: "/reports" },
  { icon: <FiBell size={18} />, text: "Notifications", path: "/notifications" },
  { icon: <FiUsers size={18} />, text: "Users", path: "/users" },
  { icon: <FiSettings size={18} />, text: "Settings", path: "/settings" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <div className="logo-icon">CI</div>

          <div className="logo-text">
            <h2>ContractIQ</h2>
            <p>Tracking Assistant</p>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <div
              key={item.text}
              className={`menu-item ${
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              <span className="menu-icon">{item.icon}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="alert-card">
          <h4>Stay on top of your obligations</h4>

          <p>Get real-time alerts and never miss a deadline.</p>

          <button>Manage Alerts</button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">JD</div>

          <div className="profile-info">
            <h4>John Doe</h4>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;