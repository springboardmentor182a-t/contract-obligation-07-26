import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search, Bell, Plus, ChevronDown, User, LogOut, Sliders, Moon, Sun, Calendar
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [quickDropdown, setQuickDropdown] = useState(false);
  const [dark, setDark] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  const roleLabel = (role) => {
    if (!role) return "User";
    return role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <header className="navbar">
      <div className="breadcrumb-area">
        <span className="breadcrumb-parent">ContractIQ</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Dashboard</span>
      </div>

      <div className="search-wrapper">
        <Search className="search-icon" />
        <input type="text" className="search-input" placeholder="Search contracts, renewals, users..." />
      </div>

      <div className="nav-controls">
        <button className="icon-control-btn" title="Calendar"><Calendar className="control-icon" /></button>

        <button className="icon-control-btn" onClick={toggleTheme} title="Toggle Theme">
          {dark ? <Sun className="control-icon" style={{ color: "#eab308" }} /> : <Moon className="control-icon" />}
        </button>

        <button className="icon-control-btn alert-badge-wrapper" title="Notifications">
          <Bell className="control-icon" />
          <span className="notification-badge-dot">!</span>
        </button>

        <div className="quick-action-container">
          <button className="quick-action-btn" onClick={() => setQuickDropdown(!quickDropdown)}>
            <Plus className="quick-action-icon" />
            <span>Quick Action</span>
          </button>
          {quickDropdown && (
            <div className="dropdown-menu quick-action-menu">
              <div className="dropdown-item" onClick={() => { navigate("/renewals"); setQuickDropdown(false); }}>View Renewals</div>
              <div className="dropdown-item" onClick={() => { navigate("/users"); setQuickDropdown(false); }}>Manage Users</div>
              <div className="dropdown-item" onClick={() => { navigate("/dashboard"); setQuickDropdown(false); }}>Go to Dashboard</div>
            </div>
          )}
        </div>

        <div className="profile-container">
          <div className="profile-trigger" onClick={() => setProfileDropdown(!profileDropdown)}>
            <div className="profile-avatar">{user?.initials || "U"}</div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || "User"}</span>
              <span className="profile-role">{roleLabel(user?.role)}</span>
            </div>
            <ChevronDown className="profile-chevron" />
          </div>
          {profileDropdown && (
            <div className="dropdown-menu profile-menu">
              <div className="dropdown-item">
                <User className="dropdown-item-icon" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>{user?.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{user?.email}</div>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => setProfileDropdown(false)}>
                <Sliders className="dropdown-item-icon" />
                <span>Settings</span>
              </div>
              <div className="dropdown-item text-danger" onClick={handleLogout}>
                <LogOut className="dropdown-item-icon" />
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar{height:70px;background-color:var(--bg-card);border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;flex-shrink:0;z-index:10;}
        .breadcrumb-area{display:flex;align-items:center;gap:.5rem;font-size:.85rem;font-weight:500;}
        .breadcrumb-parent{color:var(--text-muted);}
        .breadcrumb-separator{color:var(--text-muted);font-size:.75rem;}
        .breadcrumb-current{color:var(--text-primary);font-weight:600;}
        .search-wrapper{position:relative;width:320px;margin-left:2rem;margin-right:auto;}
        .search-icon{position:absolute;left:1rem;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--text-muted);pointer-events:none;}
        .search-input{width:100%;height:38px;background-color:var(--bg-app);border:1px solid var(--border-color);border-radius:9999px;padding:0 1rem 0 2.5rem;font-size:.82rem;color:var(--text-primary);}
        .search-input:focus{outline:none;border-color:var(--color-blue);}
        .nav-controls{display:flex;align-items:center;gap:.85rem;}
        .icon-control-btn{width:38px;height:38px;background:transparent;border:1px solid transparent;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);cursor:pointer;position:relative;}
        .icon-control-btn:hover{background-color:var(--bg-app);border-color:var(--border-color);color:var(--text-primary);}
        .control-icon{width:18px;height:18px;}
        .alert-badge-wrapper{position:relative;}
        .notification-badge-dot{position:absolute;top:4px;right:4px;background-color:#EF4444;color:#fff;font-size:.6rem;font-weight:700;width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg-card);}
        .quick-action-container{position:relative;}
        .quick-action-btn{height:38px;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#fff;border:none;border-radius:8px;padding:0 1rem;display:flex;align-items:center;gap:.35rem;font-size:.82rem;font-weight:600;cursor:pointer;box-shadow:0 4px 10px rgba(37,99,235,.2);}
        .quick-action-icon{width:15px;height:15px;}
        .profile-container{position:relative;}
        .profile-trigger{display:flex;align-items:center;gap:.65rem;cursor:pointer;padding:4px 8px;border-radius:8px;}
        .profile-trigger:hover{background-color:var(--bg-app);}
        .profile-avatar{width:32px;height:32px;background:linear-gradient(135deg,#8B5CF6,#6D28D9);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;}
        .profile-info{display:flex;flex-direction:column;text-align:left;}
        .profile-name{font-size:.82rem;font-weight:700;color:var(--text-primary);line-height:1.2;}
        .profile-role{font-size:.68rem;color:var(--text-muted);}
        .profile-chevron{width:14px;height:14px;color:var(--text-muted);}
        .dropdown-menu{position:absolute;top:calc(100% + 8px);right:0;background-color:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;box-shadow:var(--shadow-lg);min-width:200px;z-index:50;overflow:hidden;}
        .dropdown-item{padding:.65rem 1rem;font-size:.8rem;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;gap:.5rem;}
        .dropdown-item:hover{background-color:var(--bg-app);color:var(--text-primary);}
        .dropdown-item-icon{width:15px;height:15px;color:var(--text-muted);}
        .dropdown-divider{border:0;border-top:1px solid var(--border-color);margin:0;}
        .text-danger{color:#EF4444!important;}
        .text-danger .dropdown-item-icon{color:#EF4444!important;}
      `}</style>
    </header>
  );
}
