import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function RiskDistributionChart({ stats = {} }) {
  const data = [
    { name: "Expiring ≤30d", value: stats.expiring_in_30_days ?? 0, color: "#ef4444" },
    { name: "Expiring 31-60d", value: Math.max(0, (stats.expiring_in_60_days ?? 0) - (stats.expiring_in_30_days ?? 0)), color: "#f97316" },
    { name: "Expiring 61-90d", value: Math.max(0, (stats.expiring_in_90_days ?? 0) - (stats.expiring_in_60_days ?? 0)), color: "#f59e0b" },
    { name: "Renewed", value: stats.renewed ?? 0, color: "#10b981" },
    { name: "Cancelled", value: stats.cancelled ?? 0, color: "#64748b" },
  ].filter(d => d.value > 0);

  const empty = data.length === 0;

  return (
    <div className="card" style={{ padding: "1.5rem", height: "100%" }}>
      <div className="chart-header" style={{ marginBottom: "1.25rem" }}>
        <h3 className="chart-card-title">Expiry Risk Distribution</h3>
        <span style={{ fontSize: "0.72rem", fontWeight: "600", background: "rgba(239,68,68,0.1)", padding: "3px 8px", borderRadius: "99px", color: "#ef4444" }}>
          RISK VIEW
        </span>
      </div>
      {empty ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "220px", color: "var(--text-muted)", fontSize: "13px" }}>
          No expiry data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "12px" }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
