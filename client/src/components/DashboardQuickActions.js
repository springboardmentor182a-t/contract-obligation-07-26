import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: "Add User",         path: "/user-management", colorClass: "color-blue" },
    { label: "Generate Report",  path: "/reports",         colorClass: "color-green" },
    { label: "Review Risks",     path: "/compliance",      colorClass: "color-orange" },
    { label: "Export Analytics", path: "/reports",         colorClass: "color-purple" },
    { label: "View Renewals",    path: "/renewal-dashboard", colorClass: "color-teal" },
  ];

  return (
    <div className="quick-actions-bar">
      <span className="quick-actions-label">QUICK ACTIONS:</span>
      <div className="quick-actions-buttons">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`action-pill ${a.colorClass}`}
            onClick={() => navigate(a.path)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
