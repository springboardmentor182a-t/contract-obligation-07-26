import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Gets the current URL path to highlight the active menu

  // Dynamically grab user info from local storage (so it's not hardcoded)
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const displayName = storedUser?.name || 'User';
  const displayRole = storedUser?.role || 'Admin';

  // Removes the default blue color and underline from React Router links
  const linkStyle = { textDecoration: 'none', color: 'inherit', display: 'block' };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>ContractIQ</h2>
        <p>Contract Obligation Tracking Assistant</p>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {/* We dynamically apply the 'active' class based on the current URL */}
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          </li>
          <li className={location.pathname === '/contracts' ? 'active' : ''}>
            <Link to="/contracts" style={linkStyle}>Contracts</Link>
          </li>
          <li className={location.pathname === '/obligations' ? 'active' : ''}>
            <Link to="/obligations" style={linkStyle}>Obligations</Link>
          </li>
          <li className={location.pathname === '/compliance' ? 'active' : ''}>
            <Link to="/compliance" style={linkStyle}>Compliance</Link>
          </li>
          <li className={location.pathname === '/calendar' ? 'active' : ''}>
            <Link to="/calendar" style={linkStyle}>Calendar</Link>
          </li>
          <li className={location.pathname === '/documents' ? 'active' : ''}>
            <Link to="/documents" style={linkStyle}>Documents</Link>
          </li>
          <li className={location.pathname === '/tasks' ? 'active' : ''}>
            <Link to="/tasks" style={linkStyle}>Tasks</Link>
          </li>
          <li className={location.pathname === '/reports' ? 'active' : ''}>
            <Link to="/reports" style={linkStyle}>Reports</Link>
          </li>
          <li className={location.pathname === '/notifications' ? 'active' : ''}>
            <Link to="/notifications" style={linkStyle}>
              Notifications <span className="badge">3</span>
            </Link>
          </li>
          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users" style={linkStyle}>Users</Link>
          </li>
          <li className={location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings" style={linkStyle}>Settings</Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-alerts">
        <div className="alert-card">
          <h4>Stay on top of your obligations</h4>
          <p>Get real-time alerts and never miss a deadline.</p>
          <button>Manage Alerts</button>
        </div>
      </div>

      <div className="sidebar-profile">
        <img src={storedUser?.profilePic || "default_profile.png"} alt="Profile" />
        <div>
          <p>{displayName}</p>
          <span>{displayRole}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;