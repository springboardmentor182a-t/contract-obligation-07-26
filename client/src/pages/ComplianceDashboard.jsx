import React from 'react';

const ComplianceDashboard = () => {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Compliance Dashboard</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Monitor company-wide compliance and regulatory health.</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="stat-card">
          <h3 style={{ marginTop: 0, color: 'var(--primary-color)' }}>Department Compliance</h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              <span>Legal</span><span>98%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
              <div style={{ width: '98%', height: '100%', backgroundColor: 'var(--success-color)', borderRadius: '4px' }}></div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              <span>Procurement</span><span>85%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--warning-color)', borderRadius: '4px' }}></div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              <span>HR</span><span>72%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
              <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--danger-color)', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
          <h3 style={{ marginTop: 0, color: 'white' }}>Overall Health Score</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
            <div style={{ fontSize: '72px', fontWeight: 700, color: 'var(--success-color)' }}>A-</div>
            <p style={{ margin: 0, opacity: 0.8 }}>System is currently compliant with SOC2 and GDPR.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
