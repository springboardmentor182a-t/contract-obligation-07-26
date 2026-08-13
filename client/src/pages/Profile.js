import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import { API_BASE } from "../config/api";
import { useUI } from "../context/UIContext";
import {
  UserIcon, LockIcon, GearIcon, EditIcon, CameraIcon, BellIcon
} from "../components/Icons";

/* ─── helpers ─── */
function initials(full_name) {
  if (!full_name) return "?";
  const parts = full_name.trim().split(" ");
  return parts.length > 1
    ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
    : parts[0][0].toUpperCase();
}

function FloatingInput({ label, name, type = "text", value, onChange, disabled, placeholder, state }) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || (value && value.length > 0);
  return (
    <div className={`fi-wrap ${state || ""}`}>
      <input
        name={name}
        type={type}
        className="fi-input"
        value={value || ""}
        onChange={e => onChange && onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={focused ? (placeholder || "") : ""}
        autoComplete="off"
      />
      <label className={`fi-label ${isActive ? "active" : ""}`}>{label}</label>
      {state === "success" && <span className="fi-indicator success">✓</span>}
      {state === "error" && <span className="fi-indicator error">✕</span>}
    </div>
  );
}

/* ─── Tab definitions ─── */
const TABS = [
  { key: "personal", label: "Personal Info", Icon: UserIcon },
  { key: "security", label: "Security & Credentials", Icon: LockIcon },
  { key: "preferences", label: "Preferences", Icon: GearIcon },
];

