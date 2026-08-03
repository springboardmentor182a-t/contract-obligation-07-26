import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL || '';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from FastAPI backend
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('userName');
      const url = `${API_BASE}/api/notifications${userEmail ? `?user_id=${encodeURIComponent(userEmail)}` : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
        const unread = response.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Fallback try with localhost:8000 if proxy isn't routing
      try {
        const directUrl = `http://127.0.0.1:8000/api/notifications`;
        const res = await axios.get(directUrl);
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.is_read).length);
          return;
        }
      } catch (directErr) {
        console.error('Direct fallback failed:', directErr);
        setError(err.message || 'Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and periodically
  useEffect(() => {
    fetchNotifications();
    
    // Periodically sync every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    // Optimistically update local state immediately
    setNotifications(prev =>
      prev.map(n =>
        (n.id === notificationId || n.notification_id === notificationId)
          ? { ...n, is_read: true }
          : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      try {
        await axios.put(`${API_BASE}/api/notifications/${notificationId}/read`);
      } catch (err) {
        // Fallback direct request
        await axios.put(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`);
      }
    } catch (err) {
      console.error(`Failed to mark notification ${notificationId} as read:`, err);
      // Refresh to ensure consistent state
      fetchNotifications();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    // Optimistically update all to read
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('userName');
      const url = `${API_BASE}/api/notifications/read-all${userEmail ? `?user_id=${encodeURIComponent(userEmail)}` : ''}`;
      try {
        await axios.put(url);
      } catch (err) {
        await axios.put(`http://127.0.0.1:8000/api/notifications/read-all`);
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
