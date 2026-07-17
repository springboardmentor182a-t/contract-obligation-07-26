import React, { useState } from "react";

export default function ContractActivityChart() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const activePoints = [
    { label: "Jan", val: 40, x: 50, y: 150 },
    { label: "Feb", val: 42, x: 150, y: 144.5 },
    { label: "Mar", val: 47, x: 250, y: 130.75 },
    { label: "Apr", val: 51, x: 350, y: 119.75 },
    { label: "May", val: 54, x: 450, y: 111.5 },
    { label: "Jun", val: 58, x: 550, y: 100.5 },
    { label: "Jul", val: 61, x: 650, y: 92.25 }
  ];

  const newPoints = [
    { label: "Jan", val: 8, x: 50, y: 238 },
    { label: "Feb", val: 5, x: 150, y: 246.25 },
    { label: "Mar", val: 9, x: 250, y: 235.25 },
    { label: "Apr", val: 8, x: 350, y: 238 },
    { label: "May", val: 7, x: 450, y: 240.75 },
    { label: "Jun", val: 10, x: 550, y: 232.5 },
    { label: "Jul", val: 8, x: 650, y: 238 }
  ];

  const getLinePath = (points) => {
    return points.reduce((path, pt, index) => {
      return index === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
    }, "");
  };

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
          <line x1="50" y1="50" x2="650" y2="50" className="chart-gridline" />
          <line x1="50" y1="90" x2="650" y2="90" className="chart-gridline" />
          <line x1="50" y1="130" x2="650" y2="130" className="chart-gridline" />
          <line x1="50" y1="170" x2="650" y2="170" className="chart-gridline" />
          <line x1="50" y1="210" x2="650" y2="210" className="chart-gridline" />
          <line x1="50" y1="260" x2="650" y2="260" className="chart-gridline" />

          {/* Gradient Areas */}
          <path d={getAreaPath(activePoints, 260)} fill="url(#blueAreaGrad)" />
          <path d={getAreaPath(newPoints, 260)} fill="url(#greenAreaGrad)" />

          {/* Lines */}
          <path d={getLinePath(activePoints)} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <path d={getLinePath(newPoints)} fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />

          {/* Active dots */}
          {activePoints.map((pt, i) => (
            <g key={`act-${i}`} className="chart-point-group" 
               onMouseEnter={() => setActiveTooltip({ type: "Active", pt })}
               onMouseLeave={() => setActiveTooltip(null)}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" className="chart-dot" />
              <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" style={{ cursor: "pointer" }} />
            </g>
          ))}

          {/* New dots */}
          {newPoints.map((pt, i) => (
            <g key={`new-${i}`} className="chart-point-group" 
               onMouseEnter={() => setActiveTooltip({ type: "New", pt })}
               onMouseLeave={() => setActiveTooltip(null)}>
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
          <text x="35" y="214" textAnchor="end" className="chart-axis-label">20</text>
          <text x="35" y="174" textAnchor="end" className="chart-axis-label">40</text>
          <text x="35" y="134" textAnchor="end" className="chart-axis-label">60</text>
          <text x="35" y="94" textAnchor="end" className="chart-axis-label">80</text>
        </svg>

        {/* Custom Tooltip */}
        {activeTooltip && (
          <div 
            className="chart-tooltip" 
            style={{ 
              left: `${activeTooltip.pt.x * (100/700)}%`, 
              top: `${activeTooltip.pt.y - 65}px` 
            }}
          >
            <div className="tooltip-title">{activeTooltip.type} Contracts</div>
            <div className="tooltip-value">{activeTooltip.pt.val} Units ({activeTooltip.pt.label})</div>
          </div>
        )}

        {/* Legends */}
        <div className="chart-legends">
          <div className="legend-item">
            <span className="legend-dot bg-blue"></span>
            <span>Active</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot bg-green"></span>
            <span>New</span>
          </div>
        </div>
      </div>
    </div>
  );
}
