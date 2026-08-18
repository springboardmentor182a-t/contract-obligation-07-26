import React, { useState, useEffect } from "react";
import { AlertTriIcon, CheckIcon } from "./Icons";
import { API_BASE } from "../config/api";

export default function AIForecast() {
  const [summary, setSummary] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadForecast() {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resSum, resPred, resAlert] = await Promise.all([
          fetch(`${API_BASE}/forecast/summary`, { headers }),
          fetch(`${API_BASE}/forecast/predictions`, { headers }),
          fetch(`${API_BASE}/forecast/alerts`, { headers })
        ]);

        if (resSum.ok) setSummary(await resSum.json());
        if (resPred.ok) setPredictions(await resPred.json());
        if (resAlert.ok) setAlerts(await resAlert.json());
      } catch (err) {
        console.warn("Forecast API offline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, []);

  const filteredPredictions = activeTab === "all" 
    ? predictions 
    : predictions.filter(p => p.category.toLowerCase().includes(activeTab.toLowerCase()));

  const getRiskBadge = (level) => {
    if (level === "Critical") return <span className="badge danger">Critical</span>;
    if (level === "High") return <span className="badge warn">High Risk</span>;
    return <span className="badge info">Medium</span>;
  };

  return (
    <div className="card ai-forecast-card" style={{ padding: 22, marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="section-title" style={{ fontSize: 16, margin: 0 }}>
            <span style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
              🤖 AI Forecast & Early Warning Engine
            </span>
          </div>
          <p className="muted" style={{ fontSize: 12, margin: "4px 0 0" }}>
            Predicts renewal delays, forecasts overdue obligations, identifies compliance risks & triggers preventive alerts.
          </p>
        </div>
        {summary && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 11, color: "var(--text-secondary)", display: "block" }}>AI Risk Index</span>
              <strong style={{ fontSize: 18, color: summary.overall_risk_score > 60 ? "var(--warning)" : "var(--emerald)" }}>
                {summary.overall_risk_score} / 100
              </strong>
            </div>
            <span className="badge emerald" style={{ fontSize: 10 }}>{summary.accuracy_confidence}</span>
          </div>
        )}
      </div>

      {/* Summary KPI Badges */}
      {summary && (
        <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Renewal Delays Predicted</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>{summary.predicted_renewal_delays} Contracts</div>
          </div>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Overdue Obligations Forecast</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#EF4444" }}>{summary.predicted_overdue_obligations} Milestone Tasks</div>
          </div>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Compliance Risks Flagged</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#8B5CF6" }}>{summary.compliance_risks_flagged} Controls</div>
          </div>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Early Warning Alerts</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#3B82F6" }}>{summary.early_warnings_active} Active</div>
          </div>
        </div>
      )}

      {/* Early Warning Alerts Banner */}
      {alerts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>
            ⚡ Early Warning Alerts
          </strong>
          {alerts.map((al) => (
            <div key={al.id} style={{ 
              display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 10, 
              background: al.severity === "Critical" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
              border: `1px solid ${al.severity === "Critical" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`
            }}>
              <AlertTriIcon size={18} color={al.severity === "Critical" ? "var(--danger)" : "var(--warning)"} style={{ marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 13, color: "var(--text)" }}>{al.title}</strong>
                  <span className={`badge ${al.severity === "Critical" ? "danger" : "warn"}`} style={{ fontSize: 10 }}>{al.metric}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 6px" }}>{al.description}</p>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--info)" }}>
                  💡 Action Required: {al.recommended_action}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs & Predictions List */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <strong style={{ fontSize: 13 }}>Risk Predictions & Preventive Recommendations</strong>
        <div className="tabs" style={{ margin: 0, padding: 3 }}>
          {["all", "renewal", "overdue", "compliance"].map((t) => (
            <button
              key={t}
              className={`tab ${activeTab === t ? "active" : ""}`}
              style={{ fontSize: 11, padding: "4px 10px" }}
              onClick={() => setActiveTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredPredictions.map((item) => (
          <div key={item.id} style={{ 
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 14,
            transition: "all 0.15s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge info" style={{ fontSize: 10 }}>{item.category}</span>
                <strong style={{ fontSize: 13 }}>{item.title}</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Impact: ~{item.impact_days} days</span>
                {getRiskBadge(item.risk_level)}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
              <strong>Affected Item:</strong> {item.affected_item} &nbsp;|&nbsp; <strong>Root Cause:</strong> {item.predicted_delay_reason}
            </div>
            <div style={{ 
              background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 8, padding: "8px 12px", 
              fontSize: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--emerald)", fontWeight: 600
            }}>
              <CheckIcon size={14} color="var(--emerald)" />
              Preventive Protocol: {item.preventive_action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
