import "./Renewals.css";
import { formatCurrency } from "../utils/formatCurrency";

const RENEWALS = [
  { code: "CTR-2024-005", name: "Darwinbox", value: 54000, daysLeft: 25 },
  { code: "CTR-2024-003", name: "SafeHaul Logistics", value: 68000, daysLeft: 5 },
  { code: "CTR-2024-011", name: "Zoho People", value: 21000, daysLeft: 41 },
  { code: "CTR-2024-014", name: "AWS Enterprise", value: 310000, daysLeft: 58 },
  { code: "CTR-2024-004", name: "Prism Co.", value: 132500, daysLeft: 78 },
  { code: "CTR-2024-018", name: "Figma Org Plan", value: 14400, daysLeft: 89 },
];

function riskColor(days) {
  if (days <= 14) return "#EF4444";
  if (days <= 45) return "#F59E0B";
  return "#10B981";
}

export default function Renewals() {
  const within30 = RENEWALS.filter((r) => r.daysLeft <= 30).length;
  const within60 = RENEWALS.filter((r) => r.daysLeft > 30 && r.daysLeft <= 60).length;
  const within90 = RENEWALS.filter((r) => r.daysLeft > 60).length;
  const sorted = [...RENEWALS].sort((a, b) => a.daysLeft - b.daysLeft);
  const maxDays = Math.max(...RENEWALS.map((r) => r.daysLeft), 90);

  return (
    <div className="page-surface renewals-page">
      <h2>Renewal Dashboard</h2>
      <p className="muted">Overview of upcoming and due renewals.</p>

      <div className="kpi-grid" style={{ marginTop: 18 }}>
        <div className="kpi-card"><div className="kpi-val" style={{ color: "#EF4444" }}>{within30}</div><div className="kpi-lbl">Within 30 Days</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: "#F59E0B" }}>{within60}</div><div className="kpi-lbl">31\u201360 Days</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: "#10B981" }}>{within90}</div><div className="kpi-lbl">60+ Days</div></div>
        <div className="kpi-card"><div className="kpi-val">{RENEWALS.length}</div><div className="kpi-lbl">Total Upcoming</div></div>
      </div>

      <div className="section-title" style={{ marginTop: 22 }}>Renewal Timeline</div>
      {sorted.map((r) => (
        <div className="renewal-row" key={r.code}>
          <div className="renewal-row-top">
            <strong>{r.code} <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>\u2014 {r.name}</span></strong>
            <span style={{ fontWeight: 700, color: riskColor(r.daysLeft) }}>{r.daysLeft}d left \u00b7 {formatCurrency(r.value)}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: Math.max(4, 100 - (r.daysLeft / maxDays) * 100) + "%", background: riskColor(r.daysLeft) }} />
          </div>
        </div>
      ))}
    </div>
  );
}