export default function Profile() {
  const { user: globalUser, setUser: setGlobalUser } = useUI();
  const [tab, setTab] = useState("personal");

  const getInitialUser = () => {
    const storedName = localStorage.getItem("name") || sessionStorage.getItem("name") || globalUser?.name || "";
    const storedRole = globalUser?.role || "User";
    const storedEmail = localStorage.getItem("email") || sessionStorage.getItem("email") || globalUser?.email || "";
    return {
      full_name: storedName,
      email: storedEmail,
      role: storedRole,
      department: "Legal & Compliance",
      job_title: storedRole,
      phone: "",
      bio: "",
    };
  };

  const [user, setUser] = useState(getInitialUser);
  const [mfa, setMfa] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  // Validation states
  const [emailState, setEmailState] = useState("success");
  const [fullNameState, setFullNameState] = useState("idle");

  // Preferences
  const [prefs, setPrefs] = useState({
    emailAlerts: true, smsAlerts: false, weeklyDigest: true,
    contractReminders: true, darkMode: false, compactView: false,
  });

  const photoRef = useRef(null);
  const coverRef = useRef(null);

  /* ── Load from backend on mount ── */
  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        });
        if (res.ok) {
          const data = await res.json();
          setUser(prev => ({
            ...prev,
            ...data,
            full_name: data.full_name || prev.full_name,
            email: data.email || prev.email,
            role: data.role || prev.role,
          }));
          const updatedName = data.full_name || data.email || "User";
          setGlobalUser({ name: updatedName, role: data.role || "User", email: data.email || "" });
        }
      } catch {
        console.warn('Profile API unavailable — waiting for DB connection.');
      }
    }
    loadProfile();
  }, [setGlobalUser]);

  function readFile(file, cb) {
    const r = new FileReader();
    r.onload = () => cb(r.result);
    r.readAsDataURL(file);
  }

  /* ── Save Personal Info ── */
  async function handleSavePersonal(e) {
    e.preventDefault();
    if (emailState === "error" || fullNameState === "error") return;
    setSaving(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const payload = {
      full_name: user.full_name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      job_title: user.job_title,
      department: user.department,
    };
    
    // Update global context & storage
    setGlobalUser({ name: user.full_name, role: user.role, email: user.email });
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    storage.setItem("name", user.full_name);
    storage.setItem("email", user.email);

    try {
        const res = await fetch(`${API_BASE}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveMsg("Profile saved successfully!");
      } else {
        setSaveMsg("Saved locally — backend error.");
      }
    } catch {
      setSaveMsg("Saved locally — backend not reachable.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  /* ── Field validators ── */
  function handleFullNameChange(val) {
    setUser(p => ({ ...p, full_name: val }));
    setFullNameState(val.trim().length >= 2 ? "success" : "error");
  }

  function handleEmailChange(val) {
    setUser(p => ({ ...p, email: val }));
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setEmailState(ok ? "success" : "error");
  }

  function togglePref(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="profile-page fade-in-el">
      {/* ── Page header ── */}
      <div className="profile-page-header">
        <h2 className="page-title">My Profile</h2>
        <p className="page-sub">Manage your identity, security settings, and notification preferences.</p>
      </div>

      {/* ── Hero Banner + Avatar ── */}
      <div className="profile-hero-card card">
        <div
          className="profile-hero-banner"
          style={coverPhoto ? { backgroundImage: `url(${coverPhoto})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          <button type="button" className="cover-edit-btn" onClick={() => coverRef.current?.click()}>
            <EditIcon size={12} /> Change cover
          </button>
        </div>

        <div className="profile-hero-body">
          <div className="profile-avatar-ring" onClick={() => photoRef.current?.click()}>
            {userPhoto
              ? <img src={userPhoto} alt="avatar" />
              : <span>{initials(user.full_name)}</span>}
            <div className="avatar-camera-overlay"><CameraIcon size={16} /></div>
          </div>

          <div className="profile-hero-info">
            <h3>{user.full_name}</h3>
            <span className="profile-hero-role">
              {user.job_title}{user.department ? ` · ${user.department}` : ""}
            </span>
            <span className="profile-hero-email">{user.email}</span>
          </div>

          <div className="profile-hero-stats">
            <div className="phs">
              <strong>24</strong>
              <span>Contracts</span>
            </div>
            <div className="phs">
              <strong>156</strong>
              <span>Obligations</span>
            </div>
            <div className="phs">
              <strong>91%</strong>
              <span>Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUserPhoto); }} />
      <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setCoverPhoto); }} />

      {/* ── Animated Tab Bar ── */}
      <div className="profile-tabbar">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`profile-tabbar-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <t.Icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Panels ── */}
      <div className="profile-panel fade-in-el" key={tab}>

        {/* ─── Personal Info ─── */}
        {tab === "personal" && (
          <form className="card profile-card-inner" onSubmit={handleSavePersonal}>
            <div className="section-title">
              <UserIcon size={16} color="var(--info)" /> Personal Information
            </div>

            <div className="field-row">
              <FloatingInput
                label="Full Name"
                name="full_name"
                value={user.full_name}
                onChange={handleFullNameChange}
                state={fullNameState === "idle" ? "" : fullNameState}
              />
              <FloatingInput
                label="Job Title"
                name="job_title"
                value={user.job_title}
                onChange={val => setUser(p => ({ ...p, job_title: val }))}
              />
            </div>

            <div className="field-row">
              <FloatingInput
                label="Corporate Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleEmailChange}
                state={emailState === "idle" ? "" : emailState}
              />
              <FloatingInput
                label="Phone Number"
                name="phone"
                value={user.phone}
                onChange={val => setUser(p => ({ ...p, phone: val }))}
              />
            </div>

            <div className="field-row">
              <FloatingInput
                label="Department"
                name="department"
                value={user.department}
                onChange={val => setUser(p => ({ ...p, department: val }))}
              />
              <FloatingInput
                label="Role / Access Level"
                name="role"
                value={user.role}
                disabled
              />
            </div>

            {/* Bio */}
            <div className="fi-wrap" style={{ marginBottom: 18 }}>
              <label className="fi-label active" style={{ position: "relative", top: "unset", left: "unset", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                Bio / Short Description
              </label>
              <textarea
                name="bio"
                className="profile-bio-textarea"
                value={user.bio || ""}
                onChange={e => setUser(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                placeholder="Describe your role and expertise..."
              />
            </div>

            <div className="profile-save-row">
              {saveMsg && (
                <span className={`save-msg ${saveMsg.includes("locally") ? "warn" : "ok"}`}>
                  {saveMsg}
                </span>
              )}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* ─── Security & Credentials ─── */}
        {tab === "security" && (
          <div className="card profile-card-inner">
            <div className="section-title">
              <LockIcon size={16} color="var(--danger)" /> Credentials & Access Control
            </div>

            <div className="field-row">
              <FloatingInput
                label="Current Password"
                name="current_password"
                type="password"
                value="••••••••••••"
                disabled
              />
              <FloatingInput
                label="New Password"
                name="new_password"
                type="password"
                value=""
                placeholder="Leave blank to keep current"
                onChange={() => {}}
              />
            </div>
            <FloatingInput
              label="Confirm New Password"
              name="confirm_password"
              type="password"
              value=""
              onChange={() => {}}
            />

            <div className="profile-divider" />

            <div className="section-title" style={{ marginTop: 6 }}>
              <BellIcon size={16} color="var(--warning)" /> Two-Factor Authentication
            </div>

            <div className="pill-toggle-container">
              <div>
                <strong>Multi-Factor Authentication (MFA)</strong>
                <span className="muted" style={{ display: "block", fontSize: 12, marginTop: 4 }}>
                  Protect your account with an authenticator app at login.
                </span>
              </div>
              <button
                type="button"
                className={`toggle ${mfa ? "on" : ""}`}
                onClick={() => setMfa(m => !m)}
              />
            </div>

            <div className="profile-security-sessions">
              <div className="section-title" style={{ marginTop: 18 }}>
                Active Sessions
              </div>
              <div className="session-row">
                <div>
                  <strong>Chrome · Windows 11</strong>
                  <span className="muted" style={{ display: "block", fontSize: 12 }}>Last active: just now · 192.168.1.42</span>
                </div>
                <span className="badge emerald">Current</span>
              </div>
              <div className="session-row">
                <div>
                  <strong>Mobile Safari · iPhone</strong>
                  <span className="muted" style={{ display: "block", fontSize: 12 }}>Last active: 2 days ago · 10.0.0.5</span>
                </div>
                <button type="button" className="btn btn-ghost" style={{ padding: "5px 12px", fontSize: 12 }}>Revoke</button>
              </div>
            </div>

            <div className="profile-save-row" style={{ marginTop: 20 }}>
              <button type="button" className="btn btn-ghost">Update Password</button>
            </div>
          </div>
        )}

        {/* ─── Preferences ─── */}
        {tab === "preferences" && (
          <div className="card profile-card-inner">
            <div className="section-title">
              <BellIcon size={16} color="var(--info)" /> Notification Preferences
            </div>

            {[
              { key: "emailAlerts", label: "Email Alerts", sub: "Receive contract & obligation alerts via email" },
              { key: "smsAlerts", label: "SMS / WhatsApp Alerts", sub: "Get urgent alerts via text message" },
              { key: "weeklyDigest", label: "Weekly Digest", sub: "Summary of contract activity every Monday" },
              { key: "contractReminders", label: "Contract Reminders", sub: "Reminders 30, 15, and 7 days before expiry" },
            ].map(item => (
              <div key={item.key} className="pill-toggle-container">
                <div>
                  <strong>{item.label}</strong>
                  <span className="muted" style={{ display: "block", fontSize: 12, marginTop: 4 }}>{item.sub}</span>
                </div>
                <button
                  type="button"
                  className={`toggle ${prefs[item.key] ? "on" : ""}`}
                  onClick={() => togglePref(item.key)}
                />
              </div>
            ))}

            <div className="profile-divider" />

            <div className="section-title" style={{ marginTop: 6 }}>
              <GearIcon size={16} color="var(--text-secondary)" /> Display & Interface
            </div>

            {[
              { key: "darkMode", label: "Dark Mode", sub: "Switch to a dark colour scheme for the interface" },
              { key: "compactView", label: "Compact View", sub: "Reduce padding and spacing for higher information density" },
            ].map(item => (
              <div key={item.key} className="pill-toggle-container">
                <div>
                  <strong>{item.label}</strong>
                  <span className="muted" style={{ display: "block", fontSize: 12, marginTop: 4 }}>{item.sub}</span>
                </div>
                <button
                  type="button"
                  className={`toggle ${prefs[item.key] ? "on" : ""}`}
                  onClick={() => togglePref(item.key)}
                />
              </div>
            ))}

            <div className="profile-save-row" style={{ marginTop: 20 }}>
              <button type="button" className="btn btn-primary">Save Preferences</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
