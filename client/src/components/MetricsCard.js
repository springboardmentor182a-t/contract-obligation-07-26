import React from "react";
import {
  FaFileContract,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaSyncAlt,
  FaClipboardList
} from "react-icons/fa";

function MetricsCard({ title, value, percentage }) {
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
        return null;
    }
  };

  const getIconColor = () => {
    switch (title) {
      case "Total Contracts":
        return {
          background: "#EDE9FE",
          color: "#7C3AED"
        };

      case "Renewing Soon":
        return {
          background: "#FEF3C7",
          color: "#D97706"
        };

      case "Expired":
        return {
          background: "#FEE2E2",
          color: "#DC2626"
        };

      case "Auto Renewal":
        return {
          background: "#D1FAE5",
          color: "#059669"
        };

      case "Manual Renewal":
        return {
          background: "#DBEAFE",
          color: "#2563EB"
        };

      default:
        return {
          background: "#F1F1F1",
          color: "#555"
        };
    }
  };

  const iconStyle = getIconColor();

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
        transition: "0.3s"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        {/* ICON */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: iconStyle.background,
            color: iconStyle.color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18
          }}
        >
          {getIcon()}
        </div>

        {/* PERCENTAGE */}
        {percentage && (
          <span
            style={{
              color: percentage.startsWith("-")
                ? "#DC2626"
                : "#16A34A",
              fontWeight: "bold",
              fontSize: 12
            }}
          >
            {percentage}
          </span>
        )}
      </div>

      {/* TITLE */}
      <div
        style={{
          color: "#666",
          fontSize: 14,
          marginBottom: 5
        }}
      >
        {title}
      </div>

      {/* VALUE */}
      <div
        style={{
          fontSize: 26,
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