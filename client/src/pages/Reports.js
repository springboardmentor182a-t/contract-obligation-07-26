import React, { useState, useEffect } from "react";
import "./Reports.css";
import { DownloadIcon, BarIcon, ShieldIcon, InfoIcon } from "../components/Icons";

// Static report template config (UI-only, no DB table)
const REPORT_TEMPLATES = [
  { title: "Compliance Summary", sub: "Score trend + open flags, last 90 days" },
  { title: "Obligation Status", sub: "All obligations grouped by owner and status" },
  { title: "Contract Portfolio", sub: "Full repository export with value & expiry" },
  { title: "Audit Trail", sub: "Every logged action for a chosen date range" },
];

export default function Reports() {
  const [kpis, setKpis] = useState([]);
  const [monthlyVolume, setMonthlyVolume] = useState([]);
  const [filterRange, setFilterRange] = useState("QTD");

  // Fetch live metrics if backend is wired up
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [resMetrics, resVolume] = await Promise.all([
          fetch("/api/analytics/metrics"),
          fetch("/api/analytics/monthly-volume")
        ]);
        if (resMetrics.ok && resVolume.ok) {
          const metricsData = await resMetrics.json();
          const volumeData = await resVolume.json();
          setKpis(metricsData);
          setMonthlyVolume(volumeData);
        }
        // On failure, KPIs and chart stay empty — no dummy fallback
      } catch (err) {
        console.warn('Analytics API unavailable — waiting for DB connection.', err);
      }
    }
    fetchMetrics();
  }, []);

  const maxVolumeVal = Math.max(...monthlyVolume.map((m) => m.value), 1);

  return (
    <div className="page-surface reports-page fade-in-el">
      <div className="reports-header-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="muted">Monitor contract compliance, renewal tracking, and obligation throughput.</p>
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
              <div className="template-card-row" key={t.title}>
                <div className="template-card-info">
                  <strong>{t.title}</strong>
                  <span className="subText">{t.sub}</span>
                </div>
                <button className="export-action-btn" title="Download Report CSV/PDF">
                  <DownloadIcon size={14} /> <span>PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary Banner */}
      <div className="compliance-banner-enhanced">
        <InfoIcon size={18} color="var(--info)" />
        <div className="banner-text">
          <strong>Pro-Tip:</strong> Automated monthly volume calculations are synced directly with the contract repository database. 
          For granular CSV logs, run the <em>Compliance Audit</em> in the <a href="/quick-actions" style={{ textDecoration: "underline", color: "var(--info)" }}>Quick Actions page</a>.
        </div>
      </div>
    </div>
  );
}
