// Compliance Dashboard\client\src\layout\Sidebar.js
import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">C</div>
        <div>
          <h2 style={{ fontSize: '16px' }}>ContractIQ</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tracking Assistant</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <a href="#" className="nav-item"><span>Dashboard</span></a>
        <a href="#" className="nav-item"><span>Contracts</span></a>
        <a href="#" className="nav-item"><span>Obligations</span></a>
        <a href="#" className="nav-item active"><span>Compliance</span></a>
        <a href="#" className="nav-item"><span>Calendar</span></a>
        <a href="#" className="nav-item"><span>Documents</span></a>
        <a href="#" className="nav-item"><span>Tasks</span></a>
        <a href="#" className="nav-item"><span>Reports</span></a>
        <a href="#" className="nav-item"><span>Notifications</span> <span className="nav-badge">3</span></a>
        <a href="#" className="nav-item"><span>Users</span></a>
        <a href="#" className="nav-item"><span>Settings</span></a>
      </nav>
      
      <div className="sidebar-promo">
        <h4>🛡️ Stay compliant, stay ahead</h4>
        <p>Track compliance, resolve issues and reduce risk.</p>
        <button>View Compliance Report</button>
      </div>

      <div className="sidebar-user">
        <img src="https://i.pravatar.cc/150?img=11" alt="Saptak Biswas" className="avatar" />
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500' }}>Saptak Biswas</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Admin</p>
        </div>
      </div>
    </aside>
  );
}