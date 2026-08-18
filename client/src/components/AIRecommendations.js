import React, { useState, useEffect } from "react";
import { Sparkles, AlertTriangle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import api from "../api";

export default function AIRecommendations() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch critical/upcoming renewals expiring soon to drive real recommendations
    api.get("/renewals", { params: { status: "upcoming", limit: 5 } })
      .then(res => { setRenewals(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function daysLeft(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  }

  function priorityIcon(priority) {
    if (priority === "critical") return { Icon: AlertTriangle, cls: "rec-icon-danger", box: "color-pink" };
    if (priority === "high") return { Icon: AlertCircle, cls: "rec-icon-warning", box: "color-yellow" };
    return { Icon: Clock, cls: "rec-icon-info", box: "color-light-yellow" };
  }

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Sparkles className="title-magic-icon" />
          Renewal Alerts
        </h3>
      </div>
      <div className="recommendations-list">
        {loading ? (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            Loading alerts...
          </div>
        ) : renewals.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            No upcoming renewals.
          </div>
        ) : (
          renewals.map(r => {
            const days = daysLeft(r.original_end_date);
            const { Icon, cls, box } = priorityIcon(r.priority);
            const label = days < 0
              ? `${r.renewal_number} expired ${Math.abs(days)}d ago`
              : `${r.renewal_number} — expires in ${days} day${days !== 1 ? "s" : ""}`;
            return (
              <div className={`rec-box ${box}`} key={r.id}>
                <div className="rec-box-left">
                  <Icon className={cls} />
                  <span>{label} · {r.contract?.vendor_name || "—"}</span>
                </div>
                <ArrowRight className="rec-arrow" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
