import React from "react";
import {
  FaFileContract,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaSyncAlt,
  FaClipboardList
} from "react-icons/fa";

function MetricsCard({ title, value, color }) {
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

  const getPercentage = () => {
    switch (title) {
      case "Total Contracts":
        return "+12%";
      case "Renewing Soon":
        return "+8%";
      case "Expired":
        return "-3%";
      case "Auto Renewal":
        return "+15%";
      case "Manual Renewal":
        return "+5%";
      default:
        return "";
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
        transition: "0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
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
            fontSize: 22,
          }}
        >
          {getIcon()}
        </div>

        <span
          style={{
            color: "#16A34A",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {getPercentage()}
        </span>
      </div>

      <div
        style={{
          color: "#666",
          fontSize: 15,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: "700",
          color: "#222",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default MetricsCard;