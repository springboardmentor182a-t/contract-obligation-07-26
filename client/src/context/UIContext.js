import React, {createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { API_BASE } from "../config/api";
import {
  clearStoredAuth,
  getStoredToken,
} from "../utils/auth";

const UIContext = createContext(null);

function getStoredDisplayUser() {
  const name = localStorage.getItem('name') || sessionStorage.getItem('name') || '';
  const email = localStorage.getItem('email') || sessionStorage.getItem('email') || '';
  return { name, role: "", email };
}

export function UIProvider({ children }) {
  const [notificationCount, setNotificationCount] = useState(0);

  const [user, setUser] = useState(() => getStoredDisplayUser());
  const [authReady, setAuthReady] = useState(() => !getStoredToken());
  const authGenerationRef = useRef(0);
  const profileRequestRef = useRef(null);
  const notificationRequestRef = useRef(null);
  const notificationIntervalRef = useRef(null);

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
    const stored = getStoredDisplayUser();
    const authGeneration = authGenerationRef.current;

    if (!token) {
      setUser(stored);
      setAuthReady(true);
      return null;
    }

    profileRequestRef.current?.abort();
    const controller = new AbortController();
    profileRequestRef.current = controller;

    const sessionIsCurrent = () => (
      authGenerationRef.current === authGeneration &&
      getStoredToken() === token
    );

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!sessionIsCurrent()) return null;

      if (!res.ok) {
        clearStoredAuth();
        setUser({ name: "", role: "", email: "" });
        setNotificationCount(0);
        return null;
      }

      const data = await res.json();
      if (!sessionIsCurrent()) return null;

      if (!data.role) {
        clearStoredAuth();
        setUser({ name: "", role: "", email: "" });
        setNotificationCount(0);
        return null;
      }

      const refreshed = {
        name: data.full_name || data.name || stored.name || data.email,
        role: data.role,
        email: data.email || stored.email || "",
      };

      setUser(refreshed);

      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;

      storage.setItem("name", refreshed.name);
      storage.setItem("role", refreshed.role);
      storage.setItem("email", refreshed.email);
      return refreshed;
    } catch (err) {
      if (err.name === "AbortError" || !sessionIsCurrent()) {
        return null;
      }

      setUser({ ...stored, role: "" });
      console.warn("Authenticated profile could not be verified.");
      return null;
    } finally {
      if (profileRequestRef.current === controller) {
        profileRequestRef.current = null;
      }
      if (sessionIsCurrent()) {
        setAuthReady(true);
      }
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
    return () => profileRequestRef.current?.abort();
  }, [loadUserProfile]);

  // Fetch notification count from backend
  useEffect(() => {
    const token = getStoredToken();
    if (!token || !user?.role) {
      setNotificationCount(0);
      return undefined;
    }

    let active = true;

    async function loadNotifCount() {
      if (!active || getStoredToken() !== token) return;

      notificationRequestRef.current?.abort();
      const controller = new AbortController();
      notificationRequestRef.current = controller;

      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (res.ok && active && getStoredToken() === token) {
          const data = await res.json();
          const unread = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
          if (active && getStoredToken() === token) {
            setNotificationCount(unread);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        // silently fail — sidebar health check handles system errors
      } finally {
        if (notificationRequestRef.current === controller) {
          notificationRequestRef.current = null;
        }
      }
    }

    loadNotifCount();
    const interval = setInterval(loadNotifCount, 60000);
    notificationIntervalRef.current = interval;

    return () => {
      active = false;
      clearInterval(interval);
      if (notificationIntervalRef.current === interval) {
        notificationIntervalRef.current = null;
      }
      notificationRequestRef.current?.abort();
      notificationRequestRef.current = null;
    };
  }, [user?.role]);

  const logout = useCallback(() => {
    authGenerationRef.current += 1;
    profileRequestRef.current?.abort();
    profileRequestRef.current = null;
    notificationRequestRef.current?.abort();
    notificationRequestRef.current = null;
    if (notificationIntervalRef.current) {
      clearInterval(notificationIntervalRef.current);
      notificationIntervalRef.current = null;
    }

    clearStoredAuth();
    setUser({ name: "", role: "", email: "" });
    setNotificationCount(0);
    setAuthReady(true);
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
        authReady,
        authenticated: Boolean(authReady && getStoredToken() && user?.role),
        logout,
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
