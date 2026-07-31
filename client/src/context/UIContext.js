import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UIContext = createContext(null);

/**
 * Get the auth token from storage (localStorage for "remember me", sessionStorage otherwise).
 */
function getStoredToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
}

/**
 * Get the user info that Login.js stored after a successful login.
 */
function getStoredUser() {
  const name = localStorage.getItem('name') || sessionStorage.getItem('name') || '';
  const role = localStorage.getItem('role') || sessionStorage.getItem('role') || '';
  const email = localStorage.getItem('email') || sessionStorage.getItem('email') || '';
  return { name, role, email };
}

export function UIProvider({ children }) {
  const [notificationCount, setNotificationCount] = useState(0);

  // Initialise from storage so name/role appear immediately after login redirect
  const [user, setUser] = useState(() => getStoredUser());

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Apply / persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // After mounting, refresh user from the API (passing the JWT so the backend
  // returns the correct user, not always user #1).
  const loadUserProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return; // not logged in yet

    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const refreshed = {
          name: data.full_name || data.name || data.email,
          role: data.role || 'User',
          email: data.email || '',
        };
        setUser(refreshed);
        // Keep storage in sync so getStoredUser() returns up-to-date values
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('name', refreshed.name);
        storage.setItem('role', refreshed.role);
        storage.setItem('email', refreshed.email);
      }
    } catch (err) {
      console.warn('Profile API unavailable:', err);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Fetch notification count from backend
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    async function loadNotifCount() {
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const unread = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
          setNotificationCount(unread);
        }
      } catch {
        // silently fail — sidebar health check handles system errors
      }
    }
    loadNotifCount();
    const interval = setInterval(loadNotifCount, 60000);
    return () => clearInterval(interval);
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  function showToast(message) {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }

  return (
    <UIContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        user,
        setUser,
        theme,
        toggleTheme,
        toast,
        showToast,
        refreshUser: loadUserProfile,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}

export default UIContext;
