import React, { useState, useEffect } from "react";
import "./Notifications.css";
import { useUI } from "../context/UIContext";

import {
  FileIcon, ShieldIcon, RepeatIcon, ClipboardIcon, AlertTriIcon, CheckIcon, GearIcon,
  TrashIcon, CheckCircleIcon
} from "../components/Icons";
import { API_BASE } from "../config/api";
const NOTIF_CAT_STYLE = {
  Contracts: { color: "#3B82F6", Icon: FileIcon },
  Compliance: { color: "#10B981", Icon: ShieldIcon },
  Renewals: { color: "#14B8A6", Icon: RepeatIcon },
  Workflow: { color: "#F59E0B", Icon: ClipboardIcon },
  "Risk Alerts": { color: "#8B5CF6", Icon: AlertTriIcon },
  Approvals: { color: "#6366F1", Icon: CheckIcon },
  System: { color: "#64748B", Icon: GearIcon },
};

const FILTERS = ["All", "Contracts", "Compliance", "Renewals", "Workflow", "Risk Alerts", "Approvals", "System"];

export default function Notifications() {
  const { setNotificationCount } = useUI();
  const [filter, setFilter] = useState("All");
  const [notifs, setNotifs] = useState([]);
  const [dismissingIds, setDismissingIds] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resNotifs, resRenewals] = await Promise.all([
          fetch(`${API_BASE}/notifications`, { headers }),
          fetch(`${API_BASE}/renewals/upcoming`, { headers })
        ]);
        if (resNotifs.ok) {
          const data = await resNotifs.json();
          setNotifs(data);
          const unreadCount = data.filter(n => !n.is_read && !n.isRead).length;
          setNotificationCount(unreadCount);
        }
        if (resRenewals.ok) {
          const renewalData = await resRenewals.json();
          setUpcomingRenewals(renewalData);
        }
      } catch (err) {
        console.warn('Notifications API unavailable:', err);
      }
    }
    loadNotifications();
  }, [setNotificationCount]);

  // Sync count on changes
  useEffect(() => {
    const unread = notifs.filter(n => !n.isRead && !n.is_read).length;
    setNotificationCount(unread);
  }, [notifs, setNotificationCount]);

  async function handleMarkRead(id) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true, is_read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH", headers });
    } catch (e) {
      console.warn("Could not sync read status with backend");
    }
  }

  async function handleDismiss(id) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setDismissingIds(prev => [...prev, id]);
    
    setTimeout(async () => {
      setNotifs(prev => prev.filter(n => n.id !== id));
      setDismissingIds(prev => prev.filter(dId => dId !== id));
      try {
        await fetch(`/api/notifications/${id}`, { method: "DELETE", headers });
      } catch (e) {
        console.warn("Could not delete from backend");
      }
    }, 300);
  }

  async function handleMarkAllRead() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setNotifs(prev => prev.map(n => ({ ...n, isRead: true, is_read: true })));
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read`, { method: "POST", headers });
    } catch (e) {
      console.warn("Could not sync bulk read state");
    }
  }


  const filtered = filter === "All" ? notifs : notifs.filter((n) => n.cat === filter);
  
  const counts = { critical: 0, warning: 0, info: 0 };
  notifs.forEach((n) => {
    const urgency = n.urgency || "info";
    if (counts[urgency] !== undefined) {
      counts[urgency]++;
    }
  });

  return (
    <div className="fade-in-el">
      <div className="notifications-header-wrapper">
        <div>
          <h2>Notifications Center</h2>
          <p className="muted">Stay up to date on required signature approvals, expiring vendors, and compliance changes.</p>
        </div>
        <div className="action-links-row">
          <button className="text-action-btn" onClick={handleMarkAllRead}>
            <CheckCircleIcon size={14} /> Mark all read
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Feed */}
        <div>
          <div className="filter-chips-scroll">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="card notifications-feed-card">
            {filtered.length === 0 ? (
              <div className="empty-feed-placeholder">
                No alerts found in this category.
              </div>
            ) : (
              filtered.map((n) => {
                const style = NOTIF_CAT_STYLE[n.cat] || { color: "#64748B", Icon: GearIcon };
                const isUnread = !n.isRead && !n.is_read;
                const isDismissing = dismissingIds.includes(n.id);
                
                return (
                  <div 
                    className={`notif-item ${isUnread ? "unread" : ""} ${isDismissing ? "dismissing" : ""}`} 
                    key={n.id}
                  >
                    <div 
                      className="ico-circle" 
                      style={{ background: `${style.color}15`, color: style.color }}
                    >
                      <style.Icon size={16} />
                    </div>
                    <div className="body">
                      <div className="notif-title-row">
                        <strong>{n.title}</strong>
                        {isUnread && <span className="notif-unread-dot" title="Unread Alert" />}
                      </div>
                      <span className="badge category-badge" style={{ background: `${style.color}10`, color: style.color }}>
                        {n.cat}
                      </span>
                      <p>{n.desc}</p>
                      <div className="time">{n.time}</div>
                    </div>
                    <div className="notif-actions">
                      {isUnread && (
                        <button className="btn-mark-read" onClick={() => handleMarkRead(n.id)}>
                          Mark Read
                        </button>
                      )}
                      <button className="btn-dismiss" onClick={() => handleDismiss(n.id)} title="Dismiss Alert">
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div>
          <div className="card notif-summary-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="section-title">Today's Summary</div>
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 18 }}>
              Check system operations flags and high-risk alerts before generating your quarterly review deck.
            </p>
            <div className="urgency-meter-grid">
              <div className="urgency-meter-box critical">
                <span className="num">{counts.critical}</span>
                <span className="lbl">Critical</span>
              </div>
              <div className="urgency-meter-box warning">
                <span className="num">{counts.warning}</span>
                <span className="lbl">Warning</span>
              </div>
              <div className="urgency-meter-box info">
                <span className="num">{counts.info}</span>
                <span className="lbl">General</span>
              </div>
            </div>
          </div>

          <div className="card notif-renewals-card" style={{ padding: 22 }}>
            <div className="section-title">Urgent Renewals</div>
            <p className="muted" style={{ fontSize: 12, marginBottom: 15 }}>Required review for upcoming contracts</p>
            <div className="renewals-list">
              {upcomingRenewals.map((r) => (
                <div className="renewal-preview-row" key={r.code || r.name}>
                  <div className="renewal-desc">
                    <span className="code">{r.code}</span>
                    <span className="name">{r.name}</span>
                  </div>
                  <strong className={r.daysLeft <= 25 ? "critical-alert" : "warning-alert"}>
                    {r.daysLeft}d left
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
