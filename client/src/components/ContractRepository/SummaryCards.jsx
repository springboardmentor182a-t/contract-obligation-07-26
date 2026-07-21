import React from "react";
import {
    FileText,
    CheckCircle,
    Clock3,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

export default function SummaryCards({ contracts = [] }) {

    const totalContracts = contracts.length;

    const activeContracts = contracts.filter(
        (c) => c.status?.toLowerCase() === "active"
    ).length;

    const highRiskContracts = contracts.filter(
        (c) => c.risk_level?.toLowerCase() === "high"
    ).length;

    const expiringSoon = contracts.filter((contract) => {
        if (!contract.end_date) return false;

        const today = new Date();
        const end = new Date(contract.end_date);

        const diff =
            (end - today) / (1000 * 60 * 60 * 24);

        return diff >= 0 && diff <= 30;
    }).length;

    const compliant =
        totalContracts === 0
            ? 0
            : Math.round(
                  ((totalContracts - highRiskContracts) /
                      totalContracts) *
                      100
              );

    const summaryData = [
        {
            title: "Total Contracts",
            value: totalContracts,
            icon: <FileText size={22} />,
            color: "#DBEAFE",
            iconColor: "#2563EB",
        },
        {
            title: "Active",
            value: activeContracts,
            icon: <CheckCircle size={22} />,
            color: "#DCFCE7",
            iconColor: "#16A34A",
        },
        {
            title: "Expiring Soon",
            value: expiringSoon,
            icon: <Clock3 size={22} />,
            color: "#FEF3C7",
            iconColor: "#D97706",
        },
        {
            title: "High Risk",
            value: highRiskContracts,
            icon: <AlertTriangle size={22} />,
            color: "#FEE2E2",
            iconColor: "#DC2626",
        },
        {
            title: "Compliant",
            value: `${compliant}%`,
            icon: <ShieldCheck size={22} />,
            color: "#E0F2FE",
            iconColor: "#0284C7",
        },
    ];

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