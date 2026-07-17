import "./Sidebar.css";
import {
  MdDashboard,
  MdDescription,
  MdAssignment,
  MdAutorenew,
  MdNotifications,
  MdBarChart,
  MdCalendarMonth,
  MdFolder,
  MdSettings,
  MdHelpOutline,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo-section">
        <div className="logo-icon">
          🛡️
        </div>

        <div className="logo-text">
          <h2>Contract Obligation</h2>
          <h3>Tracking Assistant</h3>
        </div>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">

        <li>
          <MdDashboard className="icon" />
          <span>Dashboard</span>
        </li>

        <li>
          <MdDescription className="icon" />
          <span>Contracts</span>
        </li>

        <li>
          <MdAssignment className="icon" />
          <span>Obligations</span>
        </li>

        <li className="active">
          <MdAutorenew className="icon" />
          <span>Renewals</span>
        </li>

        <li>
          <MdNotifications className="icon" />
          <span>Alerts</span>
        </li>

        <li>
          <MdBarChart className="icon" />
          <span>Reports</span>
        </li>

        <li>
          <MdCalendarMonth className="icon" />
          <span>Calendar</span>
        </li>

        <li>
          <MdFolder className="icon" />
          <span>Documents</span>
        </li>

        <li>
          <MdSettings className="icon" />
          <span>Settings</span>
        </li>

        <li>
          <MdHelpOutline className="icon" />
          <span>Help & Support</span>
        </li>

      </ul>

      {/* Alert Card */}
      <div className="alert-card">

        <div className="bell">
          🔔
        </div>

        <h4>Never miss a renewal</h4>

        <p>
          Get reminders before your contracts expire.
        </p>

        <button>
          View Alerts
        </button>

      </div>

      {/* Profile */}
      <div className="profile-section">

        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="profile"
        />

        <div>
          <h4>Spandana Doe</h4>
          <p>Compliance Manager</p>
        </div>

      </div>

      {/* Collapse */}
      <div className="collapse">

        <MdKeyboardDoubleArrowLeft />

        <span>Collapse</span>

      </div>

    </aside>
  );
};

export default Sidebar;