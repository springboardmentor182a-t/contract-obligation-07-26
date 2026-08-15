import React from "react";

function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${
        status === "Active" ? "active" : "inactive"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;