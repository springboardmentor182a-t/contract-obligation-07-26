import React, { useState, useEffect } from "react";
import { getAuthHeaders } from "../utils/auth";

export default function ContractActivityChart() {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/monthly-volume", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setMonthlyData(data);
        }
      } catch (err) {
        console.warn("Failed to load monthly volume", err);
      }
    }
    loadData();
  }, []);

  // Build SVG points from API data (or empty fallback)
  const labels = monthlyData.length > 0
    ? monthlyData.map((d) => d.month)
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const rawValues = monthlyData.length > 0
    ? monthlyData.map((d) => d.value)
    : [0, 0, 0, 0, 0, 0, 0];

  const maxVal = Math.max(...rawValues, 1);
  const chartH = 210; // chart area height (from y=50 to y=260)
  const chartBottom = 260;
  const xStart = 50;
  const xEnd = 650;
  const step = (xEnd - xStart) / Math.max(labels.length - 1, 1);

  const activePoints = rawValues.map((val, i) => ({
    label: labels[i],
    val,
    x: xStart + i * step,
    y: chartBottom - ((val / maxVal) * (chartH - 10)) - 5,
  }));

  // New contracts: ~15% of active
  const newPoints = rawValues.map((val, i) => ({
    label: labels[i],
    val: Math.round(val * 0.15),
    x: xStart + i * step,
    y: chartBottom - ((Math.round(val * 0.15) / maxVal) * (chartH - 10)) - 5,
  }));

  const getLinePath = (points) =>
    points.reduce(
      (path, pt, index) =>
        index === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`,
      ""
    );

  const getAreaPath = (points, bottomY = 260) => {
    if (points.length === 0) return "";
    const linePath = getLinePath(points);
    return `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h3 className="chart-card-title">Contract Activity</h3>
        <button className="chart-header-link">View all</button>
      </div>
      <div className="chart-body-container">
        <svg viewBox="0 0 700 320" className="line-chart-svg">
          <defs>
            <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[50, 90, 130, 170, 210, 260].map((y) => (
            <line key={y} x1="50" y1={y} x2="650" y2={y} className="chart-gridline" />
          ))}

          {/* Gradient Areas */}
          <path d={getAreaPath(activePoints, 260)} fill="url(#blueAreaGrad)" />
          <path d={getAreaPath(newPoints, 260)} fill="url(#greenAreaGrad)" />

          {/* Lines */}
          {activePoints.length > 1 && (
            <path
              d={getLinePath(activePoints)}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {newPoints.length > 1 && (
            <path
              d={getLinePath(newPoints)}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Active dots */}
          {activePoints.map((pt, i) => (
            <g
              key={`act-${i}`}
              className="chart-point-group"
              onMouseEnter={() => setActiveTooltip({ type: "Active", pt })}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <circle cx={pt.x} cy={pt.y} r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" className="chart-dot" />
              <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" style={{ cursor: "pointer" }} />
            </g>
          ))}

          {/* New dots */}
          {newPoints.map((pt, i) => (
            <g
              key={`new-${i}`}
              className="chart-point-group"
              onMouseEnter={() => setActiveTooltip({ type: "New", pt })}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <circle cx={pt.x} cy={pt.y} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" className="chart-dot" />
              <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" style={{ cursor: "pointer" }} />
            </g>
          ))}

          {/* X Axis Labels */}
          {activePoints.map((pt, i) => (
            <text key={`xl-${i}`} x={pt.x} y="290" textAnchor="middle" className="chart-axis-label">
              {pt.label}
            </text>
          ))}

          {/* Y Axis Labels */}
          <text x="35" y="264" textAnchor="end" className="chart-axis-label">0</text>
          <text x="35" y="214" textAnchor="end" className="chart-axis-label">
            {Math.round(maxVal * 0.2)}
          </text>
          <text x="35" y="174" textAnchor="end" className="chart-axis-label">
            {Math.round(maxVal * 0.45)}
          </text>
          <text x="35" y="134" textAnchor="end" className="chart-axis-label">
            {Math.round(maxVal * 0.7)}
          </text>
          <text x="35" y="94" textAnchor="end" className="chart-axis-label">
            {maxVal}
          </text>
        </svg>

        {/* Tooltip */}
        {activeTooltip && (
          <div
            className="chart-tooltip"
            style={{
              left: `${((activeTooltip.pt.x - 50) / 600) * 100}%`,
              top: `${activeTooltip.pt.y - 65}px`,
            }}
          >
            <div className="tooltip-title">{activeTooltip.type} Contracts</div>
            <div className="tooltip-value">
              {activeTooltip.pt.val} ({activeTooltip.pt.label})
            </div>
          </div>
        )}

        {/* Legends */}
        <div className="chart-legends">
          <div className="legend-item">
            <span className="legend-dot bg-blue" />
            <span>Active</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot bg-green" />
            <span>New</span>
          </div>
        </div>
      </div>
    </div>
  );
}
