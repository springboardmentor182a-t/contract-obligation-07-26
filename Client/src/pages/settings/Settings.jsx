import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/Buttons/Button';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import { getUsers } from '../../features/authentication/services/getUsers';
import { changePassword } from '../../features/authentication/services/changePassword';
import { updateUser } from '../../features/authentication/services/updateUser';
import { getUserSettings, updateUserSettings } from '../../features/settings/services/userSettings';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { refreshProfile, updateGlobalTheme } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    officeLocation: ''
  });
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  const [userSettings, setUserSettings] = useState({
    email_alerts: true,
    push_notifications: false,
    contract_expiry: true,
    weekly_reports: false,
    theme: 'light',
    compact_mode: false,
    timezone: 'Asia/Kolkata'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notificationStatus, setNotificationStatus] = useState({ type: '', message: '' });
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const [appearanceStatus, setAppearanceStatus] = useState({ type: '', message: '' });
  const [loadingAppearance, setLoadingAppearance] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUserProfile(data);
        setProfileData({
          name: data.full_name || data.name || '',
          employeeId: data.employee_id || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          designation: data.designation || '',
          officeLocation: data.location || ''
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === 'account') {
      fetchProfile();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const data = await getUserSettings();
        if (data) {
          setUserSettings({
            email_alerts: data.email_alerts ?? true,
            push_notifications: data.push_notifications ?? false,
            contract_expiry: data.contract_expiry ?? true,
            weekly_reports: data.weekly_reports ?? false,
            theme: data.theme || 'light',
            compact_mode: data.compact_mode ?? false,
            timezone: data.timezone || 'Asia/Kolkata'
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettingsData();
  }, []);

  const handleToggle = (key) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSettingChange = (e, key) => {
    const val = e.target.value === 'on' ? true : e.target.value === 'off' ? false : e.target.value;
    setUserSettings(prev => ({
      ...prev,
      [key]: val
    }));
    
    // Instantly apply theme preview when changed in dropdown
    if (key === 'theme' && updateGlobalTheme) {
      updateGlobalTheme(val);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileStatus({ type: '', message: '' });
    try {
      await updateUser({
        ...userProfile,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        employee_id: profileData.employeeId,
        company_name: userProfile?.company_name || "",
        department: profileData.department,
        designation: profileData.designation,
        location: profileData.officeLocation
      });
      await updateUserSettings(userSettings);
      if (refreshProfile) {
        await refreshProfile();
      }
      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      
      try {
        const { createNotification } = await import('../../features/notifications/services/notificationAPI');
        await createNotification({ title: 'Profile Updated', message: 'Your profile information was updated.' });
        window.dispatchEvent(new Event('notification-created'));
      } catch (err) { console.error(err); }

    } catch (err) {
      setProfileStatus({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters long' });
      return;
    }
    
    setLoadingPassword(true);
    setPasswordStatus({ type: '', message: '' });
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      
      try {
        const { createNotification } = await import('../../features/notifications/services/notificationAPI');
        await createNotification({ title: 'Password & Security Alerts', message: 'Your password was successfully changed.' });
        window.dispatchEvent(new Event('notification-created'));
      } catch (err) { console.error('Failed to notify security alert:', err); }

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to update password' });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoadingNotifications(true);
    setNotificationStatus({ type: '', message: '' });
    try {
      await updateUserSettings(userSettings);
      setNotificationStatus({ type: 'success', message: 'Notification preferences saved!' });
      try {
        const { createNotification } = await import('../../features/notifications/services/notificationAPI');
        await createNotification({ title: 'Settings Updated', message: 'Your notification preferences have been saved.' });
        window.dispatchEvent(new Event('notification-created'));
      } catch (err) { console.error(err); }
    } catch (err) {
      setNotificationStatus({ type: 'error', message: err.message || 'Failed to save notifications' });
    } finally {
      setLoadingNotifications(false);
      setTimeout(() => setNotificationStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleSaveAppearance = async () => {
    setLoadingAppearance(true);
    setAppearanceStatus({ type: '', message: '' });
    try {
      await updateUserSettings(userSettings);
      setAppearanceStatus({ type: 'success', message: 'Appearance settings applied!' });
      
      try {
        const { createNotification } = await import('../../features/notifications/services/notificationAPI');
        await createNotification({ title: 'Settings Updated', message: 'Your appearance settings have been applied.' });
        window.dispatchEvent(new Event('notification-created'));
      } catch (err) { console.error(err); }

      if (updateGlobalTheme) {
        updateGlobalTheme(userSettings.theme);
      }
    } catch (err) {
      setAppearanceStatus({ type: 'error', message: err.message || 'Failed to save appearance' });
    } finally {
      setLoadingAppearance(false);
      setTimeout(() => setAppearanceStatus({ type: '', message: '' }), 3000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="settings-content-card">
            <div className="settings-section-header">
              <h2>Account Settings</h2>
              <p>Manage your personal information and preferences</p>
            </div>
            
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 className="spinner text-primary" size={32} />
              </div>
            ) : (
              <>
                <form className="settings-form-grid" onSubmit={handleProfileSave}>
                  <FormInput label="Full Name" name="name" type="text" value={profileData.name} onChange={handleProfileInputChange} />
                  <FormInput label="Employee ID" name="employeeId" type="text" value={profileData.employeeId} onChange={handleProfileInputChange} />
                  <FormInput label="Email Address" name="email" type="email" value={profileData.email} onChange={handleProfileInputChange} className="settings-form-group full-width" />
                  <FormInput label="Phone Number" name="phone" type="text" value={profileData.phone} onChange={handleProfileInputChange} />
                  <FormInput label="Role" name="role" type="text" value={userProfile?.role || "Admin"} readOnly disabled />
                  <FormInput label="Department" name="department" type="text" value={profileData.department} onChange={handleProfileInputChange} />
                  <FormInput label="Designation" name="designation" type="text" value={profileData.designation} onChange={handleProfileInputChange} />
                  <FormInput label="Location" name="officeLocation" type="text" value={profileData.officeLocation} onChange={handleProfileInputChange} />
                  
                  <FormSelect 
                    label="Timezone" 
                    options={[{value: 'UTC', label: 'UTC (GMT+0)'}, {value: 'EST', label: 'EST (GMT-5)'}, {value: 'Asia/Kolkata', label: 'IST (GMT+5:30)'}]} 
                    value={userSettings.timezone}
                    onChange={(e) => handleSettingChange(e, 'timezone')}
                    className="settings-form-group full-width"
                  />
                </form>
                
                <div className="settings-footer">
                  {profileStatus.message && (
                    <div style={{ marginRight: 'auto', color: profileStatus.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)', fontSize: '0.9rem' }}>
                      {profileStatus.message}
                    </div>
                  )}
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="button" variant="primary" onClick={handleProfileSave} disabled={loadingProfile} icon={Save}>
                    {loadingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      
      case 'notifications':
        return (
          <div className="settings-content-card">
            <div className="settings-section-header">
              <h2>Notification Preferences</h2>
              <p>Choose how you want to be notified about contract activities</p>
            </div>
            
            <div className="toggle-list">
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Email Alerts</h4>
                  <p>Receive email updates for important contract changes</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={userSettings.email_alerts} onChange={() => handleToggle('email_alerts')} />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Push Notifications</h4>
                  <p>Show desktop notifications when app is open</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={userSettings.push_notifications} onChange={() => handleToggle('push_notifications')} />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Contract Expiry Warnings</h4>
                  <p>Alert me 30, 60, and 90 days before expirations</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={userSettings.contract_expiry} onChange={() => handleToggle('contract_expiry')} />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Weekly Summary Reports</h4>
                  <p>Receive a weekly digest of portfolio performance</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={userSettings.weekly_reports} onChange={() => handleToggle('weekly_reports')} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            <div className="settings-footer">
              {notificationStatus.message && (
                <div style={{ marginRight: 'auto', color: notificationStatus.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)', fontSize: '0.9rem', alignSelf: 'center' }}>
                  {notificationStatus.message}
                </div>
              )}
              <Button variant="primary" icon={Save} onClick={handleSaveNotifications} disabled={loadingNotifications}>
                {loadingNotifications ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="settings-content-card">
            <div className="settings-section-header">
              <h2>Security</h2>
              <p>Manage your password and security settings</p>
            </div>
            
            {passwordStatus.message && (
              <div style={{ backgroundColor: passwordStatus.type === 'error' ? '#fee2e2' : '#dcfce7', color: passwordStatus.type === 'error' ? '#b91c1c' : '#166534', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem', border: `1px solid ${passwordStatus.type === 'error' ? '#f87171' : '#86efac'}` }}>
                {passwordStatus.message}
              </div>
            )}
            
            <form className="settings-form-grid" onSubmit={handlePasswordChange}>
              <div style={{ position: 'relative' }}>
                <FormInput 
                  label="Current Password" 
                  type={showCurrentPassword ? 'text' : 'password'} 
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="settings-form-group full-width" 
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', bottom: '0.75rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                  }}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <FormInput 
                  label="New Password" 
                  type={showNewPassword ? 'text' : 'password'} 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', bottom: '0.75rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                  }}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <FormInput 
                  label="Confirm New Password" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', bottom: '0.75rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </form>
            
            <div className="settings-footer">
              <Button variant="primary" icon={Save} onClick={handlePasswordChange} disabled={loadingPassword}>
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-content-card">
            <div className="settings-section-header">
              <h2>Appearance</h2>
              <p>Customize the look and feel of the application</p>
            </div>
            
            <div className="settings-form-grid">
              <FormSelect 
                label="Theme Mode" 
                options={[
                  {value: 'light', label: 'Light Mode'}, 
                  {value: 'dark', label: 'Dark Mode'}, 
                  {value: 'system', label: 'System Default'}
                ]} 
                value={userSettings.theme}
                onChange={(e) => handleSettingChange(e, 'theme')}
                className="settings-form-group full-width"
              />
              <FormSelect 
                label="Compact Mode" 
                options={[
                  {value: 'off', label: 'Off (Spacious)'}, 
                  {value: 'on', label: 'On (Compact Tables & Lists)'}
                ]} 
                value={userSettings.compact_mode ? 'on' : 'off'}
                onChange={(e) => handleSettingChange(e, 'compact_mode')}
                className="settings-form-group full-width"
              />
            </div>
            
            <div className="settings-footer">
              {appearanceStatus.message && (
                <div style={{ marginRight: 'auto', color: appearanceStatus.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)', fontSize: '0.9rem', alignSelf: 'center' }}>
                  {appearanceStatus.message}
                </div>
              )}
              <Button variant="primary" icon={Save} onClick={handleSaveAppearance} disabled={loadingAppearance}>
                {loadingAppearance ? 'Applying...' : 'Apply Changes'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-dashboard fade-in">
      <div className="settings-header-section">
        <div className="settings-header-content">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="settings-main-area">
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`settings-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <User size={18} /> Account Profile
            </button>
            <button 
              className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={18} /> Notifications
            </button>
            <button 
              className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} /> Security
            </button>
            <button 
              className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={18} /> Appearance
            </button>
          </nav>
        </aside>
        
        <main className="settings-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;
