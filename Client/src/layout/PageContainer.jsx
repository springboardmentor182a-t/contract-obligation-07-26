import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const PageContainer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('user-role') || 'Legal Manager');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleRoleChange = (newRole) => {
    localStorage.setItem('user-role', newRole);
    setUserRole(newRole);
    window.dispatchEvent(new Event('roleChanged'));
  };

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} userRole={userRole} />
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      <div className="layout-main">
        <Navbar toggleSidebar={toggleSidebar} userRole={userRole} onRoleChange={handleRoleChange} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageContainer;

