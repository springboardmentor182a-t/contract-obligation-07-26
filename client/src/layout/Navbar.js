import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../data/constants';

const Navbar = ({ user, onNewContract, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const displayName = user?.name || storedUser?.name || 'Guest User';
  const displayRole = user?.role || storedUser?.role || 'Member';

  const isDashboard =
    location.pathname === '/dashboard' || location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (location.pathname === '/compliance') {
          const response = await fetch(`${API_BASE_URL}/compliance`);
          if (response.ok) {
            const data = await response.json();
            const complianceNotifs = (data.upcomingReviews || []).map(
              (review) => ({
                title: `Review: ${review.itemName}`,
                date: `${review.date} (${review.daysLeft} days left)`,
              })
            );
            setLiveNotifications(complianceNotifs);
          }
        } else if (location.pathname === '/reports') {
          // Fetch Report Insights for the Reports page
          const response = await fetch(`${API_BASE_URL}/reports`);
          if (response.ok) {
            const data = await response.json();
            const reportNotifs = (data.insights || []).map((insight) => ({
              title: insight.title,
              date: insight.subtext,
            }));
            setLiveNotifications(reportNotifs);
          }
        } else if (location.pathname === '/documents') {
          // --- NEW: Fetch live Document Notifications ---
          const response = await fetch(`${API_BASE_URL}/notifications`);
          if (response.ok) {
            const data = await response.json();
            const docsNotifs = data.map(n => ({
              title: n.message,
              date: n.time
            }));
            setLiveNotifications(docsNotifs);
          }
        } else {
          const response = await fetch(`${API_BASE_URL}/dashboard`);
          if (response.ok) {
            const data = await response.json();
            setLiveNotifications(data.deadlines || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, [location.pathname]);

    // Set up polling for the Documents page to keep notifications extremely live
    let interval;
    if (location.pathname === '/documents') {
      interval = setInterval(fetchNotifications, 5000);
    }
    return () => clearInterval(interval);
  }, [location.pathname]); 

  return (
    <header className="navbar">
      <div className="navbar-greeting">
        <h1>Welcome back, {displayName}! 👋</h1>
        <p>Here's what's happening with your contracts today.</p>
      </div>

      <div className="navbar-actions">
        {isDashboard && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search contracts..."
              onChange={(e) =>
                onSearch && onSearch(e.target.value)
              }
            />
          </div>
        )}

        <div
          className="notifications-icon"
          onClick={() =>
            setIsNotificationsOpen(!isNotificationsOpen)
          }
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          🔔
          {liveNotifications.length > 0 && (
            <span
              className="badge"
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                background: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {liveNotifications.length}
            </span>
          )}

          {isNotificationsOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: 'absolute',
                top: '120%',
                right: '-50px',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '10px 0',
                minWidth: '250px',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  padding: '10px 20px',
                  borderBottom: '1px solid #eee',
                  fontWeight: 'bold',
                  color: 'black',
                }}
              >
                {location.pathname === '/compliance'
                  ? 'Upcoming Reviews'
                  : location.pathname === '/reports'
                  ? 'Report Alerts'
                  : 'Deadlines'}
            <div className="dropdown-menu" style={{
              position: 'absolute', top: '120%', right: '-50px', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '10px 0', minWidth: '250px', zIndex: 1000
            }}>
              <div style={{ padding: '10px 20px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: 'black' }}>
                {location.pathname === '/compliance' ? 'Upcoming Reviews' : 
                 location.pathname === '/reports' ? 'Report Alerts' : 
                 location.pathname === '/documents' ? 'Recent Activity' : 'Deadlines'}
              </div>

              {liveNotifications.length > 0 ? (
                liveNotifications.map((notif, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      borderBottom: '1px solid #eee',
                      color: '#555',
                    }}
                  >
                    <strong>{notif.title}</strong>
                    <br />
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#888',
                      }}
                    >
                      {notif.date}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    color: '#888',
                  }}
                >
                  No new notifications
                </div>
              )}

              <div
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  color: '#5f27cd',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                Mark all as read
              </div>
            </div>
          )
        </div>

        <div
          className="profile-dropdown"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <img
            src={user?.profilePic || 'default_profile.png'}
            alt="Profile"
          />
          <span>
            {displayName}
            {displayRole ? ` (${displayRole})` : ''}
          </span>

          {isProfileOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '10px 0',
                minWidth: '150px',
                zIndex: 1000,
              }}
            >
              <div
                onClick={() => navigate('/settings')}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  color: 'black',
                }}
              >
                ⚙️ Settings
              </div>

              <div
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  color: '#d63031',
                }}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>

        {isDashboard && (
          <button
            className="new-contract-btn"
            onClick={onNewContract}
          >
            + New Contract
          </button>
        )}
      </div>
    </header>
  );
};
export default Navbar;