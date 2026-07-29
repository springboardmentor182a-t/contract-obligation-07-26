import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ToggleSwitch = ({ label, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ fontWeight: 500, color: '#f1f5f9' }}>{label}</div>
      <div 
        onClick={() => setChecked(!checked)}
        style={{
          width: '44px',
          height: '24px',
          backgroundColor: checked ? '#3b82f6' : '#475569',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          transition: 'left 0.2s'
        }} />
      </div>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLoadDemoData = async () => {
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/demo/load');
      alert("Demo data loaded successfully"); // Using simple alert as toast
      navigate('/dashboard');
    } catch (error) {
      console.error('Error loading demo data', error);
      alert('Failed to load demo data');
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#1e293b', // Dark slate card
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
    color: '#f8fafc',
    marginBottom: '24px'
  };

  const sectionTitleStyle = {
    marginTop: 0,
    borderBottom: '1px solid #334155',
    paddingBottom: '16px',
    marginBottom: '24px',
    color: '#e2e8f0',
    fontSize: '18px',
    fontWeight: '600'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#cbd5e1'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f8fafc',
    marginBottom: '20px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100%', padding: '24px', borderRadius: '12px' }}>
      <h1 style={{ margin: '0 0 32px 0', fontSize: '28px', color: '#f8fafc' }}>Settings</h1>
      
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Account Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" style={inputStyle} defaultValue="admin@contractiq.com" />
          </div>
          <div>
            <label style={labelStyle}>Company Name</label>
            <input type="text" style={inputStyle} defaultValue="Acme Corp" />
          </div>
          <div>
            <label style={labelStyle}>Time Zone</label>
            <select style={inputStyle}>
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Notification Preferences</h3>
          <ToggleSwitch label="Email Notifications" defaultChecked={true} />
          <ToggleSwitch label="Renewal Reminders" defaultChecked={true} />
          <ToggleSwitch label="Risk Alerts" defaultChecked={true} />
          <ToggleSwitch label="Weekly Digest" defaultChecked={false} />
          
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Reminder Lead Time</label>
            <select style={inputStyle}>
              <option>7 Days Before</option>
              <option>14 Days Before</option>
              <option>30 Days Before</option>
              <option>60 Days Before</option>
            </select>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>AI & Analysis Settings</h3>
          <ToggleSwitch label="Auto-Analysis" defaultChecked={true} />
          <ToggleSwitch label="Risk Scoring" defaultChecked={true} />
          <ToggleSwitch label="Intelligence Brief Generation" defaultChecked={true} />
          
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Analysis Detail Level</label>
            <select style={inputStyle}>
              <option>Standard (Balanced)</option>
              <option>Comprehensive (Deep Dive)</option>
              <option>Executive Summary</option>
            </select>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Integration Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <ToggleSwitch label="Google Drive Sync" defaultChecked={false} />
            <ToggleSwitch label="Calendar Integration" defaultChecked={true} />
          </div>
          <div>
            <ToggleSwitch label="Slack Notifications" defaultChecked={true} />
            <ToggleSwitch label="API Access" defaultChecked={false} />
          </div>
        </div>
      </div>
      
      <div style={{ ...cardStyle, border: '1px solid #3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
        <h3 style={{ ...sectionTitleStyle, borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>Demo Environment</h3>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Populate your workspace with realistic mock contracts and obligations to explore the platform's capabilities.</p>
        <button 
          onClick={handleLoadDemoData} 
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Loading...' : 'Load Demo Data'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
