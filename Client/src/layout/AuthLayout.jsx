import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus, KeyRound, Menu } from 'lucide-react';
import './Layout.css';

const AuthSidebar = ({ isOpen, closeSidebar }) => (
  <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="sidebar-header">
      <ShieldCheck className="sidebar-logo-icon" size={28} />
      <div className="sidebar-title">Contract<span>IQ</span></div>
    </div>
    
    <nav className="sidebar-nav">
      <NavLink to="/login" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
        <LogIn size={20} />
        <span>Login</span>
      </NavLink>
      <NavLink to="/register" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
        <UserPlus size={20} />
        <span>Register</span>
      </NavLink>
      <NavLink to="/forgot-password" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
        <KeyRound size={20} />
        <span>Forgot Password</span>
      </NavLink>
    </nav>
  </aside>
);

const AuthNavbar = ({ toggleSidebar }) => (
  <header className="header" style={{ justifyContent: 'space-between' }}>
    <div className="header-left">
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginLeft: '1rem', color: 'var(--color-text)' }} className="hidden-on-mobile">
        Welcome to ContractIQ
      </h2>
    </div>
  </header>
);

const AuthLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="layout-wrapper">
      <AuthSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      <div className="layout-main">
        <AuthNavbar toggleSidebar={toggleSidebar} />
        <main className="layout-content" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', background: 'linear-gradient(135deg, var(--color-bg-light) 0%, var(--color-bg) 100%)' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ width: '100%', flexShrink: 0 }}>
            <Outlet />
          </div>
          <div style={{ flex: 1 }}></div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
