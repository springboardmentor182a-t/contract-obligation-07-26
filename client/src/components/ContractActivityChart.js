import React, { useState, useEffect } from "react";

export default function ContractActivityChart() {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activePoints, setActivePoints] = useState([]);
  const [newPoints, setNewPoints] = useState([]);

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/contracts/activity-chart")
    .then((res) => res.json())
    .then((data) => {
      setActivePoints(data.activePoints);
      setNewPoints(data.newPoints);
    })
    .catch((err) => console.error(err));
}, []);
 

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
