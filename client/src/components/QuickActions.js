import React from "react";

export default function QuickActions() {
  return (
    <div className="quick-actions-bar">
      <span className="quick-actions-label">QUICK ACTIONS:</span>
      <div className="quick-actions-buttons">
        <button className="action-pill color-blue">Add User</button>
        <button className="action-pill color-green">Generate Report</button>
        <button className="action-pill color-orange">Review Risks</button>
        <button className="action-pill color-purple">Export Analytics</button>
      </div>
    </div>
  );
}
