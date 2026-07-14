// client/src/pages/Renewals.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import '../assets/Compliance.css';

export default function Renewals() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/renewals/');
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
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Renewals Management</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Monitor and manage upcoming contract renewals.</p>
          </div>
          <div className="header-actions">
            <input type="text" placeholder="Search renewals..." className="search-input" />
            <button className="btn btn-primary">+ Initiate Renewal</button>
          </div>
        </header>
        <div className="content-scroll">
          <div className="table-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>Renewal Action Date</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td style={{ color: '#4f46e5', fontWeight: '500' }}>{row.contract_id}</td>
                    <td>
                      <span className={`status-badge status-${row.status.replace(' ', '-')}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.expiry_date}</td>
                    <td><strong style={{ color: '#0f172a' }}>{row.renewal_date}</strong></td>
                    <td>{row.owner}</td>
                  </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No renewals found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}