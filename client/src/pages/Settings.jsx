import React from 'react';

const Settings = () => {
  return (
    <div>
      <h1 style={{ margin: '0 0 32px 0', fontSize: '28px', color: 'var(--primary-color)' }}>Settings</h1>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="stat-card" style={{ padding: '32px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="premium-input" defaultValue="Admin User" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="premium-input" defaultValue="admin@company.com" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input type="text" className="premium-input" defaultValue="Administrator" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select className="premium-input">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
              </select>
            </div>
          </div>
          <button className="premium-button" style={{ width: 'auto', marginTop: '16px' }}>Save Changes</button>
        </div>
        
        <div className="stat-card" style={{ padding: '32px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>Notification Preferences</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Email Alerts</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive daily summaries of contract statuses</div>
            </div>
            <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} defaultChecked />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Obligation Reminders</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Get notified 48 hours before an obligation is due</div>
            </div>
            <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
