import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  FileText, 
  Check, 
  Trash2, 
  Clock,
  Settings,
  MoreVertical,
  Eye,
  Globe
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modals/Modal';
import { useAuth } from '../../context/AuthContext';
import { getUserNotifications, getAdminNotifications, deleteNotification as deleteNotificationApi } from '../../features/notifications/services/notificationAPI';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === 'Admin' || role === 'Administrator';

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'system'
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === 'system' && isAdmin) {
        data = await getAdminNotifications();
      } else {
        data = await getUserNotifications();
      }
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mock functions for missing backend features (like marking as read)
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      (n.notification_id || n.id) === id ? { ...n, is_read: true } : n
    ));
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationApi(id);
      setNotifications(notifications.filter(n => (n.notification_id || n.id) !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(n => 
    activeTab === 'unread' ? !n.is_read : true
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notif-dashboard fade-in">
      <div className="notif-header-section">
        <div className="notif-header-content">
          <div className="notif-title-row">
            <h1 className="notif-title">Notifications</h1>
            {unreadCount > 0 && <span className="notif-badge-pill">{unreadCount} New</span>}
          </div>
          <p className="notif-subtitle">Stay updated on your contracts, obligations, and system alerts.</p>
        </div>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} icon={Check}>
              Mark all as read
            </Button>
          )}
          <Button variant="outline" icon={Settings} onClick={() => navigate('/settings')}>
            Preferences
          </Button>
        </div>
      </div>

      <div className="notif-main-area animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="notif-tabs">
          <button 
            className={`notif-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            My Notifications
          </button>
          <button 
            className={`notif-tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          {isAdmin && (
            <button 
              className={`notif-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              System Wide (Admin)
            </button>
          )}
        </div>

        <div className="notif-list-container">
          {loading ? (
            <div className="notif-empty-state">
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notif-empty-state">
              <div className="empty-bell-wrapper">
                <Bell size={48} className="empty-bell-icon" />
              </div>
              <h3>You're all caught up!</h3>
              <p>There are no {activeTab === 'unread' ? 'unread' : 'new'} alerts to review right now.</p>
            </div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const notifId = notif.notification_id || notif.id;
              const isRead = notif.is_read || false;
              const timeStr = notif.created_at ? new Date(notif.created_at).toLocaleString() : (notif.time || 'Recently');
              
              return (
                <div 
                  key={notifId} 
                  className={`notif-item-card ${!isRead ? 'is-unread' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => markAsRead(notifId)}
                >
                  {!isRead && <div className="unread-dot"></div>}
                  
                  <div className={`notif-avatar bg-tint-info`}>
                    <Bell size={22} className="notif-icon-primary" />
                  </div>
                  
                  <div className="notif-content-block">
                    <div className="notif-top-row">
                      <h4 className="notif-item-title">{notif.title || 'Notification'}</h4>
                      <span className="notif-timestamp">
                        <Clock size={12} /> {timeStr}
                      </span>
                    </div>
                    <p className="notif-item-message">{notif.message}</p>
                    
                    <div className="notif-hover-actions">
                      {!isRead && (
                        <button 
                          className="quick-action-btn action-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notifId);
                          }}
                        >
                          <Check size={14} /> Mark Read
                        </button>
                      )}
                      <button 
                        className="quick-action-btn action-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notifId);
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="notif-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === notifId ? null : notifId);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdownId === notifId && (
                      <div 
                        className="dropdown-menu" 
                        style={{ position: 'absolute', right: 0, top: '100%', display: 'block', minWidth: '150px', zIndex: 10, animation: 'dropdownIn 0.15s ease' }}
                      >
                        <div 
                          className="dropdown-item" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedNotif(notif);
                            if (!isRead) markAsRead(notifId);
                            setOpenDropdownId(null); 
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Eye size={14} /> View Details
                        </div>
                        {!isRead && (
                          <div 
                            className="dropdown-item" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              markAsRead(notifId); 
                              setOpenDropdownId(null); 
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            <Check size={14} /> Mark Read
                          </div>
                        )}
                        <div 
                          className="dropdown-item" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDelete(notifId); 
                            setOpenDropdownId(null); 
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={14} /> Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedNotif && (
        <Modal 
          isOpen={!!selectedNotif} 
          onClose={() => setSelectedNotif(null)}
          title="Notification Details"
          footer={
            <Button type="button" variant="primary" onClick={() => setSelectedNotif(null)}>Close</Button>
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className={`notif-avatar bg-tint-info`}>
              <Bell size={22} className="notif-icon-primary" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>{selectedNotif.title || 'Notification'}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> {selectedNotif.created_at ? new Date(selectedNotif.created_at).toLocaleString() : (selectedNotif.time || 'Recently')}
              </p>
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{selectedNotif.message}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notifications;
