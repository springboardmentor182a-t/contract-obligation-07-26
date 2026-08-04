import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications, getAdminNotifications } from '../features/notifications/services/notificationAPI';

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const { userProfile, logout, role, changeRole } = useAuth();
  const dropdownRef = useRef(null);
  const prevNotifsRef = useRef([]);
  const navigate = useNavigate();
  const isAdmin = role === 'Admin' || role === 'Administrator';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchNotifs = async () => {
      try {
        let data = [];
        if (isAdmin) {
          data = await getAdminNotifications();
        } else {
          data = await getUserNotifications();
        }
        
        const prevIds = prevNotifsRef.current.map(n => n.notification_id || n.id);
        const newNotifs = data.filter(n => !(n.notification_id || n.id) || !prevIds.includes(n.notification_id || n.id));
        
        if (prevNotifsRef.current.length > 0 && newNotifs.length > 0) {
          const latest = newNotifs[0];
          setToast(latest);
          setTimeout(() => setToast(null), 5000);
        } else if (prevNotifsRef.current.length === 0) {
          const now = Date.now();
          const recentNotifs = data.filter(n => {
            if (!n.date && !n.created_at) return false;
            const time = new Date(n.date || n.created_at).getTime();
            return (now - time) < 5000;
          });
          if (recentNotifs.length > 0) {
            setToast(recentNotifs[0]);
            setTimeout(() => setToast(null), 5000);
          }
        }
        
        prevNotifsRef.current = data;
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (role !== undefined) {
      fetchNotifs();
      intervalId = setInterval(fetchNotifs, 10000);
      window.addEventListener('notification-created', fetchNotifs);
    }
    
    const handleLocalToast = (e) => {
      setToast({ title: e.detail.title, message: e.detail.message });
      setTimeout(() => setToast(null), 5000);
    };
    window.addEventListener('show-local-toast', handleLocalToast);

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('notification-created', fetchNotifs);
      window.removeEventListener('show-local-toast', handleLocalToast);
    };
  }, [isAdmin, role]);

  const unreadCount = (Array.isArray(notifications) ? notifications : []).filter(n => !n.is_read).length;

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
          {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
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
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>

      {toast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          backgroundColor: 'var(--color-white)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          borderLeft: '4px solid var(--color-primary)',
          zIndex: 1000,
          minWidth: '300px',
          maxWidth: '400px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>{toast.title || 'New Notification'}</h4>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', fontSize: '1rem', padding: '0 4px' }}>✕</button>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{toast.message}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
