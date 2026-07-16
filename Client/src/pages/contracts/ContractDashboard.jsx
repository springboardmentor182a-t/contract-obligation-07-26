import React, { useState } from 'react';
import './Contracts.css'; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ContractDetails = ({ contract, onBack, onEditClick }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Contract Report", 14, 20);

    autoTable(doc, {
        startY: 30,
        head: [["Field", "Value"]],
        body: [
            ["ID", contract.id || ''],
            ["Title", contract.title || ''],
            ["Vendor", contract.vendor || ''],
            ["Type", contract.type || ''],
            ["Value", contract.value || ''],
            ["Start Date", contract.startDate || ''],
            ["End Date", contract.end_date || ''],
            ["Owner", contract.owner || ''],
            ["Status", contract.status || ''],
            ["Compliance Total", `${contract.compliance || 0}%`]
        ]
    });

    doc.save(`Contract_${contract.id || 'Details'}.pdf`);
  };

  if (!contract) return <div className="loading-state">Loading contract info...</div>;

  return (
    <div className="details-container">
      {/* Breadcrumb Navigation Line */}
      <div className="breadcrumb-nav">
        <span className="breadcrumb-link" onClick={onBack}>Contracts</span> 
        <span className="breadcrumb-separator">›</span> 
        <span className="breadcrumb-current">{contract.id}</span>
      </div>

      {/* Main Top Header Metric Section */}
      <div className="details-card-header">
        <div className="left-meta-info">
          <div className="status-badge-row">
            <span className={`status-badge-pill ${contract.status ? contract.status.toLowerCase().replace(' ', '-') : ''}`}>
              {contract.status || 'Unknown'}
            </span>
            <span className="mono-id-tag">{contract.id}</span>
          </div>
          <h1 className="contract-display-title">{contract.title || 'Untitled'}</h1>
          <p className="vendor-type-subtext">{contract.vendor} • {contract.type}</p>
        </div>

        <div className="right-action-metric">
          <div className="action-top-row">
            <button className="btn-download" onClick={handleDownload}>
              📄 Export Report
            </button>
          </div>
          <div className="value-metric-block">
            <div className="metric-val">{contract.value || '$0.00'}</div>
            <div className="metric-label">Total Contract Value</div>
          </div>
        </div>
      </div>

      {/* Quick Dates & Owner Metadata Stripe */}
      <div className="metadata-grid-stripe">
        <div className="meta-block">
          <span className="meta-label">Start Date</span>
          <span className="meta-value">{contract.startDate || 'N/A'}</span>
        </div>
        <div className="meta-block">
          <span className="meta-label">End Date</span>
          <span className="meta-value">{contract.end_date || 'N/A'}</span>
        </div>
        <div className="meta-block">
          <span className="meta-label">Owner</span>
          <span className="meta-value">{contract.owner || 'N/A'}</span>
        </div>
        <div className="meta-block">
          <span className="meta-label">Global Compliance</span>
          <span className="meta-value">{contract.compliance ? `${contract.compliance}%` : '0%'}</span>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="tabs-navigation-menu">
        {['Overview', 'Obligations', 'Documents', 'History'].map((tab) => (
          <button
            key={tab}
            className={`tab-menu-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content Panel Layout */}
      <div className="details-content-split">
        <div className="left-split-panel">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <>
              <div className="info-content-card">
                <h3 className="card-box-title">Contract Summary</h3>
                <p className="card-box-paragraph">
                  {contract.summary || "No executive summary provided in database records."}
                </p>
              </div>

              <div className="info-content-card">
                <h3 className="card-box-title">Key Legal Terms</h3>
                <table className="terms-stripped-table">
                  <tbody>
                    <tr>
                      <td className="term-property">Auto-renewal</td>
                      <td className="term-response-val">{contract.auto_renewal || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="term-property">Payment Terms</td>
                      <td className="term-response-val">{contract.payment_terms || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="term-property">Governing Law</td>
                      <td className="term-response-val">{contract.governing_law || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="term-property">Liability Cap</td>
                      <td className="term-response-val">{contract.liability_cap || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* OBLIGATIONS TAB */}
          {activeTab === 'Obligations' && (
            <div className="info-content-card">
              <h3 className="card-box-title">Active Database Obligations</h3>
              {contract.obligations && contract.obligations.length > 0 ? (
                <ul className="dynamic-data-list">
                  {contract.obligations.map((item, index) => (
                    <li key={index} className="dynamic-list-item">🔹 {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="card-box-paragraph">No tracked delivery obligations associated with this record.</p>
              )}
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'Documents' && (
            <div className="info-content-card">
              <h3 className="card-box-title">Associated File Vault</h3>
              {contract.documents && contract.documents.length > 0 ? (
                <div className="document-vault-grid">
                  {contract.documents.map((doc, index) => (
                    <div key={index} className="document-item-row">
                      <span>📁 <strong>{doc.name}</strong></span>
                      <span className="subtext-date">Uploaded: {doc.uploadedAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="card-box-paragraph">No external files attached to this contract block.</p>
              )}
            </div>
          )}

          {/* HISTORY AUDIT TAB */}
          {activeTab === 'History' && (
            <div className="info-content-card">
              <h3 className="card-box-title">System Audit Log History</h3>
              {contract.history && contract.history.length > 0 ? (
                <table className="terms-stripped-table">
                  <thead>
                    <tr>
                      <th>Action Event</th>
                      <th>Performed By</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.history.map((log, index) => (
                      <tr key={index}>
                        <td><strong>{log.action}</strong></td>
                        <td>{log.user}</td>
                        <td>{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="card-box-paragraph">No background structural logs trackable.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Circular Compliance Panel Section */}
        <div className="right-split-panel">
          <div className="info-content-card compliance-widget">
            <h3 className="card-box-title">Compliance Metrics</h3>
            
            <div className="circular-progress-box">
              <svg className="progress-svg-dims" viewBox="0 0 100 100">
                <circle className="circle-bg-track" cx="50" cy="50" r="40" />
                <circle 
                  className="circle-active-fill" 
                  cx="50" cy="50" r="40" 
                  style={{ 
                    strokeDasharray: `${2 * Math.PI * 40}`, 
                    strokeDashoffset: `${2 * Math.PI * 40 * (1 - (parseInt(contract.compliance) || 0) / 100)}` 
                  }}
                />
              </svg>
              <div className="absolute-percentage-center">{contract.compliance || 0}%</div>
            </div>

            <div className="compliance-sub-metrics">
              <div className="sub-strip-item">
                <div className="sub-strip-meta"><span>Documentation</span><span>{contract.compliance_doc || 0}%</span></div>
                <div className="sub-progress-bg"><div className="sub-progress-fill" style={{ width: `${contract.compliance_doc || 0}%` }} /></div>
              </div>
              <div className="sub-strip-item">
                <div className="sub-strip-meta"><span>Obligations</span><span>{contract.compliance_obl || 0}%</span></div>
                <div className="sub-progress-bg"><div className="sub-progress-fill" style={{ width: `${contract.compliance_obl || 0}%` }} /></div>
              </div>
              <div className="sub-strip-item">
                <div className="sub-strip-meta"><span>Renewals Tracking</span><span>{contract.compliance_ren || 0}%</span></div>
                <div className="sub-progress-bg"><div className="sub-progress-fill" style={{ width: `${contract.compliance_ren || 0}%` }} /></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;