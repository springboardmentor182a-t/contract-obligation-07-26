import React, { useState, useEffect } from "react";
import "./Settings.css";
import { useUI } from "../context/UIContext";
import {
  PlugIcon, BuildingIcon, BellSmIcon, EditIcon, FileIcon, CheckIcon, DownloadIcon, BriefcaseIcon,
  GearIcon, LockIcon, CreditCardIcon, UsersIcon, MoonIcon, SunIcon, PlusIcon, KeyIcon
} from "../components/Icons";
import { API_BASE } from "../config/api";
import { getAuthHeaders } from "../utils/auth";
// Static integrations config (UI-only — list of available integration providers)
const INTEGRATIONS_LIST = [
  { key: "salesforce", name: "Salesforce CRM", desc: "Sync contract records", color: "#3B82F6" },
  { key: "slack", name: "Slack Link", desc: "Push channel alerts", color: "#8B5CF6" },
  { key: "docusign", name: "DocuSign Connect", desc: "Manage e-signatures", color: "#10B981" },
  { key: "sharepoint", name: "SharePoint Repo", desc: "Document repository sync", color: "#F59E0B" },
];

const TABS = [
  { key: "general", label: "General", Icon: GearIcon },
  { key: "notifications", label: "Notifications", Icon: BellSmIcon },
  { key: "security", label: "Security & API", Icon: LockIcon },
  { key: "integrations", label: "Integrations", Icon: PlugIcon },
  { key: "people", label: "People / Invite", Icon: UsersIcon },
  { key: "billing", label: "Billing", Icon: CreditCardIcon },
  { key: "darkmode", label: "Dark Mode", Icon: MoonIcon },
];

const INTEGRATION_ICONS = {
  salesforce: BuildingIcon,
  slack: BellSmIcon,
  docusign: EditIcon,
  sharepoint: FileIcon,
};

