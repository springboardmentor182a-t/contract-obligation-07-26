import React, { useMemo, useState } from "react";

const DEFAULT_RISK_LEVELS = [
  { key: "Low", color: "#10B981" },
  { key: "Medium", color: "#F59E0B" },
  { key: "High", color: "#EF4444" },
  { key: "Critical", color: "#8B5CF6" },
];

export default function RiskDistributionChart({ riskDistribution = [] }) {
  const [activeDonutSegment, setActiveDonutSegment] = useState(null);

  const donutSegments = useMemo(() => {
    const map = new Map((riskDistribution || []).map((entry) => [entry.key, entry]));
    const segments = DEFAULT_RISK_LEVELS.map((level) => {
      const entry = map.get(level.key) || { key: level.key, value: 0, percentage: 0, color: level.color };
      return {
        ...entry,
        color: entry.color || level.color,
      };
    });

    const total = segments.reduce((sum, item) => sum + Number(item.value || 0), 0);
    let accumulated = 0;
    return segments.map((segment) => {
      const value = Number(segment.value || 0);
      const fraction = total ? value / total : 0;
      const strokeDash = `${fraction * 439.82} 439.82`;
      const offset = `-${accumulated}`;
      accumulated += fraction * 439.82;
      return {
        ...segment,
        strokeDash,
        offset,
      };
    });
  }, [riskDistribution]);

  const totalCases = donutSegments.reduce((sum, item) => sum + Number(item.value || 0), 0);

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
                ? donutSegments.find((s) => s.key === activeDonutSegment)?.value ?? 0
                : totalCases}
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
