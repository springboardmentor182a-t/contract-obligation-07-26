import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '../features/authentication/services/getUsers';
import { getUserSettings } from '../features/settings/services/userSettings';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themePreference, setThemePreference] = useState(() => localStorage.getItem('theme') || 'light');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const data = await getUsers();
        setUserProfile(data);
        
        try {
          const settings = await getUserSettings();
          if (settings && settings.theme) {
            setThemePreference(settings.theme);
            localStorage.setItem('theme', settings.theme);
          }
        } catch (err) {
          console.error("Could not apply theme:", err);
        }
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setUserProfile(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!themePreference) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      if (themePreference === 'system') {
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', themePreference);
      }
    };
    
    applyTheme();
    
    const handleChange = () => {
      if (themePreference === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  const login = (data) => {
    setUserProfile(data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    setUserProfile(null);
    window.location.href = '/login';
  };

  const updateGlobalTheme = (newTheme) => {
    setThemePreference(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <AuthContext.Provider value={{ userProfile, role: userProfile?.role, loading, login, logout, refreshProfile: fetchProfile, updateGlobalTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
