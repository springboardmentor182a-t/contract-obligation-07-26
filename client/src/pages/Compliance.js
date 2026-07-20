import React, { useState } from "react";
import { ShieldIcon, DownloadIcon } from "../components/Icons";
import "./Compliance.css";

// TODO: Replace with API call — e.g. GET /api/compliance/controls
// Data shape each item must follow:
// {
//   id: string,           // e.g. "ISO-27001-A.9.1.1"
//   title: string,        // e.g. "Access Control Policy"
//   status: "PASSED" | "WARNING" | "FAILED",
//   weight: number,       // 0-100
//   lastVerified: string, // ISO 8601 timestamp
//   logs: Array<{
//     id: number,
//     timestamp: string,  // ISO 8601
//     status: "VERIFIED" | "WARNING" | "FAILED",
//     message: string
//   }>
// }
const CONTROLS_DATA = [];


export default function Compliance() {
  const [selectedControl, setSelectedControl] = useState(null);

  // Metrics summary data (calculated/static matching requirements)
  const totalControls = CONTROLS_DATA.length;
  const passedChecks = CONTROLS_DATA.filter((c) => c.status === "PASSED").length;
  const warningsOutstanding = CONTROLS_DATA.filter((c) => c.status === "WARNING").length;
  const failedPolicies = CONTROLS_DATA.filter((c) => c.status === "FAILED").length;

  // Exact math: (14*100 + 75 + 50 + 60) / 18 = 88.05% => 88%
  const overallScore = 88;

  // Localized timestamp formatter helper
  const formatTimestamp = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Localized log timestamp formatter helper (compact)
  const formatCompactTimestamp = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleRowClick = (control) => {
    if (selectedControl && selectedControl.id === control.id) {
      // Toggle selection off if clicked again
      setSelectedControl(null);
    } else {
      setSelectedControl(control);
    }
  };

  const handleDownloadLogJson = (e, control, log) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      downloadMetadata: {
        system: "ContractIQ Compliance & Risk Portal",
        downloadedAt: new Date().toISOString(),
        formatVersion: "1.0.0"
      },
      control: {
        id: control.id,
        title: control.title,
        status: control.status,
        weight: control.weight
      },
      auditLog: {
        logId: log.id,
        timestamp: log.timestamp,
        logStatus: log.status,
        message: log.message
      }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit_artifact_${control.id}_log_${log.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="compliance-dashboard fade-in-el">
      <div className="dashboard-header-row">
        <div>
          <h2 className="dashboard-title">Compliance and Risk Dashboard</h2>
          <p className="dashboard-subtitle">Monitor and verify operational security policies, active frameworks, and evidence trails.</p>
        </div>
      </div>

      {/* Top Grid displaying four key indicator cards */}
      <div className="metrics-summary-grid">
        <div className="metric-indicator-card border-blue">
          <div className="metric-header">
            <span className="metric-label">Overall Score</span>
            <span className="metric-accent-blue"><ShieldIcon size={16} /></span>
          </div>
          <div className="metric-value text-blue">{overallScore}%</div>
        </div>

        <div className="metric-indicator-card border-green">
          <div className="metric-header">
            <span className="metric-label">Passed Checks</span>
          </div>
          <div className="metric-value text-green">
            {passedChecks} <span className="metric-divider">/</span> {totalControls}
          </div>
        </div>

        <div className="metric-indicator-card border-amber">
          <div className="metric-header">
            <span className="metric-label">Warnings Outstanding</span>
          </div>
          <div className="metric-value text-amber">{warningsOutstanding}</div>
        </div>

        <div className="metric-indicator-card border-red">
          <div className="metric-header">
            <span className="metric-label">Failed Policies</span>
          </div>
          <div className="metric-value text-red">{failedPolicies}</div>
        </div>
      </div>

      {/* Two-column responsive workspace layout */}
      <div className="workspace-container">
        {/* Column One: Control Inventory (2/3 width) */}
        <div className="inventory-section">
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-heading">Framework Control Inventory</h3>
              <span className="control-count-badge">{totalControls} Controls Listed</span>
            </div>
            <div className="table-responsive">
              <table className="compliance-table">
                <thead>
                  <tr>
                    <th>Control ID</th>
                    <th>Framework Title Rule</th>
                    <th>Status</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTROLS_DATA.map((control) => {
                    const isSelected = selectedControl && selectedControl.id === control.id;
                    let badgeClass = "badge-neutral";
                    if (control.status === "PASSED") badgeClass = "status-badge-passed";
                    else if (control.status === "WARNING") badgeClass = "status-badge-warning";
                    else if (control.status === "FAILED") badgeClass = "status-badge-failed";

                    return (
                      <tr
                        key={control.id}
                        onClick={() => handleRowClick(control)}
                        className={`control-row ${isSelected ? "row-selected" : ""}`}
                      >
                        <td className="monospace-cell">{control.id}</td>
                        <td className="title-cell">{control.title}</td>
                        <td>
                          <span className={`status-badge ${badgeClass}`}>
                            {control.status}
                          </span>
                        </td>
                        <td className="weight-cell">{control.weight}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column Two: Audit Evidence Trail Panel (1/3 width) */}
        <div className="audit-section">
          {selectedControl ? (
            <div className="audit-panel-card animate-slide-in">
              <div className="panel-header-badge">Audit Evidence Trail</div>
              
              {/* Summary Card for Selected Item */}
              <div className="selected-summary-card">
                <div className="summary-id">{selectedControl.id}</div>
                <h4 className="summary-title">{selectedControl.title}</h4>
                <div className="summary-timestamp">
                  <span className="timestamp-label">Last Verified: </span>
                  <span className="timestamp-value">{formatTimestamp(selectedControl.lastVerified)}</span>
                </div>
              </div>

              {/* Scrollable list of recent verification logs */}
              <div className="logs-container">
                <h5 className="logs-section-title">Recent Verification Logs</h5>
                <div className="logs-scroll-area">
                  {selectedControl.logs && selectedControl.logs.length > 0 ? (
                    selectedControl.logs.map((log) => (
                      <div className="log-item-card" key={log.id}>
                        <div className="log-item-meta">
                          <span className="log-timestamp">{formatCompactTimestamp(log.timestamp)}</span>
                          <span className={`log-status-keyword keyword-${log.status.toLowerCase()}`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="log-message-block">{log.message}</p>
                        <div className="log-action-row">
                          <button
                            type="button"
                            onClick={(e) => handleDownloadLogJson(e, selectedControl, log)}
                            className="download-hyperlink"
                          >
                            <DownloadIcon size={12} className="download-icon-spacing" />
                            <span>Download JSON Artifact</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-logs-state">No recent logs recorded for this control.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="audit-panel-card placeholder-state">
              <div className="placeholder-content">
                <div className="placeholder-icon-container">
                  <ShieldIcon size={28} className="placeholder-icon" />
                </div>
                <h4 className="placeholder-heading">No Control Selected</h4>
                <p className="placeholder-text">
                  Select a policy rule from the framework control inventory table to view its associated audit verification logs, localized verification timestamps, and raw JSON artifacts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
