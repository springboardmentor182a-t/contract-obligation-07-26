// client/src/pages/Contracts.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import '../assets/Compliance.css';

export default function Contracts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/contracts/');
        if (response.ok) setData(await response.json());
      } catch (error) {
        console.error("Backend fetch error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Contract Repository</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage and track all organizational contracts.</p>
          </div>
          <div className="header-actions">
            <input type="text" placeholder="Search contracts..." className="search-input" />
            <button className="btn btn-primary">+ New Contract</button>
          </div>
        </header>
        <div className="content-scroll">
          <div className="table-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Title</th>
                  <th>Party</th>
                  <th>Status</th>
                  <th>Effective Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td style={{ color: '#4f46e5', fontWeight: '500' }}>{row.id}</td>
                    <td><strong style={{ color: '#0f172a' }}>{row.title}</strong></td>
                    <td>{row.party}</td>
                    <td>
                      <span className={`status-badge status-${row.status.replace(' ', '-')}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.effective_date}</td>
                    <td>{row.expiry_date}</td>
                  </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center'}}>No contracts found. Seed the database.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}