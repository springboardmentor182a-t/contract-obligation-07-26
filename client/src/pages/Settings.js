import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import Navbar from '../layout/Navbar';
import { API_BASE_URL } from '../data/constants';
import { useTheme } from '../context/ThemeContext';

const COLOR_SWATCHES = ["#5f27cd", "#7C3AED", "#2563EB", "#16A34A", "#D97706", "#DC2626"];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        background: checked ? "#5f27cd" : "#e5e1f5",
        border: "none",
        position: "relative",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.15s ease",
        }}
      />
    </button>
  );
}

const fieldStyle = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 };
const labelStyle = { fontSize: 13, fontWeight: 600 };
const inputStyle = { border: "1px solid #e5e1f5", borderRadius: 10, padding: "10px 12px", fontSize: 14 };
const cardTitleStyle = { margin: "0 0 4px" };
const subtextStyle = { color: "#888", fontSize: 13, margin: "0 0 18px" };

const Settings = () => {
  const { settings: appearance, updateSetting } = useTheme();

  const [profile, setProfile] = useState({
    fullName: '', email: '', phone: '', department: '', jobTitle: '',
    timeZone: 'GMT+05:30 India Standard Time',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  const [security, setSecurity] = useState({
    twoFactor: true, sessionTimeout: '30 min', loginAlerts: true,
  });

  const activeSessions = [
    { device: 'Chrome on Windows', location: 'New York, USA', lastActive: 'Current session', current: true },
    { device: 'Safari on iPhone', location: 'New York, USA', lastActive: '2 hours ago', current: false },
    { device: 'Chrome on MacBook', location: 'Bangalore, India', lastActive: '1 day ago', current: false },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.id) {
      alert('No linked account found. Please log in with an account that exists in the users database.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/update/${storedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          name: profile.fullName,
          department: profile.department,
          role: storedUser.role || 'User',
          status: 'Active',
        }),
      });
      if (response.ok) {
        alert('Profile changes saved.');
      } else {
        alert('Failed to save profile changes.');
      }
    } catch (err) {
      alert('Network error — is the backend running?');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.id) {
      alert('No linked account found. Please log in with an account that exists in the users database.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/${storedUser.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }),
      });
      if (response.ok) {
        alert('Password updated successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.detail || 'Failed to update password.');
      }
    } catch (err) {
      alert('Network error — is the backend running?');
    }
  };

  return (
    <PageContainer>
      <Navbar />

      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>Settings</h2>
        <p>Manage your preferences and application configuration.</p>
      </div>

      {/* Profile Settings — full width */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h3 style={cardTitleStyle}>Profile Settings</h3>
            <p style={subtextStyle}>Update your personal information and profile details.</p>
          </div>
          <button
            type="submit"
            form="profile-form"
            style={{ padding: '10px 20px', background: '#5f27cd', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Save Changes
          </button>
        </div>

        <form id="profile-form" onSubmit={handleSaveProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#5f27cd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
              {(profile.fullName || 'U').charAt(0).toUpperCase()}
            </div>
            <button type="button" style={{ background: '#fff', border: '1px solid #e5e1f5', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Change Photo
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Department</label>
              <input style={inputStyle} value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Job Title</label>
              <input style={inputStyle} value={profile.jobTitle} onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Time Zone</label>
              <select style={inputStyle} value={profile.timeZone} onChange={(e) => setProfile({ ...profile, timeZone: e.target.value })}>
                <option>GMT+05:30 India Standard Time</option>
                <option>GMT+00:00 UTC</option>
                <option>GMT-05:00 Eastern Time</option>
                <option>GMT-08:00 Pacific Time</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Row: Change Password | Appearance */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h3 style={cardTitleStyle}>Change Password</h3>
          <p style={subtextStyle}>Update your password to keep your account secure.</p>
          <form onSubmit={handleUpdatePassword}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Current Password</label>
              <input style={inputStyle} type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>New Password</label>
              <input style={inputStyle} type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Confirm New Password</label>
              <input style={inputStyle} type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', background: '#5f27cd', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
              Update Password
            </button>
          </form>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h3 style={cardTitleStyle}>Appearance</h3>
          <p style={subtextStyle}>Customize how ContractIQ looks for you.</p>

          <div style={fieldStyle}>
            <label style={labelStyle}>Theme</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateSetting('theme', t)}
                  style={{
                    flex: 1, padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    border: appearance.theme === t ? '1px solid #5f27cd' : '1px solid #e5e1f5',
                    background: appearance.theme === t ? '#ede9fe' : '#fff',
                    color: appearance.theme === t ? '#5f27cd' : '#333',
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Primary Color</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateSetting('primaryColor', color)}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', background: color,
                    border: appearance.primaryColor === color ? '2px solid #1f1b2e' : '2px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row: Security Settings | Active Sessions */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h3 style={cardTitleStyle}>Security Settings</h3>
          <p style={subtextStyle}>Manage your security preferences.</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0eefa' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Two-Factor Authentication</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Add an extra layer of security</div>
            </div>
            <Toggle checked={security.twoFactor} onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0eefa' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Session Timeout</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Automatically log out after inactivity</div>
            </div>
            <select
              style={{ border: '1px solid #e5e1f5', borderRadius: 10, padding: '6px 10px', fontSize: 13 }}
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
            >
              <option>15 min</option>
              <option>30 min</option>
              <option>60 min</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Login Alerts</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Get notified about new logins</div>
            </div>
            <Toggle checked={security.loginAlerts} onChange={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })} />
          </div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h3 style={cardTitleStyle}>Active Sessions</h3>
          <p style={subtextStyle}>Manage your active sessions across devices.</p>
          {activeSessions.map((session, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < activeSessions.length - 1 ? '1px solid #f0eefa' : 'none' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {session.device}{' '}
                  {session.current && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 999, marginLeft: 6 }}>
                      Current Session
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{session.location} · {session.lastActive}</div>
              </div>
              {!session.current && (
                <button style={{ background: '#fff', border: '1px solid #e5e1f5', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Log out
                </button>
              )}
            </div>
          ))}
          <button style={{ marginTop: 12, background: '#fff', border: '1px solid #e5e1f5', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            View All Devices
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;