import React, { useState } from "react";

function TaskTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("All Tasks");

  const tabs = [
    "All Tasks",
    "My Tasks",
    "Completed",
    "Overdue",
  ];

  const handleClick = (tab) => {
    setActiveTab(tab);

    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "25px",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border:
              activeTab === tab
                ? "none"
                : "1px solid #ddd",
            cursor: "pointer",
            background:
              activeTab === tab
                ? "#5B2EFF"
                : "#fff",
            color:
              activeTab === tab
                ? "#fff"
                : "#333",
            fontWeight: "600",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default TaskTabs;