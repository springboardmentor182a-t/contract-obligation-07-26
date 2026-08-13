import React, { useState, useEffect } from "react";
import { ShieldIcon, DownloadIcon } from "../components/Icons";
import "./Compliance.css";
import ComplianceDetailsModal from "../components/AICompliance/ComplianceDetailsModal";
import { API_BASE } from "../config/api";
import { getAuthHeaders } from "../utils/auth";
import { getComplianceDashboard } from "../services/complianceAPI";
import PriorityTasks from "../components/AICompliance/PriorityTasks";
import SummaryCards from "../components/AICompliance/SummaryCards";
import ComplianceTable from "../components/AICompliance/ComplianceTable";
import AlertsPanel from "../components/AICompliance/AlertsPanel";
import Filters from "../components/AICompliance/Filters";
export default function Compliance() {
  const [controls, setControls] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardianDashboard, setGuardianDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchControls() {
      try {
        const response = await fetch(`${API_BASE}/compliance/controls`, {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setControls(data);
        }
      } catch (err) {
        console.warn("Compliance API unavailable — waiting for backend connection.", err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchGuardianDashboard() {
  try {
    const data = await getComplianceDashboard();
    setGuardianDashboard(data);
  } catch (err) {
    console.warn(
      "AI Compliance Guardian unavailable.",
      err
    );
  }
}
    fetchControls();
    fetchGuardianDashboard();
  }, []);

  // Deduplicate controls by ID to guarantee clean unique list
  const uniqueControls = Array.from(
    new Map(controls.map((item) => [item.id, item])).values()
  );

  // Metrics summary data calculated dynamically from backend data
  const totalControls = uniqueControls.length;
  const passedChecks = uniqueControls.filter((c) => c.status === "PASSED").length;
  const warningsOutstanding = uniqueControls.filter((c) => c.status === "WARNING").length;
  const failedPolicies = uniqueControls.filter((c) => c.status === "FAILED").length;

  const totalWeight = uniqueControls.reduce((sum, c) => sum + (c.weight || 0), 0);
  const overallScore = totalControls > 0 ? Math.round(totalWeight / totalControls) : 100;

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
  const filteredRecords =
  guardianDashboard?.records?.filter((record) => {

    const matchesSearch =
      record.contract_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.vendor
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === "All" ||
      record.risk_level === riskFilter;

    const matchesStatus =
      statusFilter === "All" ||
      record.compliance_status === statusFilter;

    return (
      matchesSearch &&
      matchesRisk &&
      matchesStatus
    );

  }) || [];

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
        {/* {guardianDashboard && (
              <SummaryCards
                  data={guardianDashboard.summary}
              />
          )} */}
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
      <section className="ai-guardian-wrapper">

    <div className="ai-guardian-header">
        <h3>AI Compliance Guardian</h3>

        <p>
            Continuously monitors compliance activities,
            identifies risks before they become violations,
            and recommends corrective actions.
        </p>
    </div>

    {guardianDashboard && (
    <>
        <SummaryCards
            data={guardianDashboard.summary}
        />

        <PriorityTasks
    data={guardianDashboard.priority_tasks}
    onReview={(task) => {
        const record = guardianDashboard.records.find(
            (r) => r.contract_id === task.contract_id
        );

        if (record) {
            setSelectedRecord(record);
            setShowModal(true);
        }
    }}
/>

        <Filters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
        />

        <ComplianceTable
            data={filteredRecords}
        />

        <AlertsPanel
            alerts={guardianDashboard.alerts}
        />
        <ComplianceDetailsModal
    isOpen={showModal}
    record={selectedRecord}
    onClose={() => {
        setShowModal(false);
        setSelectedRecord(null);
    }}
/>
    </>
)}

</section>

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
                  {loading ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>
                        Loading compliance controls...
                      </td>
                    </tr>
                  ) : uniqueControls.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>
                        No compliance controls found.
                      </td>
                    </tr>
                  ) : (
                    uniqueControls.map((control) => {
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
                    })
                  )}
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
                          <span className={`log-status-keyword keyword-${(log.status || "").toLowerCase()}`}>
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
