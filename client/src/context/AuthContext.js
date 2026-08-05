import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('token', access_token);
    const profile = {
      id: userData.id,
      name: userData.full_name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      initials: userData.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    };
    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const demoLogin = useCallback(async () => {
    const res = await api.post('/auth/demo-login');
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    const profile = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      initials: userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    };
    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
