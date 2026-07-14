// Compliance Dashboard\client\src\pages\Compliance.js
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/Compliance.css';

export default function ComplianceDashboard() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    contract_id: '',
    item_name: '',
    obligation: '',
    status: 'Compliant',
    risk_level: 'Low',
    next_review: ''
  });

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/compliance/');
      if (response.ok) setData(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/compliance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ contract_id: '', item_name: '', obligation: '', status: 'Compliant', risk_level: 'Low', next_review: '' });
        fetchData(); // Refresh the table automatically
      } else {
        const errorData = await response.json();
        alert(`Error saving data: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to connect to the backend. Please ensure your FastAPI server is running on port 8000.");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Compliance Report", 14, 15);
    
    const tableColumn = ["Contract ID", "Item", "Obligation", "Status", "Risk Level", "Next Review"];
    const tableRows = [];

    data.forEach(item => {
      const rowData = [
        item.contract_id,
        item.item_name,
        item.obligation,
        item.status,
        item.risk_level,
        item.next_review
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    doc.save("Compliance_Report.pdf");
  };

  const total = data.length;
  const compliant = data.filter(d => d.status === 'Compliant').length;
  const atRisk = data.filter(d => d.status === 'At Risk').length;
  const nonCompliant = data.filter(d => d.status === 'Non-Compliant').length;
  const pending = data.filter(d => d.status === 'Pending Review').length;
  
  const getPct = (val) => total === 0 ? 0 : Math.round((val / total) * 100);
  const score = getPct(compliant);

  const scoreGradient = `conic-gradient(#4f46e5 ${score}%, #e0e7ff 0)`;
  const p1 = getPct(compliant);
  const p2 = p1 + getPct(atRisk);
  const p3 = p2 + getPct(nonCompliant);
  const donutGradient = total === 0 ? '#f1f5f9' : `conic-gradient(#16a34a 0 ${p1}%, #d97706 ${p1}% ${p2}%, #dc2626 ${p2}% ${p3}%, #9333ea ${p3}% 100%)`;

  const upcomingReviews = [...data]
    .filter(d => d.next_review)
    .sort((a, b) => new Date(a.next_review) - new Date(b.next_review))
    .slice(0, 3);

  const calculateDaysLeft = (dateString) => {
    const diffTime = Math.abs(new Date(dateString) - new Date());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="dashboard-container">
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

      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Compliance Tracking</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Monitor contract compliance and manage risks proactively.</p>
          </div>
          <div className="header-actions">
            <input type="text" placeholder="Search contracts, obligations, parties..." className="search-input" />
            <button className="btn" onClick={exportPDF}>📥 Export Report</button>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Compliance Review</button>
            <div className="header-divider"></div>
            <span style={{ cursor: 'pointer', fontSize: '18px' }}>🔔</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <img src="https://i.pravatar.cc/150?img=11" alt="Saptak Biswas" className="avatar" style={{ width: '36px', height: '36px' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>Saptak Biswas ⌄</p>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="content-scroll">
          <div className="stats-grid">
            <div className="stat-card score-card">
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Overall Compliance Score</p>
              <div className="score-circle-wrap" style={{ background: scoreGradient }}>
                <div className="score-circle-inner">{score}%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-success">✓</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Compliant</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{compliant}</h2>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon icon-warning">⚠️</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px' }}>At Risk</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{atRisk}</h2>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon icon-danger">✕</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Non-Compliant</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{nonCompliant}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-pending">⏱</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Pending Review</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{pending}</h2>
              </div>
            </div>
          </div>

          <div className="dashboard-main">
            <div className="table-section">
              <div className="table-filters">
                <input type="text" placeholder="Search compliance items..." />
                <select><option>All Status</option></select>
                <select><option>All Risk Levels</option></select>
                <select><option>All Contracts</option></select>
                <button className="clear-btn">Clear</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}><input type="checkbox" /></th>
                    <th>Compliance Item</th>
                    <th>Contract</th>
                    <th>Obligation</th>
                    <th>Status</th>
                    <th>Risk Level</th>
                    <th>Last Review</th>
                    <th>Next Review</th>
                    <th>Owner</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((row) => (
                    <tr key={row.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <strong style={{ display: 'block', color: '#0f172a' }}>{row.item_name}</strong>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{row.description}</span>
                      </td>
                      <td style={{ color: '#4f46e5', fontWeight: '500' }}>{row.contract_id}</td>
                      <td style={{ color: '#475569' }}>{row.obligation}</td>
                      <td>
                        <span className={`status-badge status-${row.status.replace(' ', '-')}`}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ color: '#475569' }}>
                        <span className={`risk-dot risk-${row.risk_level}`}></span>
                        {row.risk_level}
                      </td>
                      <td style={{ color: '#475569' }}>{row.last_review || '-'}</td>
                      <td>
                        <span style={{ display: 'block', color: '#0f172a' }}>{row.next_review}</span>
                        <span style={{ fontSize: '11px', color: row.status === 'Non-Compliant' ? '#dc2626' : '#16a34a' }}>
                          {row.status === 'Non-Compliant' ? '(Overdue)' : `(${calculateDaysLeft(row.next_review)} days)`}
                        </span>
                      </td>
                      <td>
                        <img src={row.owner_img} alt="Owner" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                      </td>
                      <td style={{ cursor: 'pointer', color: '#94a3b8' }}>
                        <span style={{ marginRight: '8px' }}>👁️</span>
                        <span>✏️</span>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        No data available. Click '+ Add Compliance Review' to insert data directly into PostgreSQL.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              <div className="table-footer">
                <span>Showing 1 to {total} of {total} items</span>
                <div className="pagination">
                  <button className="page-btn active">1</button>
                  <select style={{ padding: '4px', borderRadius: '4px', border: '1px solid #e2e8f0', marginLeft: '10px' }}>
                    <option>10 / page</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="side-panels">
              <div className="panel">
                <h3>Compliance Score Trend</h3>
                <div className="trend-chart-placeholder">
                  - Compliance Score (%) -
                </div>
              </div>

              <div className="panel">
                <h3>Issue Breakdown</h3>
                <div className="donut-wrap">
                  <div className="donut" style={{ background: donutGradient }}></div>
                  <div className="legend">
                    <div className="legend-item">
                      <span><span className="legend-color" style={{ background: '#16a34a' }}></span> Compliant</span>
                      <span style={{ fontWeight: '500' }}>{compliant} ({getPct(compliant)}%)</span>
                    </div>
                    <div className="legend-item">
                      <span><span className="legend-color" style={{ background: '#d97706' }}></span> At Risk</span>
                      <span style={{ fontWeight: '500' }}>{atRisk} ({getPct(atRisk)}%)</span>
                    </div>
                    <div className="legend-item">
                      <span><span className="legend-color" style={{ background: '#dc2626' }}></span> Non-Compliant</span>
                      <span style={{ fontWeight: '500' }}>{nonCompliant} ({getPct(nonCompliant)}%)</span>
                    </div>
                    <div className="legend-item">
                      <span><span className="legend-color" style={{ background: '#9333ea' }}></span> Pending Review</span>
                      <span style={{ fontWeight: '500' }}>{pending} ({getPct(pending)}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3>📅 Upcoming Reviews</h3>
                {upcomingReviews.length > 0 ? upcomingReviews.map((review, i) => (
                  <div className="review-item" key={i}>
                    <div>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{review.item_name}</strong>
                      <span style={{ fontSize: '11px', color: '#4f46e5' }}>{review.contract_id}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', color: '#0f172a' }}>{review.next_review}</span>
                      <span style={{ fontSize: '11px', color: '#d97706', fontWeight: '500' }}>
                        {calculateDaysLeft(review.next_review)} days left
                      </span>
                    </div>
                  </div>
                )) : (
                  <p style={{ fontSize: '12px', color: '#64748b' }}>No upcoming reviews.</p>
                )}
                <a href="#" className="review-link">View All Reviews →</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Compliance Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Contract ID</label>
                <input type="text" required placeholder="e.g. CON-2026-001" value={formData.contract_id} onChange={e => setFormData({...formData, contract_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Item Name</label>
                <input type="text" required placeholder="e.g. Data Privacy Compliance" value={formData.item_name} onChange={e => setFormData({...formData, item_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Obligation</label>
                <input type="text" required placeholder="e.g. GDPR Requirements" value={formData.obligation} onChange={e => setFormData({...formData, obligation: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Compliant</option>
                  <option>At Risk</option>
                  <option>Non-Compliant</option>
                  <option>Pending Review</option>
                </select>
              </div>
              <div className="form-group">
                <label>Risk Level</label>
                <select value={formData.risk_level} onChange={e => setFormData({...formData, risk_level: e.target.value})}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Next Review Date</label>
                <input type="date" required value={formData.next_review} onChange={e => setFormData({...formData, next_review: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}