// Compliance Dashboard\client\src\pages\Home.js
import React from 'react';
import Sidebar from '../layout/Sidebar';
import '../assets/Compliance.css';

export default function Home() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Main Dashboard</h1>
          </div>
        </header>
        <div className="content-scroll">
          <p>Database connection for Dashboard metrics pending.</p>
        </div>
      </main>
    </div>
  );
}