import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import api from "../api";

export default function SystemHealth() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }, []);

  const apiStatus = status === "ok" ? { label: "Operational", cls: "green" }
    : status === "error" ? { label: "Unreachable", cls: "red" }
      : { label: "Checking...", cls: "orange" };

  const rows = [
    { label: "API Server", ...apiStatus },
    { label: "Database", label2: "SQLite", ...apiStatus },
    { label: "Auth Service", label2: "JWT", ...apiStatus },
  ];

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Zap className="title-health-icon" />
          System Health
        </h3>
      </div>
      <div className="system-health-list">
        {rows.map(row => (
          <div className="health-row" key={row.label}>
            <span className="health-label">{row.label}</span>
            <span className={`health-status ${row.cls}`}>
              <span className={`status-ping-dot ${row.cls}`}></span>
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
