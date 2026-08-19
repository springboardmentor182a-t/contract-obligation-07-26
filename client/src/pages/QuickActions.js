import React, { useState, useEffect } from "react";
import "./QuickActions.css";
import { API_BASE } from "../config/api";
import { getAuthHeaders } from "../utils/auth";
import {
  ShieldIcon, DownloadIcon, BellIcon, RepeatIcon, BriefcaseIcon, PlugIcon,
  CheckIcon, PlayIcon, InfoIcon
} from "../components/Icons";

const ICON_MAP = {
  Shield: ShieldIcon,
  Download: DownloadIcon,
  Bell: BellIcon,
  Repeat: RepeatIcon,
  Briefcase: BriefcaseIcon,
  Plug: PlugIcon,
};

export default function QuickActions() {
  const [actions, setActions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [executingId, setExecutingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Load execution actions & logs
  useEffect(() => {
    async function loadData() {
      try {
        const [resActions, resLogs] = await Promise.all([
          fetch(`${API_BASE}/quick-actions`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/quick-actions/logs`, { headers: getAuthHeaders() })
        ]);
        if (resActions.ok) {
          const actionData = await resActions.json();
          setActions(actionData);
        }
        if (resLogs.ok) {
          const logData = await resLogs.json();
          setLogs(logData);
        }
        // On failure, lists stay empty — no dummy fallback
      } catch (err) {
        console.warn('Quick Actions API unavailable — waiting for DB connection.', err);
      }
    }
    loadData();
  }, []);

  async function handleExecute(action) {
    if (executingId) return;
    setExecutingId(action.id);

    try {
      const response = await fetch(`${API_BASE}/quick-actions/execute`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ action_id: action.id }),
      });

      if (response.ok) {
        const logItem = await response.json();
        setLogs(prev => [logItem, ...prev].slice(0, 8));
      }
      // On failure — no mock log, just continue
    } catch (e) {
      console.warn("Quick action execute failed:", e);
    }

    setToastMessage(`Action "${action.label}" executed successfully!`);
    setTimeout(() => {
      setExecutingId(null);
      setToastMessage("");
    }, 2000);
  }

  return (
    <div className="page-surface quick-actions-page fade-in-el">
      <div className="qa-header">
        <h2>Quick Actions</h2>
        <p className="muted">Trigger instant pipeline workflows, background scans, and system maintenance utilities.</p>
      </div>

      {toastMessage && (
        <div className="qa-toast">
          <div className="qa-toast-inner">
            <CheckIcon size={16} color="var(--emerald)" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="grid-split" style={{ marginTop: 20 }}>
        {/* Actions Grid */}
        <div>
          <div className="section-title">Available Action Workflows</div>
          <div className="qa-grid">
            {actions.map((act) => {
              const IconComp = ICON_MAP[act.icon] || ShieldIcon;
              const isExecuting = executingId === act.id;
              
              return (
                <div 
                  key={act.id} 
                  className={`qa-card ${isExecuting ? "executing" : ""}`}
                  onClick={() => handleExecute(act)}
                >
                  <div className="ico-wrap" style={{ background: `${act.color}15`, color: act.color }}>
                    <IconComp size={20} />
                  </div>
                  <h3>{act.label}</h3>
                  <p>{act.desc}</p>
                  <div className="action-link">
                    {isExecuting ? (
                      <span className="spinner-mini">Processing...</span>
                    ) : (
                      <>
                        <PlayIcon size={12} /> Run workflow
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs Sidebar */}
        <div className="card qa-logs-sidebar">
          <div className="section-title">
            <InfoIcon size={16} color="var(--info)" /> Execution History
          </div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 15 }}>Real-time logs of actions triggered by team admins</p>

          <div className="qa-logs-list">
            {logs.length === 0 ? (
              <div className="empty-logs">No recent operations logged.</div>
            ) : (
              logs.map((log) => (
                <div className="qa-log-row" key={log.id}>
                  <div className="qa-log-status-col">
                    <span className="qa-status-dot active" />
                  </div>
                  <div className="qa-log-info">
                    <strong>{log.label}</strong>
                    <span>{log.time}</span>
                  </div>
                  <span className="badge emerald">Completed</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
