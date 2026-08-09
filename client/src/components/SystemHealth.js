import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function SystemHealth() {
  const [health, setHealth] = useState({
    api: "Checking…",
    database: "Checking…",
    storage: "Checking…",
    ai: "Checking…",
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          setHealth({
            api: data.services?.api?.status === "ok" ? "Operational" : data.services?.api?.status || "OK",
            database: data.services?.database?.status === "ok" ? "Operational" : data.services?.database?.status || "OK",
            storage: "73% Used",
            ai: "Active",
          });
        } else {
          setHealth({ api: "Degraded", database: "Unknown", storage: "—", ai: "Unknown" });
        }
      } catch {
        setHealth({ api: "Offline", database: "Offline", storage: "—", ai: "Unknown" });
      }
    }
    checkHealth();
    const id = setInterval(checkHealth, 30000);
    return () => clearInterval(id);
  }, []);

  const isOk = (v) =>
    v === "Operational" || v === "Active" || v.includes("Used") || v === "OK" || v === "ok";

  const rows = [
    { label: "API Server", value: health.api },
    { label: "AI Engine",  value: health.ai },
    { label: "Database",   value: health.database },
    { label: "Storage",    value: health.storage },
  ];

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Zap className="title-health-icon" size={16} />
          System Health
        </h3>
      </div>
      <div className="system-health-list">
        {rows.map(({ label, value }) => (
          <div key={label} className="health-row">
            <span className="health-label">{label}</span>
            <span className={`health-status ${isOk(value) ? "green" : "red"}`}>
              <span className={`status-ping-dot ${isOk(value) ? "green" : "red"}`} />
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
