import React from 'react';
import PageContainer from '../layout/PageContainer';

const Settings = () => {
  return (
    <PageContainer>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Account Settings</h2>
        <form className="auth-form">
          <div className="form-group">
            <label>Email Notifications</label>
            <div style={{ marginTop: '10px' }}>
              <input type="checkbox" id="alerts" defaultChecked />
              <label htmlFor="alerts" style={{ marginLeft: '10px', display: 'inline' }}>Receive daily contract alerts</label>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Timezone</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
              <option>UTC-08:00 Pacific Time</option>
              <option>UTC-05:00 Eastern Time</option>
              <option>UTC+00:00 GMT</option>
              <option>UTC+05:30 IST</option>
            </select>
          </div>
          <button type="button" className="submit-btn" style={{ marginTop: '20px' }}>Save Changes</button>
        </form>
      </div>
    </PageContainer>
  );
};

export default Settings;