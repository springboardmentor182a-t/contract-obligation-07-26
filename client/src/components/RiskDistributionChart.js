import React, { useState } from "react";

export default function RiskDistributionChart() {
  const [activeDonutSegment, setActiveDonutSegment] = useState(null);

  const donutSegments = [
    { key: "Low",      value: 34, percentage: 56.67, color: "#10B981", strokeDash: "249.25 439.82", offset: "0" },
    { key: "Medium",   value: 18, percentage: 30.0,  color: "#F59E0B", strokeDash: "131.95 439.82", offset: "-249.25" },
    { key: "High",     value: 6,  percentage: 10.0,  color: "#EF4444", strokeDash: "43.98 439.82",  offset: "-381.20" },
    { key: "Critical", value: 2,  percentage: 3.33,  color: "#8B5CF6", strokeDash: "14.64 439.82",  offset: "-425.18" },
  ];

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h3 className="chart-card-title">Risk Distribution</h3>
      </div>
      <div className="donut-chart-container">
        <div className="donut-relative-wrapper">
          <svg width="200" height="200" viewBox="0 0 200 200" className="donut-svg">
            <circle
              cx="100" cy="100" r="70"
              fill="transparent"
              stroke="var(--border-color)"
              strokeWidth="18"
            />
            {donutSegments.map((seg) => (
              <circle
                key={seg.key}
                cx="100" cy="100" r="70"
                fill="transparent"
                stroke={seg.color}
                strokeWidth={activeDonutSegment === seg.key ? "22" : "18"}
                strokeDasharray={seg.strokeDash}
                strokeDashoffset={seg.offset}
                transform="rotate(-90 100 100)"
                style={{
                  transition: "stroke-width 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setActiveDonutSegment(seg.key)}
                onMouseLeave={() => setActiveDonutSegment(null)}
              />
            ))}
          </svg>
          <div className="donut-inner-content">
            <span className="donut-inner-val">
              {activeDonutSegment
                ? donutSegments.find((s) => s.key === activeDonutSegment).value
                : donutSegments.reduce((a, b) => a + b.value, 0)}
            </span>
            <span className="donut-inner-label">
              {activeDonutSegment ? `${activeDonutSegment} Risk` : "Total Cases"}
            </span>
          </div>
        </div>

        <div className="donut-legends-list">
          {donutSegments.map((seg) => (
            <div
              key={seg.key}
              className={`donut-legend-item${activeDonutSegment === seg.key ? " active" : ""}`}
              onMouseEnter={() => setActiveDonutSegment(seg.key)}
              onMouseLeave={() => setActiveDonutSegment(null)}
            >
              <div className="legend-item-left">
                <span className="legend-dot" style={{ backgroundColor: seg.color }} />
                <span>{seg.key} Risk</span>
              </div>
              <span className="legend-item-val">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
