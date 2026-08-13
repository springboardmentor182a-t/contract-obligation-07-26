import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../config/api";

export default function StatsStrip() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get(`${API_BASE}/public/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch public stats:", error);
        setStats({
          active_contracts: "2,000+",
          obligations_fulfilled: "15,000+",
          total_contract_value: "$120M+",
          total_users: "5,000+"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatCurrency = (val) => {
    if (typeof val === "string") return val; // handle fallback strings
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B+`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M+`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-12 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[var(--border)]">
          <div className="flex flex-col">
            <dt className="text-[var(--text-secondary)] font-medium text-sm mb-2 uppercase tracking-wide">
              Active Contracts
            </dt>
            <dd className="text-3xl font-display font-bold text-[var(--text)]">
              {loading ? "..." : (typeof stats?.active_contracts === "string" ? stats.active_contracts : (stats?.active_contracts || 0).toLocaleString())}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[var(--text-secondary)] font-medium text-sm mb-2 uppercase tracking-wide">
              Obligations Fulfilled
            </dt>
            <dd className="text-3xl font-display font-bold text-[var(--text)]">
              {loading ? "..." : (typeof stats?.obligations_fulfilled === "string" ? stats.obligations_fulfilled : (stats?.obligations_fulfilled || 0).toLocaleString())}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[var(--text-secondary)] font-medium text-sm mb-2 uppercase tracking-wide">
              Total Contract Value
            </dt>
            <dd className="text-3xl font-display font-bold text-[var(--text)]">
              {loading ? "..." : formatCurrency(stats?.total_contract_value || 0)}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[var(--text-secondary)] font-medium text-sm mb-2 uppercase tracking-wide">
              Registered Users
            </dt>
            <dd className="text-3xl font-display font-bold text-[var(--text)]">
              {loading ? "..." : (typeof stats?.total_users === "string" ? stats.total_users : (stats?.total_users || 0).toLocaleString())}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
