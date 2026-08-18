import React, { useState, useEffect } from "react";
import { FileText, AlertTriangle, Users, Clock, CheckCircle, Shield } from "lucide-react";
import api from "../api";

export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/history?limit=7")
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load history", err);
        setLoading(false);
      });
  }, []);

  const getIcon = (action) => {
    const act = (action || "").toUpperCase();
    if (act.includes("CREATE")) return { icon: FileText, color: "color-green" };
    if (act.includes("APPROV")) return { icon: CheckCircle, color: "color-green" };
    if (act.includes("REJECT") || act.includes("CANCEL")) return { icon: XCircle, color: "color-red" };
    if (act.includes("EXPI")) return { icon: AlertTriangle, color: "color-orange" };
    return { icon: Shield, color: "color-blue" };
  };

  const formatTime = (dateStr) => {
    try {
      const dateObj = new Date(dateStr);
      const diff = new Date() - dateObj;
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins} min ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
      return dateObj.toLocaleDateString();
    } catch {
      return "Recent";
    }
  };

  // Safe fallback if lucide-react doesn't export XCircle
  const XCircle = (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title">Recent Activities</h3>
      </div>
      <div className="activities-list">
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            No recent activities.
          </div>
        ) : (
          activities.map((act) => {
            const { icon: Icon, color } = getIcon(act.action);
            return (
              <div className="activity-row" key={act.id}>
                <div className={`activity-icon-wrapper ${color}`}>
                  <Icon className="activity-row-icon" size={16} />
                </div>
                <div className="activity-info-wrapper">
                  <p className="activity-description">
                    {act.remarks || `${act.action.replace(/_/g, " ")} by ${act.changed_by}`}
                  </p>
                  <span className="activity-timestamp">{formatTime(act.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
