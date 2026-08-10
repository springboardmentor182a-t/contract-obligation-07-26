import React, { useState, useEffect } from "react";
import "./Reports.css";
import { DownloadIcon, BarIcon, ShieldIcon, InfoIcon } from "../components/Icons";
import { API_BASE } from "../config/api";
import AIForecast from "../components/AIForecast";

const REPORT_TEMPLATES = [
  { id: "compliance", title: "Compliance Summary", sub: "Score trend + open flags, last 90 days" },
  { id: "obligations", title: "Obligation Status", sub: "All obligations grouped by owner and status" },
  { id: "contracts", title: "Contract Portfolio", sub: "Full repository export with value & expiry" },
  { id: "audit", title: "Audit Trail", sub: "Every logged action for a chosen date range" },
];

export default function Reports() {
  const [kpis, setKpis] = useState([]);
  const [monthlyVolume, setMonthlyVolume] = useState([]);
  const [filterRange, setFilterRange] = useState("QTD");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resMetrics, resVolume] = await Promise.all([
          fetch(`${API_BASE}/analytics/metrics`, { headers }),
          fetch(`${API_BASE}/analytics/monthly-volume`, { headers })
        ]);
        if (resMetrics.ok && resVolume.ok) {
          const metricsData = await resMetrics.json();
          const volumeData = await resVolume.json();
          setKpis(metricsData);
          setMonthlyVolume(volumeData);
        }
      } catch (err) {
        console.warn('Analytics API unavailable:', err);
      }
    }
    fetchMetrics();
  }, []);

  const handleExportCSV = async (templateId, templateTitle) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      let csvContent = "";
      let filename = `${templateId}_report_${new Date().toISOString().slice(0, 10)}.csv`;

      if (templateId === "obligations") {
        const res = await fetch("/api/obligations/", { headers });
        const data = await res.json();
        csvContent = "ID,Title,Priority,Status,Due Date\n" + 
          (Array.isArray(data) ? data.map(o => `"${o.id}","${o.title}","${o.priority}","${o.status}","${o.due_date}"`).join("\n") : "");
      } else if (templateId === "contracts") {
        const res = await fetch("/api/contracts/", { headers });
        const data = await res.json();
        csvContent = "ID,Contract Name,Vendor,Value,Status,End Date\n" + 
          (Array.isArray(data) ? data.map(c => `"${c.id}","${c.contract_name || c.name}","${c.vendor || ''}","${c.contract_value || c.value || ''}","${c.status}","${c.end_date || ''}"`).join("\n") : "");
      } else if (templateId === "audit") {
        const res = await fetch("/api/audit/logs", { headers });
        const data = await res.json();
        csvContent = "ID,Action,Module,Event Type,Description,Timestamp\n" + 
          (Array.isArray(data) ? data.map(a => `"${a.id}","${a.action}","${a.module}","${a.event_type || ''}","${a.description || ''}","${a.created_at || a.timestamp || ''}"`).join("\n") : "");
      } else {
        const res = await fetch("/api/compliance/controls", { headers });
        const data = await res.json();
        csvContent = "ID,Control Title,Status,Weight,Last Verified\n" + 
          (Array.isArray(data) ? data.map(c => `"${c.id}","${c.title}","${c.status}","${c.weight}","${c.lastVerified || ''}"`).join("\n") : "");
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(`Could not generate report: ${err.message}`);
    }
  };

  const maxVolumeVal = Math.max(...monthlyVolume.map((m) => m.value), 1);

  return (
    <div className="page-surface reports-page fade-in-el">
      <div className="reports-header-row">
        <div>
          <h2>Reports & Analytics Dashboard</h2>
          <p className="muted">Monitor contract compliance, renewal tracking, and predictive risk analytics.</p>
        </div>
        <div className="date-tabs">
          {["QTD", "YTD", "Last 12M", "All Time"].map((tab) => (
            <button
              key={tab}
              className={`date-tab-btn ${filterRange === tab ? "active" : ""}`}
              onClick={() => setFilterRange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Modern KPI Cards */}
      <div className="kpi-grid" style={{ marginTop: 22 }}>
        {kpis.map((k) => {
          const isPositive = k.trend && !k.trend.startsWith("-");
          return (
            <div className="kpi-card-redesigned" key={k.label}>
              <div className="kpi-card-meta">
                <span className="lbl">{k.label}</span>
                {k.trend && (
                  <span className={`kpi-trend-badge ${isPositive ? "positive" : "negative"}`}>
                    {k.trend}
                  </span>
                )}
              </div>
              <div className="val">{k.value}</div>
              <div className="kpi-card-progress">
                <div className="progress-bar-fill" style={{ width: "70%" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart & Template Sections */}
      <div className="grid-split">
        <div className="card chart-wrapper">
          <div className="section-title">
            <BarIcon size={16} color="var(--info)" /> Contract Volume Trend
          </div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 20 }}>Monthly signed agreements and extensions</p>
          
          <div className="bar-chart-enhanced">
            {monthlyVolume.map((m) => (
              <div className="bar-col-enhanced" key={m.month}>
                <div className="bar-container-enhanced">
                  <div 
                    className="bar-fill-enhanced" 
                    style={{ height: `${(m.value / maxVolumeVal) * 100}%` }}
                  >
                    <span className="bar-tooltip">{m.value} contracts</span>
                  </div>
                </div>
                <span className="bar-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card templates-wrapper">
          <div className="section-title">
            <ShieldIcon size={16} color="var(--emerald)" /> Standard Templates
          </div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 15 }}>Export ready-to-file compliance reports</p>
          
          <div className="templates-list">
            {REPORT_TEMPLATES.map((t) => (
              <div className="template-card-row" key={t.id}>
                <div className="template-card-info">
                  <strong>{t.title}</strong>
                  <span className="subText">{t.sub}</span>
                </div>
                <button 
                  className="export-action-btn" 
                  aria-label="Download CSV"
                  onClick={() => handleExportCSV(t.id, t.title)}
                >
                  <DownloadIcon size={14} /> <span>CSV</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Forecast Engine Section */}
      <AIForecast />

      {/* Performance Summary Banner */}
      <div className="compliance-banner-enhanced" style={{ marginTop: 20 }}>
        <InfoIcon size={18} color="var(--info)" />
        <div className="banner-text">
          <strong>Pro-Tip:</strong> Automated monthly volume calculations are synced directly with the contract repository database. 
          For granular CSV logs, run the <em>Compliance Audit</em> in the <a href="/quick-actions" style={{ textDecoration: "underline", color: "var(--info)" }}>Quick Actions page</a>.
        </div>
      </div>
    </div>
  );
}

