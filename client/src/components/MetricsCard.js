import React from "react";
import {
  FaFileContract,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaSyncAlt,
  FaClipboardList
} from "react-icons/fa";

function MetricsCard({ title, value, color, percentage }) {
  const getIcon = () => {
    switch (title) {
      case "Total Contracts":
        return <FaFileContract />;
      case "Renewing Soon":
        return <FaCalendarCheck />;
      case "Expired":
        return <FaExclamationTriangle />;
      case "Auto Renewal":
        return <FaSyncAlt />;
      case "Manual Renewal":
        return <FaClipboardList />;
      default:
        return <FaFileContract />;
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 22,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderTop: `4px solid ${color}`,
        transition: "0.3s"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: color,
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 22
          }}
        >
          {getIcon()}
        </div>

        {percentage && (
          <span
            style={{
              color: percentage.startsWith("-") ? "#DC2626" : "#16A34A",
              fontWeight: "bold",
              fontSize: 14
            }}
          >
            {percentage}
          </span>
        )}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: 15,
          marginBottom: 8
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: "700",
          color: "#222"
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default MetricsCard;