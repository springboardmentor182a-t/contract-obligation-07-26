import React from "react";

import {
  FiHome,
  FiFileText,
  FiCheckCircle,
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
  { icon: <FiHome size={18} />, text: "Dashboard" },
  { icon: <FiFileText size={18} />, text: "Contracts", active: true },
  { icon: <FiCheckCircle size={18} />, text: "Obligations" },
  { icon: <FiShield size={18} />, text: "Compliance" },
  { icon: <FiCalendar size={18} />, text: "Calendar" },
  { icon: <FiFolder size={18} />, text: "Documents" },
  { icon: <FiCheckSquare size={18} />, text: "Tasks" },
  { icon: <FiBarChart2 size={18} />, text: "Reports" },
  { icon: <FiBell size={18} />, text: "Notifications" },
  { icon: <FiUsers size={18} />, text: "Users" },
  { icon: <FiSettings size={18} />, text: "Settings" },
];

function Sidebar() {
  return (
    <aside className="sidebar">

      <div>

        <div className="logo">

          <div className="logo-icon">
            CI
          </div>

          <div className="logo-text">

            <h2>ContractIQ</h2>

            <p>Tracking Assistant</p>

          </div>

        </div>

        <nav className="menu">

          {menuItems.map((item) => (

            <div
              key={item.text}
              className={`menu-item ${item.active ? "active" : ""}`}
            >

              <span className="menu-icon">
                {item.icon}
              </span>

              <p>{item.text}</p>

            </div>

          ))}

        </nav>

      </div>

      <div className="sidebar-bottom">

        <div className="alert-card">

          <h4>Stay on top of your obligations</h4>

          <p>
            Get real-time alerts and never miss a deadline.
          </p>

          <button>
            Manage Alerts
          </button>

        </div>

        <div className="profile-card">

          <div className="profile-avatar">
            JD
          </div>

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