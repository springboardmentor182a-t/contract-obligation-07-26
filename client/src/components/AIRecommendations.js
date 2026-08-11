import React, { useState, useEffect } from "react";
import { Sparkles, AlertTriangle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../utils/auth";

export default function AIRecommendations() {
  const [renewals, setRenewals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/renewals/", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          // Filter renewals expiring within 30 days or at risk
          const soon = (data || [])
            .filter((r) => {
              if (!r.end_date && !r.expiry_date) return false;
              const expiry = new Date(r.end_date || r.expiry_date);
              const diff = (expiry - new Date()) / (1000 * 60 * 60 * 24);
              return diff < 30 && diff > -1;
            })
            .slice(0, 3);
          setRenewals(soon);
        }
      } catch (err) {
        console.warn("Failed to load renewals for AI recs", err);
      }
    }
    load();
  }, []);

  // Static AI-style recommendations shown when we have live renewals or as fallback
  const staticRecs = [
    {
      id: "s1",
      colorClass: "color-pink",
      Icon: AlertTriangle,
      iconClass: "rec-icon-danger",
      text: "Review contracts expiring within 30 days",
      path: "/renewal-dashboard",
    },
    {
      id: "s2",
      colorClass: "color-yellow",
      Icon: AlertCircle,
      iconClass: "rec-icon-warning",
      text: "Check compliance score — target above 85%",
      path: "/compliance",
    },
    {
      id: "s3",
      colorClass: "color-light-yellow",
      Icon: Clock,
      iconClass: "rec-icon-info",
      text: "Review pending approval obligations",
      path: "/quick-actions",
    },
  ];

  // Build live recs from renewals
  const liveRecs = renewals.map((r, i) => ({
    id: `live-${i}`,
    colorClass: "color-pink",
    Icon: AlertTriangle,
    iconClass: "rec-icon-danger",
    text: `Renew: ${r.title || r.contract_title || "Contract"} — expiring soon`,
    path: "/renewal-dashboard",
  }));

  const recs = liveRecs.length > 0 ? liveRecs : staticRecs;

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Sparkles className="title-magic-icon" size={16} />
          AI Recommendations
        </h3>
      </div>
      <div className="recommendations-list">
        {recs.map((rec) => (
          <button
            key={rec.id}
            type="button"
            className={`rec-box ${rec.colorClass}`}
            onClick={() => navigate(rec.path)}
            style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "none", padding: 0 }}
          >
            <div className="rec-box-left">
              <rec.Icon className={rec.iconClass} size={16} />
              <span>{rec.text}</span>
            </div>
            <ArrowRight className="rec-arrow" size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
