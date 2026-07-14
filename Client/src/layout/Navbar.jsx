import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userProfile, logout, role, changeRole } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="header-search">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search contracts, obligations..." />
        </div>
      </div>

      <div className="header-actions">
        <Link to="/notifications" className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </Link>

        <div className="header-divider"></div>

        <div className="user-profile-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="avatar">{userProfile?.full_name ? userProfile.full_name.substring(0, 2).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{userProfile?.full_name || 'Loading...'}</span>
              <span className="user-role">{role || '...'}</span>
            </div>
            <ChevronDown size={14} className="text-muted" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown" style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              minWidth: '200px',
              padding: '0.5rem',
              zIndex: 100,
              animation: 'dropdownIn 0.2s ease'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-bg)', marginBottom: '0.25rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{userProfile?.full_name || 'John Doe'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{userProfile?.email || 'admin@contractiq.com'}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Active Test Role</span>
                  <select 
                    value={role || 'Legal Manager'} 
                    onChange={(e) => changeRole(e.target.value)}
                    style={{ 
                      width: '100%', 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-light)',
                      color: 'var(--color-text-dark)',
                      outline: 'none',
                      fontWeight: 500
                    }}
                  >
                    <option value="Legal Manager">Legal Manager</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Admin">Administrator</option>
                    <option value="Contract Manager">Contract Manager</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => handleNavigation('/settings')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-dark)' }}
                className="dropdown-hover"
              >
                <User size={16} /> My Profile
              </button>
              <button 
                onClick={() => handleNavigation('/settings')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-dark)' }}
                className="dropdown-hover"
              >
                <Settings size={16} /> Account Settings
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--color-bg)', margin: '0.25rem 0' }}></div>
              <button 
                onClick={logout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', color: '#ef4444' }}
                className="dropdown-hover-danger"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .dropdown-hover:hover { background-color: var(--color-bg-light); color: var(--color-primary) !important; }
        .dropdown-hover-danger:hover { background-color: rgba(239, 68, 68, 0.1) !important; }
      `}</style>
    </header>
  );
};

export default Header;