export default function Settings() {
  const { theme, toggleTheme, showToast } = useUI();
  const [tab, setTab] = useState("general");
  
  // General State
  const [orgName, setOrgName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  
  // Notifications State
  const [toggles, setToggles] = useState({
    emailNotif: true,
    smsNotif: false,
    slackNotif: false,
    renewalAlerts: true,
    twoFactor: true,
    sso: false,
  });

  // Security State
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // Invoices State
  const [invoices, setInvoices] = useState([]);

  // Integrations State
  const [integrations, setIntegrations] = useState({
    salesforce: true,
    slack: false,
    docusign: true,
    sharepoint: false
  });
  const [connectingKey, setConnectingKey] = useState(null);

  // People State
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Viewer", department: "", message: "" });

  // Page level messaging
  const [saved, setSaved] = useState(false);
  const [billingMsg, setBillingMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resSettings, resInvites, resApiKeys, resInvoices] = await Promise.all([
          fetch(`${API_BASE}/settings`, { headers }),
          fetch(`${API_BASE}/users/invitations`, { headers }),
          fetch(`${API_BASE}/settings/security/apikeys`, { headers }),
          fetch(`${API_BASE}/billing/invoices`, { headers })
        ]);
        if (resSettings.ok) {
          const data = await resSettings.json();
          setOrgName(data.org_name || "");
          setCurrency(data.currency || "USD");
          setDateFormat(data.date_format || "YYYY-MM-DD");
          setToggles({
            emailNotif: data.email_notif,
            smsNotif: data.sms_notif || false,
            slackNotif: data.slack_notif,
            renewalAlerts: data.renewal_alerts,
            twoFactor: data.two_factor,
            sso: data.sso,
          });
        }
        if (resInvites.ok) {
          const invites = await resInvites.json();
          setInvitedUsers(invites);
        }
        if (resApiKeys.ok) {
          const keys = await resApiKeys.json();
          setApiKeys(keys);
        }
        if (resInvoices.ok) {
          const inv = await resInvoices.json();
          setInvoices(inv);
        }
      } catch (err) {
        console.warn('Settings API unavailable:', err);
      }
    }
    loadData();
  }, []);

  /* ── Save Settings ── */
  async function handleSaveSettings() {
    setSaved(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const payload = {
      org_name: orgName,
      currency,
      date_format: dateFormat,
      email_notif: toggles.emailNotif,
      sms_notif: toggles.smsNotif,
      slack_notif: toggles.slackNotif,
      renewal_alerts: toggles.renewalAlerts,
      two_factor: toggles.twoFactor,
      sso: toggles.sso,
    };

    try {
      await fetch(`${API_BASE}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      showToast("General Settings updated!");
    } catch (err) {
      console.warn("Could not sync configurations with server, saved locally", err);
    }
    setTimeout(() => setSaved(false), 2000);
  }


  function handleToggle(key) {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
  }

  /* ── Twilio & SendGrid Notification Gateways Hook ── */
  async function handleSaveNotifications() {
    setSaved(true);
    const payload = {
      emailNotif: toggles.emailNotif,
      smsNotif: toggles.smsNotif,
      renewalAlerts: toggles.renewalAlerts,
    };

    /* 
      TODO: Connect API Endpoint here
      Method: POST
      Route: /api/settings/notifications/gateways
      Payload: { emailNotif: bool, smsNotif: bool, renewalAlerts: bool }
      Description: Connects transactional emailers (e.g. SendGrid APIs) and SMS gateways (e.g. Twilio REST APIs)
      Database mapping: Updates settings database flags and triggers dispatcher service to reload settings.
    */
    try {
      await fetch(`${API_BASE}/settings/notifications/gateways`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      showToast("Notification gateways configured!");
    } catch (err) {
      console.warn("Notifications synced locally, gateways offline", err);
    }
    setTimeout(() => setSaved(false), 2000);
  }

  /* ── Security: Password change hook ── */
  async function handleUpdatePassword(e) {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showToast("New passwords do not match!");
      return;
    }
    setSaved(true);
    const payload = {
      current: passwords.current,
      new: passwords.newPass
    };

    /* 
      TODO: Connect API Endpoint here
      Method: POST
      Route: /api/profile/security/password
      Payload: { current: str, new: str }
      Database mapping: Updates "users" password_hash field where id = 1
    */
    try {
      const response = await fetch(`${API_BASE}/profile/security/password`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Password update is unavailable.");
      }
      showToast("Password updated successfully!");
    } catch (err) {
      console.warn("Could not update password through the backend.");
      showToast("Password was not changed. Please try again later.");
    }
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSaved(false), 2000);
  }

  /* ── Security: API Key Generation Hook ── */
  async function handleGenerateApiKey(e) {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const payload = { name: newKeyName };

    /* 
      TODO: Connect API Endpoint here
      Method: POST
      Route: /api/settings/security/apikeys
      Payload: { name: str }
      Database mapping: INSERTS into "api_keys" table containing: id, name, key_hash, created_at, user_id
    */
    try {
      const res = await fetch(`${API_BASE}/settings/security/apikeys`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const keyData = await res.json();
        setApiKeys(prev => [...prev, keyData]);
      } else {
        throw new Error("API key generation failed.");
      }
      showToast(`API Key "${newKeyName}" generated!`);
    } catch {
      showToast("API key was not generated. Please try again.");
    }
    setNewKeyName("");
  }

  /* ── Integrations Hook ── */
  async function connectIntegration(key) {
    setConnectingKey(key);
    /* 
      TODO: Connect API Endpoint here
      Method: POST
      Route: /api/settings/integrations/connect
      Payload: { provider: str }
      Database mapping: Sets status = 'connected' for the provider in user integrations
    */
    setTimeout(() => {
      setIntegrations((it) => ({ ...it, [key]: true }));
      setConnectingKey(null);
      showToast(`Connected ${key} service`);
    }, 1000);
  }

  /* ── User Invitations Hook ── */
  async function handleSendInvitation(e) {
    e.preventDefault();
    if (!inviteForm.email.trim()) return;

    setSaved(true);
    const payload = {
      email: inviteForm.email,
      role: inviteForm.role,
      department: inviteForm.department,
      message: inviteForm.message
    };

    /* 
      TODO: Connect API Endpoint here
      Method: POST
      Route: /api/users/invite
      Payload: { email: str, role: str, department: str, message: str }
      Database mapping: INSERTS into "user_invitations" table.
    */
    try {
      const res = await fetch(`${API_BASE}/users/invite`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newInvite = await res.json();
        setInvitedUsers(prev => [newInvite, ...prev]);
      } else {
        throw new Error("Invitation could not be created.");
      }
      showToast(`Invitation sent to ${inviteForm.email}`);
    } catch (err) {
      showToast("Invitation was not created. Please try again.");
    }

    setInviteForm({ email: "", role: "Viewer", department: "", message: "" });
    setTimeout(() => setSaved(false), 2000);
  }

  function flashBilling(msg) {
    setBillingMsg(msg);
    setTimeout(() => setBillingMsg(""), 2200);
  }

  return (
    <div className="page-surface settings-page fade-in-el">
      <div className="settings-header-top">
        <h2>Settings</h2>
        <p className="muted">Configure global application preferences, security criteria, integrations, and user invitations.</p>
      </div>

      {/* Tabs Header */}
      <div className="settings-tabs-row">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`settings-tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <t.Icon size={13} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-panel-redesigned">
        
        {/* ── GENERAL SETTINGS ── */}
        {tab === "general" && (
          <div className="fade-in-el">
            <div className="modern-input-wrap">
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Organization Name</label>
              <input
                type="text"
                className="modern-input"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="modern-input-wrap">
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Default Currency</label>
                <select 
                  className="modern-input" 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="modern-input-wrap">
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Date Format</label>
                <select 
                  className="modern-input" 
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </div>
            </div>
            <div className="settings-panel-footer">
              {saved && <span className="settings-saved-flash">Changes Saved!</span>}
              <button className="btn btn-primary" onClick={handleSaveSettings}>Save Configuration</button>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TABS ── */}
        {tab === "notifications" && (
          <div className="fade-in-el">
            <div className="pill-toggle-container">
              <div>
                <strong>Email Notifications</strong>
                <span className="muted" style={{ display: "block", fontSize: 11.5 }}>Receive critical compliance reports via email (SendGrid).</span>
              </div>
              <button className={`toggle ${toggles.emailNotif ? "on" : ""}`} onClick={() => handleToggle("emailNotif")} />
            </div>

            <div className="pill-toggle-container">
              <div>
                <strong>SMS Alerts</strong>
                <span className="muted" style={{ display: "block", fontSize: 11.5 }}>Receive real-time expiration notifications via Twilio gateway.</span>
              </div>
              <button className={`toggle ${toggles.smsNotif ? "on" : ""}`} onClick={() => handleToggle("smsNotif")} />
            </div>
            
            <div className="pill-toggle-container">
              <div>
                <strong>Slack Channel Alerts</strong>
                <span className="muted" style={{ display: "block", fontSize: 11.5 }}>Push system logs and signature updates to Slack Webhooks.</span>
              </div>
              <button className={`toggle ${toggles.slackNotif ? "on" : ""}`} onClick={() => handleToggle("slackNotif")} />
            </div>

            <div className="pill-toggle-container">
              <div>
                <strong>Contract Expiry Warnings</strong>
                <span className="muted" style={{ display: "block", fontSize: 11.5 }}>Trigger automated alerts 30/60/90 days before expiration.</span>
              </div>
              <button className={`toggle ${toggles.renewalAlerts ? "on" : ""}`} onClick={() => handleToggle("renewalAlerts")} />
            </div>
            <div className="settings-panel-footer">
              {saved && <span className="settings-saved-flash">Gateways Configured!</span>}
              <button className="btn btn-primary" onClick={handleSaveNotifications}>Apply Gateway Settings</button>
            </div>
          </div>
        )}

        {/* ── SECURITY & API KEYS ── */}
        {tab === "security" && (
          <div className="fade-in-el">
            <div className="section-title"><LockIcon size={14} /> Password Management</div>
            <form onSubmit={handleUpdatePassword}>
              <div className="field-row">
                <div className="modern-input-wrap">
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Current Password</label>
                  <input
                    type="password"
                    className="modern-input"
                    value={passwords.current}
                    onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="modern-input-wrap">
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>New Password</label>
                  <input
                    type="password"
                    className="modern-input"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>
              <div className="modern-input-wrap">
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Confirm New Password</label>
                <input
                  type="password"
                  className="modern-input"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-ghost" style={{ marginBottom: 20 }}>Change Password</button>
            </form>

            <div className="sb-divider" style={{ margin: "14px 0", background: "var(--border)" }} />

            <div className="section-title" style={{ marginTop: 14 }}><KeyIcon size={14} /> API Key Management</div>
            <p className="muted" style={{ marginBottom: 12 }}>Create secure, hashed API credentials for custom system integrations.</p>
            
            <form onSubmit={handleGenerateApiKey} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input
                type="text"
                className="modern-input"
                style={{ flex: 1 }}
                placeholder="Key Description (e.g. OCR Service)"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <PlusIcon size={14} /> Generate
              </button>
            </form>

            <table className="data-table" style={{ width: "100%", fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Key Signature</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(k => (
                  <tr key={k.id}>
                    <td><strong>{k.name}</strong></td>
                    <td style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>{k.key}</td>
                    <td>{k.created}</td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        type="button" 
                        className="btn-ghost" 
                        style={{ padding: "4px 8px", fontSize: 11, color: "var(--danger)" }}
                        onClick={() => {
                          setApiKeys(prev => prev.filter(item => item.id !== k.id));
                          showToast(`Revoked key ${k.name}`);
                        }}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {tab === "integrations" && (
          <div className="fade-in-el">
            <div className="section-title"><PlugIcon size={14} /> Linked Integrations</div>
            <div className="integrations-list">
              {INTEGRATIONS_LIST.map((it) => {
                const connected = integrations[it.key];
                const isConnecting = connectingKey === it.key;
                const Icon = INTEGRATION_ICONS[it.key] || PlugIcon;
                
                return (
                  <div className="integration-row" key={it.key}>
                    <div className="ico" style={{ background: `${it.color}15`, color: it.color }}>
                      <Icon size={16} />
                    </div>
                    <div className="integration-info">
                      <strong>{it.name}</strong>
                      <span>{it.desc}</span>
                    </div>
                    {connected ? (
                      <span className="badge emerald" style={{ fontSize: 10 }}><CheckIcon size={11} /> Connected</span>
                    ) : (
                      <button 
                        className="btn-ghost" 
                        disabled={isConnecting}
                        style={{ padding: "5px 10px", fontSize: 11.5 }}
                        onClick={() => connectIntegration(it.key)}
                      >
                        {isConnecting ? "Connecting..." : "Connect"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PEOPLE & INVITATIONS ── */}
        {tab === "people" && (
          <div className="fade-in-el">
            <div className="section-title"><UsersIcon size={14} /> Invite People</div>
            <p className="muted" style={{ marginBottom: 12 }}>Invite a teammate to join this corporate workspace. System will send an onboarding link.</p>
            
            <form onSubmit={handleSendInvitation} style={{ marginBottom: 20 }}>
              <div className="field-row">
                <div className="modern-input-wrap">
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Teammate Corporate Email</label>
                  <input
                    type="email"
                    className="modern-input"
                    placeholder="name@company.com"
                    value={inviteForm.email}
                    onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="modern-input-wrap">
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Assign Role</label>
                  <select
                    className="modern-input"
                    value={inviteForm.role}
                    onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Legal Lead">Legal Lead</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="modern-input-wrap">
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Department</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="e.g. Legal Operations"
                    value={inviteForm.department}
                    onChange={e => setInviteForm(p => ({ ...p, department: e.target.value }))}
                  />
                </div>
                <div className="modern-input-wrap">
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Custom Welcome Message (Optional)</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Hey, join our workspace..."
                    value={inviteForm.message}
                    onChange={e => setInviteForm(p => ({ ...p, message: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <PlusIcon size={14} /> Send Invitation
              </button>
            </form>

            <div className="sb-divider" style={{ margin: "14px 0", background: "var(--border)" }} />
            
            <div className="section-title"><CheckIcon size={14} /> Active Workspace Invitations</div>
            <table className="data-table" style={{ width: "100%", fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>Recipient Email</th>
                  <th>Assigned Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Revoke</th>
                </tr>
              </thead>
              <tbody>
                {invitedUsers.map(inv => (
                  <tr key={inv.id}>
                    <td><strong>{inv.email}</strong></td>
                    <td>{inv.role}</td>
                    <td>{inv.department}</td>
                    <td>
                      <span className={`badge ${
                        inv.status === "Accepted" ? "emerald" : inv.status === "Pending" ? "warn" : "danger"
                      }`} style={{ fontSize: 10.5 }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {inv.status !== "Accepted" && (
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ padding: "4px 8px", fontSize: 11, color: "var(--danger)" }}
                          onClick={() => {
                            setInvitedUsers(prev => prev.filter(item => item.id !== inv.id));
                            showToast(`Revoked invitation for ${inv.email}`);
                          }}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── BILLING & INVOICES ── */}
        {tab === "billing" && (
          <div className="fade-in-el">
            <div className="section-title"><BriefcaseIcon size={14} /> Subscription Details</div>
            
            <div className="billing-plan-card-redesigned">
              <div className="billing-plan-card-top">
                <div>
                  <strong className="plan-name">Enterprise Premium</strong>
                  <span className="plan-desc">Unlimited database rows • Premium priority ticket response</span>
                </div>
                <span className="badge emerald" style={{ fontSize: 10.5 }}>Active</span>
              </div>
              <div className="plan-pricing">$4,800 <span className="period">/ month</span></div>
              <div className="plan-actions">
                <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => flashBilling("Redirecting to stripe checkout...")}>Upgrade Plan</button>
                <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => flashBilling("Please contact support to cancel.")}>Cancel Plan</button>
              </div>
            </div>

            <div className="billing-usage-row">
              <div className="usage-meter-box">
                <div className="usage-meter-desc">
                  <span>Authorized Seats</span>
                  <strong>50 / 100 seats</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: "50%", background: "var(--info)" }} /></div>
              </div>
              <div className="usage-meter-box">
                <div className="usage-meter-desc">
                  <span>Storage Utilization</span>
                  <strong>42 GB / 100 GB</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: "42%", background: "var(--emerald)" }} /></div>
              </div>
            </div>

            <div className="section-title" style={{ marginTop: 18 }}>Payment Methods</div>
            <div className="billing-payment-row" style={{ marginBottom: 18 }}>
              <div className="billing-card-chip">VISA</div>
              <div style={{ flex: 1 }}>
                <strong style={{ display: "block", fontSize: 13 }}>Visa ending in 4242</strong>
                <span className="muted" style={{ fontSize: 11 }}>Expires 08/2028</span>
              </div>
              <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => flashBilling("Stripe modal opened.")}>Update</button>
            </div>

            <div className="section-title">Billing Invoices</div>
            <table className="data-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Billed Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Download</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 16 }}>No invoices found. Connect to database to load billing history.</td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><strong>{inv.id}</strong></td>
                    <td>{inv.date}</td>
                    <td>{inv.amount}</td>
                    <td><span className="badge emerald" style={{ fontSize: 10.5 }}>{inv.status}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-ghost download-btn" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => flashBilling(`${inv.id} downloaded.`)}>
                        <DownloadIcon size={11} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {billingMsg && <div className="billing-flash-alert">{billingMsg}</div>}
          </div>
        )}

        {/* ── DARK LIGHT MODE TOGGLE ── */}
        {tab === "darkmode" && (
          <div className="fade-in-el">
            <div className="section-title"><MoonIcon size={14} /> UI Dark Mode</div>
            <p className="muted" style={{ marginBottom: 14 }}>Toggle between light and dark visual themes across the application dashboard.</p>
            
            <div className="pill-toggle-container">
              <div>
                <strong>Enable Dark Mode</strong>
                <span className="muted" style={{ display: "block", fontSize: 11.5 }}>Adjust colors to reduce eye strain in low-light environments.</span>
              </div>
              <button 
                type="button" 
                className={`toggle ${theme === "dark" ? "on" : ""}`} 
                onClick={toggleTheme} 
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 24, padding: 14, background: "var(--bg)", borderRadius: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: theme === "light" ? 1 : 0.4 }}>
                <SunIcon size={24} color="var(--warning)" />
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>Light Theme</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: theme === "dark" ? 1 : 0.4 }}>
                <MoonIcon size={24} color="var(--info)" />
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>Dark Theme</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
