import React from "react";
import {
    FileText,
    CheckCircle,
    Clock3,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

const summaryData = [
    {
        title: "Total Contracts",
        value: "248",
        icon: <FileText size={22} />,
        color: "#DBEAFE",
        iconColor: "#2563EB",
    },
    {
        title: "Active",
        value: "186",
        icon: <CheckCircle size={22} />,
        color: "#DCFCE7",
        iconColor: "#16A34A",
    },
    {
        title: "Expiring Soon",
        value: "24",
        icon: <Clock3 size={22} />,
        color: "#FEF3C7",
        iconColor: "#D97706",
    },
    {
        title: "High Risk",
        value: "12",
        icon: <AlertTriangle size={22} />,
        color: "#FEE2E2",
        iconColor: "#DC2626",
    },
    {
        title: "Compliant",
        value: "91%",
        icon: <ShieldCheck size={22} />,
        color: "#E0F2FE",
        iconColor: "#0284C7",
    },
];

export default function SummaryCards() {
    return (
        <div className="contract-summary-grid">
            {summaryData.map((card, index) => (
                <div key={index} className="contract-summary-card">
                    <div
                        className="summary-icon"
                        style={{
                            background: card.color,
                            color: card.iconColor,
                        }}
                    >
                        {card.icon}
                    </div>

                    <div className="summary-content">
                        <h3>{card.value}</h3>
                        <p>{card.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}