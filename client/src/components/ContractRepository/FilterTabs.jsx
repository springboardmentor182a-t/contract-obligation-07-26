import React from "react";

const tabs = [
    { id: "all", label: "All Contracts" },
    { id: "active", label: "Active" },
    { id: "expiring", label: "Expiring Soon" },
    { id: "draft", label: "Draft" },
    { id: "expired", label: "Expired" },
];

export default function FilterTabs({
    activeTab,
    setActiveTab,
}) {
    return (
        <div className="filter-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`filter-tab ${
                        activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}