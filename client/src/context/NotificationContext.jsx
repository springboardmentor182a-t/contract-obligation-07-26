import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications directly from PostgreSQL via FastAPI backend
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
      console.error('Failed to fetch notifications from PostgreSQL:', err);
      setError(err.message || 'Failed to load notifications from database');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and periodically sync every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark a single notification as read in PostgreSQL
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
      await axios.put(`${API_BASE}/api/notifications/${notificationId}/read`);
    } catch (err) {
      console.error(`Failed to mark notification ${notificationId} as read:`, err);
      // Refresh to ensure consistent database state
      fetchNotifications();
    }
  };

  // Mark all notifications as read in PostgreSQL
  const markAllAsRead = async () => {
    // Optimistically update all to read
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('userName');
      const url = `${API_BASE}/api/notifications/read-all${userEmail ? `?user_id=${encodeURIComponent(userEmail)}` : ''}`;
      await axios.put(url);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      fetchNotifications();
    }
  };

  // Create a new notification directly in PostgreSQL
  const createNotification = async (payload) => {
    try {
      const url = `${API_BASE}/api/notifications`;
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data) {
        setNotifications(prev => [response.data, ...prev]);
        if (!response.data.is_read) {
          setUnreadCount(prev => prev + 1);
        }
      }
      return response.data;
    } catch (err) {
      console.error('Failed to create notification in PostgreSQL:', err);
      throw err;
    }
  };

  // Delete notification from PostgreSQL
  const deleteNotification = async (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId && n.notification_id !== notificationId));
    try {
      await axios.delete(`${API_BASE}/api/notifications/${notificationId}`);
    } catch (err) {
      console.error(`Failed to delete notification ${notificationId}:`, err);
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
        apiBaseUrl: API_BASE,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        createNotification,
        deleteNotification
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
