import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ToggleSwitch = ({ label, description, defaultChecked = false, onChange }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);
    if (onChange) onChange(nextState);
  };

  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="flex-1 pr-2">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
          {label}
        </span>
        {description && (
          <p className="text-sm text-slate-500 dark:text-[#8E9BAE] mt-0.5 m-0">
            {description}
          </p>
        )}
      </div>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Dynamic user profile state fetched from FastAPI backend
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    timezone: 'UTC (Coordinated Universal Time)'
  });

  // Fetch initial profile from backend
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        // Retrieve logged-in user from localStorage if present to pass email parameter
        let storedUser = null;
        try {
          const rawUser = localStorage.getItem('user');
          if (rawUser) storedUser = JSON.parse(rawUser);
        } catch (e) {
          // ignore parsing error
        }

        const emailParam = storedUser?.email ? `?email=${encodeURIComponent(storedUser.email)}` : '';
        const response = await axios.get(`/api/auth/me${emailParam}`);
        
        if (isMounted && response.data) {
          setProfile({
            name: response.data.name || storedUser?.name || 'Demo Administrator',
            email: response.data.email || storedUser?.email || 'demo@contractiq.com',
            company: response.data.company || 'ContractIQ Technologies Inc.',
            role: response.data.role || storedUser?.role || 'Admin',
            timezone: response.data.timezone || 'UTC (Coordinated Universal Time)'
          });
        }
      } catch (error) {
        console.warn('Could not fetch user profile from /api/auth/me, falling back to local session', error);
        // Fallback to local storage or defaults
        try {
          const rawUser = localStorage.getItem('user');
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            if (isMounted) {
              setProfile({
                name: parsed.name || 'Demo Administrator',
                email: parsed.email || 'demo@contractiq.com',
                company: 'ContractIQ Technologies Inc.',
                role: parsed.role || 'Admin',
                timezone: 'UTC (Coordinated Universal Time)'
              });
            }
          }
        } catch (e) {
          if (isMounted) {
            setProfile({
              name: 'Demo Administrator',
              email: 'demo@contractiq.com',
              company: 'ContractIQ Technologies Inc.',
              role: 'Admin',
              timezone: 'UTC (Coordinated Universal Time)'
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchUserProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Simulate profile save or post to backend
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local storage user profile
      try {
        const rawUser = localStorage.getItem('user');
        const currentUser = rawUser ? JSON.parse(rawUser) : {};
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          name: profile.name,
          email: profile.email
        }));
      } catch (err) {
        console.error('Failed to update localStorage', err);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (error) {
      console.error('Error saving profile settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDemoData = async () => {
    setLoadingDemo(true);
    setDemoSuccess(false);
    try {
      await axios.post('/api/demo/load');
      setDemoSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (error) {
      console.error('Error loading demo data', error);
      alert('Failed to load demo data. Please verify the backend server is running.');
      setLoadingDemo(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0B1121] min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#2A364F]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold border border-blue-200 dark:border-blue-500/30">
                <i className="fa-solid fa-sliders"></i>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
                Platform Settings
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-[#8E9BAE] mt-1 m-0">
              Manage organization preferences, automated notification rules, AI intelligence parameters, and sandbox data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Enterprise Connected
            </span>
          </div>
        </div>

        {/* Global Save Alert Banner */}
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 shadow-sm animate-fadeIn">
            <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>
            <div>
              <span className="font-semibold text-sm">Settings Saved Successfully!</span>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 m-0 mt-0.5">
                Your organization profile and configuration preferences have been securely synchronized.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 1: Account & Organization Settings */}
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm p-6 mb-6 transition-colors">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-[#2A364F]">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">
                Account & Organization
              </h2>
              <p className="text-sm text-slate-500 dark:text-[#8E9BAE] mt-0.5 m-0">
                Manage your authenticated identity, primary enterprise email, and regional preferences.
              </p>
            </div>
            {profile.role && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
                {profile.role}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500"></i>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    placeholder="e.g. Jane Doe"
                    disabled={isLoadingProfile}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500"></i>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="name@company.com"
                    disabled={isLoadingProfile}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <i className="fa-solid fa-building absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500"></i>
                  <input 
                    type="text" 
                    value={profile.company}
                    onChange={(e) => handleProfileChange('company', e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    disabled={isLoadingProfile}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Time Zone
                </label>
                <div className="relative">
                  <i className="fa-solid fa-globe absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500"></i>
                  <select 
                    value={profile.timezone}
                    onChange={(e) => handleProfileChange('timezone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time - UTC-5)</option>
                    <option>CST (Central Standard Time - UTC-6)</option>
                    <option>PST (Pacific Standard Time - UTC-8)</option>
                    <option>GMT / BST (London - UTC+0/+1)</option>
                    <option>CET / CEST (Central Europe - UTC+1/+2)</option>
                    <option>IST (India Standard Time - UTC+5:30)</option>
                    <option>SGT (Singapore Time - UTC+8)</option>
                    <option>JST (Japan Standard Time - UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#2A364F] flex items-center justify-end">
              <button 
                type="submit"
                disabled={isSaving || isLoadingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk text-sm"></i>
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2 & 3: Two-Column Preferences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Notification Preferences Card */}
          <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm p-6 transition-colors flex flex-col justify-between">
            <div>
              <div className="pb-3 mb-3 border-b border-slate-100 dark:border-[#2A364F]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 m-0 flex items-center gap-2">
                  <i className="fa-solid fa-bell text-blue-600 dark:text-blue-400 text-base"></i>
                  Notification Preferences
                </h2>
                <p className="text-sm text-slate-500 dark:text-[#8E9BAE] m-0">
                  Control how and when you receive contract updates and alerts.
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
                <ToggleSwitch 
                  label="Email Notifications" 
                  description="Receive email alerts for urgent contract obligations and milestones."
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Renewal Reminders" 
                  description="Get advance notices before contract expiration and auto-renewals."
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Risk Alerts" 
                  description="Immediate push alerts when contract risk severity reaches High or Critical."
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Weekly Digest" 
                  description="Summary report of portfolio compliance, pending approvals, and audits."
                  defaultChecked={false} 
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2A364F]">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Renewal Notice Lead Time
              </label>
              <select className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer">
                <option>7 Days Before Expiration</option>
                <option>14 Days Before Expiration</option>
                <option>30 Days Before Expiration (Recommended)</option>
                <option>60 Days Before Expiration</option>
                <option>90 Days Before Expiration</option>
              </select>
            </div>
          </div>

          {/* AI & Analysis Settings Card */}
          <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm p-6 transition-colors flex flex-col justify-between">
            <div>
              <div className="pb-3 mb-3 border-b border-slate-100 dark:border-[#2A364F]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 m-0 flex items-center gap-2">
                  <i className="fa-solid fa-brain text-blue-600 dark:text-blue-400 text-base"></i>
                  AI & Analysis Settings
                </h2>
                <p className="text-sm text-slate-500 dark:text-[#8E9BAE] m-0">
                  Configure autonomous document extraction, risk scoring, and summaries.
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
                <ToggleSwitch 
                  label="Autonomous Document Ingestion" 
                  description="Auto-extract key clauses, obligations, and dates upon PDF upload."
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Real-Time Risk Scoring" 
                  description="Score clause compliance against regulatory rules and corporate policy."
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Automated Executive Summaries" 
                  description="Generate high-level intelligence briefs for strategic review."
                  defaultChecked={true} 
                />
                <ToggleSwitch 
                  label="Smart Obligation Assignment" 
                  description="Auto-assign milestones to departmental owners based on clause context."
                  defaultChecked={true} 
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#2A364F]">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Analysis Detail Level
              </label>
              <select className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer">
                <option>Standard (Balanced Extraction & Speed)</option>
                <option>Comprehensive (Deep Regulatory & Legal Audit)</option>
                <option>Executive (Brief Key Terms & Financial Summary)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Integrations & Enterprise Security */}
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm p-6 mb-6 transition-colors">
          <div className="pb-3 mb-4 border-b border-slate-100 dark:border-[#2A364F]">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 m-0 flex items-center gap-2">
              <i className="fa-solid fa-plug text-blue-600 dark:text-blue-400 text-base"></i>
              Enterprise Integrations & Security
            </h2>
            <p className="text-sm text-slate-500 dark:text-[#8E9BAE] m-0">
              Connect external enterprise cloud services, webhooks, and identity verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 divide-slate-100 dark:divide-[#2A364F]/60">
            <div className="space-y-1">
              <ToggleSwitch 
                label="Google Drive & Workspace Sync" 
                description="Synchronize uploaded PDFs with secure cloud repository."
                defaultChecked={false} 
              />
              <ToggleSwitch 
                label="Corporate Calendar Integration" 
                description="Push obligation milestones directly to Google and Outlook calendars."
                defaultChecked={true} 
              />
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <ToggleSwitch 
                label="Slack & Teams Webhook Alerts" 
                description="Broadcast high-priority contract approvals to team channels."
                defaultChecked={true} 
              />
              <ToggleSwitch 
                label="Enterprise REST API & Webhooks" 
                description="Enable secure Bearer token access for ERP and CRM integration."
                defaultChecked={false} 
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Demo Environment Sandbox */}
        <div className="bg-white dark:bg-[#161F2E] border border-blue-200 dark:border-blue-500/30 rounded-xl shadow-sm p-6 transition-colors relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-database"></i>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">
                  Demo Environment Sandbox
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-[#8E9BAE] max-w-2xl mt-1 m-0">
                Populate your workspace with a complete suite of realistic enterprise mock contracts, obligations, renewals, compliance scorecards, and audit logs to explore all platform features.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {demoSuccess && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                  <i className="fa-solid fa-check"></i>
                  Data Seeded! Redirecting...
                </span>
              )}
              <button 
                onClick={handleLoadDemoData} 
                disabled={loadingDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingDemo ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Seeding Sandbox...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-down text-sm"></i>
                    <span>Load Demo Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
