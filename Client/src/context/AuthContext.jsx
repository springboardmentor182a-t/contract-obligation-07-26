import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '../features/authentication/services/getUsers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const data = await getUsers();
        // If there's an overridden role in localStorage, apply it!
        const overriddenRole = localStorage.getItem('user-role');
        if (overriddenRole) {
          data.role = overriddenRole;
        }
        setUserProfile(data);
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

  const login = (data) => {
    setUserProfile(data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user-role');
    setUserProfile(null);
    window.location.href = '/login';
  };

  const changeRole = (newRole) => {
    localStorage.setItem('user-role', newRole);
    setUserProfile(prev => (prev ? { ...prev, role: newRole } : { role: newRole }));
    window.dispatchEvent(new Event('roleChanged'));
  };

  return (
    <AuthContext.Provider value={{ 
      userProfile, 
      role: userProfile?.role, 
      loading, 
      login, 
      logout, 
      changeRole,
      refreshProfile: fetchProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
