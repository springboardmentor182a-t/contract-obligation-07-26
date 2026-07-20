import React, { createContext, useContext, useState, useEffect } from 'react';


const UIContext = createContext(null);

export function UIProvider({ children }){
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState({ name: '', role: '', email: '' });
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUser({ name: data.full_name, role: data.role, email: data.email });
        }
        // If backend is unavailable, user stays as empty — no dummy fallback
      } catch (err) {
        console.warn('Profile API unavailable — waiting for DB connection.', err);
      }
    }
    loadUserProfile();
  }, []);

  function toggleTheme(){
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }

  function showToast(message){
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 3000);
  }

  return (
    <UIContext.Provider value={{ 
      notificationCount, 
      setNotificationCount, 
      user, 
      setUser, 
      theme, 
      toggleTheme,
      toast,
      showToast
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI(){
  return useContext(UIContext);
}

export default UIContext;
