import React, { useState, useEffect } from "react";
import { FileText, Bell, ShieldCheck, CheckCircle, Clock } from "lucide-react";
import { getAuthHeaders } from "../utils/auth";

const ICON_MAP = {
  contract: { Icon: FileText, colorClass: "color-blue" },
  notification: { Icon: Bell, colorClass: "color-yellow" },
  compliance: { Icon: ShieldCheck, colorClass: "color-teal" },
  complete: { Icon: CheckCircle, colorClass: "color-green" },
  overdue: { Icon: Clock, colorClass: "color-red" },
  default: { Icon: FileText, colorClass: "color-blue" },
};

function getIconInfo(item) {
  const t = (item.category || item.cat || "").toLowerCase();
  if (t.includes("contract")) return ICON_MAP.contract;
  if (t.includes("notification")) return ICON_MAP.notification;
  if (t.includes("compliance")) return ICON_MAP.compliance;
  if (t.includes("complete") || t.includes("done")) return ICON_MAP.complete;
  if (t.includes("overdue") || t.includes("expir")) return ICON_MAP.overdue;
  return ICON_MAP.default;
}

function formatTime(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60); // minutes
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;
    return d.toLocaleDateString();
  } catch {
    return ts;
  }
}

export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setActivities(data.slice(0, 6));
        }
      } catch (err) {
        console.warn("Failed to load recent activities", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title">Recent Activity</h3>
        <button
          className="chart-header-link"
          onClick={() => (window.location.href = "/notifications")}
        >
          View all
        </button>
      </div>
      <div className="activity-list">
        {loading && (
          <div className="activity-row" style={{ justifyContent: "center", padding: "1rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading…</span>
          </div>
        )}
        {!loading && activities.length === 0 && (
          <div className="activity-row" style={{ justifyContent: "center", padding: "1rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No recent activity</span>
          </div>
        )}
        {activities.map((item) => {
          const { Icon, colorClass } = getIconInfo(item);
          return (
            <div key={item.id} className="activity-row">
              <div className={`activity-icon-wrapper ${colorClass}`}>
                <Icon className="activity-row-icon" size={16} />
              </div>
              <div className="activity-info-wrapper">
                <p className="activity-description">{item.title}</p>
                <span className="activity-timestamp">
                  {formatTime(item.time || item.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
