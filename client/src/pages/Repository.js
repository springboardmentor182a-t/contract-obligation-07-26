import { useState } from "react";
import "./Repository.css";
import { STATUS_LABELS } from "../data/constants";
import { formatCurrency } from "../utils/formatCurrency";
import ButtonGroup from "../components/Buttons/ButtonGroup";

const CONTRACTS = [
  { id: "CTR-2024-001", name: "MSA \u2014 Cloudline Inc.", counterparty: "Cloudline Inc.", type: "Master Service Agreement", value: 240000, expiry: "Dec 1, 2026", status: "active" },
  { id: "CTR-2024-002", name: "DPA \u2014 Northbridge Ltd.", counterparty: "Northbridge Ltd.", type: "Data Processing Addendum", value: 0, expiry: "Jan 15, 2027", status: "active" },
  { id: "CTR-2024-003", name: "Vendor Agreement \u2014 SafeHaul", counterparty: "SafeHaul Logistics", type: "Vendor Agreement", value: 68000, expiry: "Jul 3, 2026", status: "pending" },
  { id: "CTR-2024-004", name: "Services Agreement \u2014 Prism Co.", counterparty: "Prism Co.", type: "Services Agreement", value: 132500, expiry: "Aug 1, 2026", status: "active" },
  { id: "CTR-2024-005", name: "SaaS Subscription \u2014 Darwinbox", counterparty: "Darwinbox", type: "SaaS Subscription", value: 54000, expiry: "Aug 2, 2026", status: "active" },
  { id: "CTR-2024-006", name: "Audit Engagement \u2014 Deloitte", counterparty: "Deloitte", type: "Professional Services", value: 88000, expiry: "Nov 20, 2026", status: "pending" },
  { id: "CTR-2024-007", name: "Retainer \u2014 Ogilvy", counterparty: "Ogilvy", type: "Marketing Retainer", value: 96000, expiry: "Feb 10, 2027", status: "draft" },
  { id: "CTR-2024-008", name: "NDA \u2014 Partner Co.", counterparty: "Partner Co.", type: "Non-Disclosure Agreement", value: 0, expiry: "Mar 4, 2026", status: "expired" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending Signature" },
  { key: "draft", label: "Draft" },
  { key: "expired", label: "Expired" },
];

export default function Repository() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = CONTRACTS.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesQuery = !q || (c.name + " " + c.counterparty + " " + c.type).toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="page-surface repository-page">
      <div className="page-head">
        <div>
          <h2>Contract Repository</h2>
          <p className="muted">{CONTRACTS.length} contracts across every counterparty and status.</p>
        </div>
        <button className="quick-action">+ New Contract</button>
      </div>

      <div className="repo-controls">
        <input
          className="repo-search"
          placeholder="Search contracts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ButtonGroup options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Contract</th><th>Counterparty</th><th>Type</th><th>Value</th><th>Expiry</th><th>Status</th></tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td><strong>{c.name}</strong></td>
              <td>{c.counterparty}</td>
              <td>{c.type}</td>
              <td>{formatCurrency(c.value)}</td>
              <td>{c.expiry}</td>
              <td>
                <span className="badge-pill" style={{ background: statusBg(c.status), color: statusColor(c.status) }}>
                  {STATUS_LABELS[c.status]}
                </span>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)", padding: 30 }}>No contracts match your filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function statusColor(status) {
  return { active: "#0d9668", pending: "#B45309", draft: "#2563EB", expired: "#DC2626" }[status] || "#334155";
}
function statusBg(status) {
  return { active: "rgba(16,185,129,0.12)", pending: "rgba(245,158,11,0.13)", draft: "rgba(59,130,246,0.12)", expired: "rgba(239,68,68,0.12)" }[status] || "#F1F5F9";
}
