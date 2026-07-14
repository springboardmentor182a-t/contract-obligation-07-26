// client/src/pages/Obligations.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import '../assets/Compliance.css';

export default function Obligations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/obligations/');
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
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Obligation Tracker</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track required deliveries, payments, and conditions.</p>
          </div>
          <div className="header-actions">
            <input type="text" placeholder="Search obligations..." className="search-input" />
            <button className="btn btn-primary">+ Add Obligation</button>
          </div>
        </header>
        <div className="content-scroll">
          <div className="table-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Description</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td style={{ color: '#4f46e5', fontWeight: '500' }}>{row.contract_id}</td>
                    <td><strong style={{ color: '#0f172a' }}>{row.description}</strong></td>
                    <td>{row.assignee}</td>
                    <td>{row.due_date}</td>
                    <td>
                      <span className={`status-badge status-${row.status.replace(' ', '-')}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No obligations found. Seed the database.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}