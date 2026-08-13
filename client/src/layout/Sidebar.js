import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const displayName = storedUser?.name || 'Guest User';
  const displayRole = storedUser?.role || 'Member';

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>ContractIQ</h2>
        <p>Contract Obligation Tracking Assistant</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
          </li>

          <li className={location.pathname === '/contracts' ? 'active' : ''}>
            <Link to="/contracts" style={linkStyle}>
              Contracts
            </Link>
          </li>

          <li className={location.pathname === '/obligations' ? 'active' : ''}>
            <Link to="/obligations" style={linkStyle}>
              Obligations
            </Link>
          </li>

          <li className={location.pathname === '/compliance' ? 'active' : ''}>
            <Link to="/compliance" style={linkStyle}>
              Compliance
            </Link>
          </li>

          <li className={location.pathname === '/renewals' ? 'active' : ''}>
            <Link to="/renewals" style={linkStyle}>
              Renewals
            </Link>
          </li>

          <li className={location.pathname === '/calendar' ? 'active' : ''}>
            <Link to="/calendar" style={linkStyle}>Calendar</Link>
          </li>

          <li className={location.pathname === '/documents' ? 'active' : ''}>
            <Link to="/documents" style={linkStyle}>
              Documents
            </Link>
          </li>

          <li className={location.pathname === '/tasks' ? 'active' : ''}>
            <Link to="/tasks" style={linkStyle}>
              Tasks
            </Link>
          </li>

          <li className={location.pathname === '/reports' ? 'active' : ''}>
            <Link to="/reports" style={linkStyle}>
              Reports
            </Link>
          </li>

          <li className={location.pathname === '/notifications' ? 'active' : ''}>
            <Link to="/notifications" style={linkStyle}>
              Notifications <span className="badge">3</span>
            </Link>
          </li>

          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users" style={linkStyle}>
              Users
            </Link>
          </li>

          {/* --- NEW: Help & Support Link --- */}
          <li className={location.pathname === '/support' ? 'active' : ''}>
            <Link to="/support" style={linkStyle}>
              Help & Support
            </Link>
          </li>

          <li className={location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings" style={linkStyle}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-alerts">
        <div className="alert-card">
          <h4>Need help?</h4>
          <p>We are here to help you anytime</p>

          {/* Pointed this button to the new Support dashboard too */}
          <Link to="/support" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#5f27cd',
                color: 'white',
                width: '100%',
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Get Support
            </button>
          </Link>
        </div>
      </div>

      <div className="sidebar-profile">
        <img
          src={storedUser?.profilePic || 'default_profile.png'}
          alt="Profile"
        />
        <div>
          <p>{displayName}</p>
          <span>{displayRole}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;