import React from "react";
import {
  FaPlusCircle,
  FaBell,
  FaFileExport,
  FaSyncAlt
} from "react-icons/fa";

function QuickActions() {

  const actions = [
    {
      title: "Add Renewal",
      subtitle: "Create new renewal",
      color: "#6C4CFF",
      icon: <FaPlusCircle />
    },
    {
      title: "Send Reminder",
      subtitle: "Notify stakeholders",
      color: "#F59E0B",
      icon: <FaBell />
    },
    {
      title: "Export Report",
      subtitle: "Download analytics",
      color: "#10B981",
      icon: <FaFileExport />
    },
    {
      title: "Sync Contracts",
      subtitle: "Update records",
      color: "#3B82F6",
      icon: <FaSyncAlt />
    }
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,.08)"
      }}
    >

      <h3
        style={{
          marginTop: 0,
          marginBottom: 5
        }}
      >
        Quick Actions
      </h3>

      <p
        style={{
          color: "#777",
          fontSize: 13,
          marginBottom: 25
        }}
      >
        Frequently used actions
      </p>

      {actions.map((item, index) => (

        <button
          key={index}
          style={{
            width: "100%",
            border: "none",
            background: "#F8F9FD",
            borderRadius: 14,
            padding: 16,
            marginBottom: 15,
            display: "flex",
            alignItems: "center",
            cursor: "pointer"
          }}
        >

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: item.color,
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              marginRight: 15
            }}
          >
            {item.icon}
          </div>

          <div
            style={{
              textAlign: "left"
            }}
          >
            <div
              style={{
                fontWeight: "600",
                color: "#222"
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#777",
                marginTop: 3
              }}
            >
              {item.subtitle}
            </div>
          </div>

        </button>

      ))}

    </div>
  );

}

export default QuickActions;