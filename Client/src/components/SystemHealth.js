import React from "react";
import { Zap } from "lucide-react";

export default function SystemHealth() {
  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Zap className="title-health-icon" />
          System Health
        </h3>
      </div>
      <div className="system-health-list">
        <div className="health-row">
          <span className="health-label">API Server</span>
          <span className="health-status green">
            <span className="status-ping-dot green"></span>
            Operational
          </span>
        </div>

        <div className="health-row">
          <span className="health-label">AI Engine</span>
          <span className="health-status green">
            <span className="status-ping-dot green"></span>
            Active
          </span>
        </div>

        <div className="health-row">
          <span className="health-label">Database</span>
          <span className="health-status green">
            <span className="status-ping-dot green"></span>
            Operational
          </span>
        </div>

        <div className="health-row">
          <span className="health-label">Storage</span>
          <span className="health-status green">
            <span className="status-ping-dot green"></span>
            73% Used
          </span>
        </div>
      </div>
    </div>
  );
}
