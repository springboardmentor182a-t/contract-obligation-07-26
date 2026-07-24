import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function SystemHealth() {
  const [health, setHealth] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/contracts/system-health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Zap className="title-health-icon" />
          System Health
        </h3>
      </div>

      <div className="system-health-list">
        {health.map((item, index) => (
          <div className="health-row" key={index}>
            <span className="health-label">{item.label}</span>

            <span className={`health-status ${item.color}`}>
              <span className={`status-ping-dot ${item.color}`}></span>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}