import {
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  FileWarning,
  ShieldCheck,
  Clock,
} from "lucide-react";

const cards = [
  {
    key: "total_contracts",
    title: "Total Contracts",
    icon: ClipboardList,
    border: "border-blue",
    valueClass: "text-blue",
  },
  {
    key: "compliant_contracts",
    title: "Compliant",
    icon: CheckCircle,
    border: "border-green",
    valueClass: "text-green",
  },
  {
    key: "high_risk_contracts",
    title: "High Risk",
    icon: AlertTriangle,
    border: "border-red",
    valueClass: "text-red",
  },
  {
    key: "missing_documents",
    title: "Missing Documents",
    icon: FileWarning,
    border: "border-amber",
    valueClass: "text-amber",
  },
  {
    key: "missing_approvals",
    title: "Missing Approvals",
    icon: ShieldCheck,
    border: "border-purple",
    valueClass: "text-purple",
  },
  {
    key: "overdue_obligations",
    title: "Overdue Obligations",
    icon: Clock,
    border: "border-red",
    valueClass: "text-red",
  },
];

export default function SummaryCards({ data }) {
  if (!data) return null;

  return (
    <div className="metrics-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className={`metric-indicator-card ${card.border}`}
          >
            <div className="metric-header">
              <span className="metric-label">
                {card.title}
              </span>

              <span className={card.valueClass}>
                <Icon size={18} />
              </span>
            </div>

            <div className={`metric-value ${card.valueClass}`}>
              {data[card.key] ?? 0}
            </div>
          </div>
        );
      })}
    </div>
  );
}