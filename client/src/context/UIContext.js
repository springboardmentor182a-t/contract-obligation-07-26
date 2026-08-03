import React, {createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { API_BASE } from "../config/api";

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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

// After mounting, refresh user from the API (passing the JWT so the backend
// returns the correct user, not always user #1).
const loadUserProfile = useCallback(async () => {
  const token = getStoredToken();
  if (!token) return;

  // Show stored user immediately
  const stored = getStoredUser();
  if (stored.name) setUser(stored);

  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();

      const refreshed = {
        name: data.full_name || data.name || stored.name || data.email,
        role: data.role || stored.role || "User",
        email: data.email || stored.email || "",
      };

      setUser(refreshed);

      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;

      storage.setItem("name", refreshed.name);
      storage.setItem("role", refreshed.role);
      storage.setItem("email", refreshed.email);
    }
  } catch (err) {
    console.warn("Profile API unavailable, using stored data:", err);
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
