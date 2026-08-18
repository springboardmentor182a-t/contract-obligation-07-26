import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ContractActivityChart({ stats = {} }) {
  const data = [
    { name: "Upcoming", value: stats.upcoming ?? 0, color: "#6366f1" },
    { name: "In Progress", value: stats.in_progress ?? 0, color: "#f59e0b" },
    { name: "Renewed", value: stats.renewed ?? 0, color: "#10b981" },
    { name: "Expired", value: stats.expired ?? 0, color: "#ef4444" },
    { name: "Cancelled", value: stats.cancelled ?? 0, color: "#64748b" },
  ];

  return (
    <div className="card" style={{ padding: "1.5rem", height: "100%" }}>
      <div className="chart-header" style={{ marginBottom: "1.25rem" }}>
        <h3 className="chart-card-title">Renewal Status Breakdown</h3>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600", background: "rgba(99,102,241,0.1)", padding: "3px 8px", borderRadius: "99px", color: "#6366f1" }}>
          LIVE
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "12px" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
