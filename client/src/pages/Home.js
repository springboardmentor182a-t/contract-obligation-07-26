import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import RecentActivities from "../components/RecentActivities";
import SystemHealth from "../components/SystemHealth";
import {
  Users, FileText, Clock, ShieldCheck,
  AlertCircle, AlertTriangle, Bell, RefreshCw,
  CheckSquare, Sparkles
} from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const s = stats || {};
  const r = s.renewals || {};

  return (
    <div style={styles.container}>
      {/* Banner */}
      <div style={styles.banner} className="banner-layout">
        <div style={styles.bannerGridPattern} />
        <div style={styles.bannerLeft}>
          <span style={styles.greeting}>{getGreeting()} 👋</span>
          <h1 style={styles.welcomeText}>
            Welcome back, {user?.name?.split(" ")[0] || "User"}.
          </h1>
          <p style={styles.bannerSub}>
            You have{" "}
            <strong style={{ color: "#fff" }}>{r.expiring_in_30_days ?? "—"} renewals due</strong>{" "}
            in 30 days,{" "}
            <strong style={{ color: "#fff" }}>{r.upcoming ?? "—"} upcoming</strong>, and{" "}
            <strong style={{ color: "#fff" }}>{r.in_progress ?? "—"} in progress</strong>.
          </p>
          <div style={styles.badgeRow}>
            <div style={styles.aiBadge}>
              <Sparkles size={12} style={{ marginRight: "4px" }} />
              <span>LIVE DATA</span>
            </div>
            <span style={styles.updatedText}>Synced with backend</span>
          </div>
        </div>

        <div style={styles.bannerRight} className="banner-right-layout">
          <div style={styles.bannerBox}>
            <Bell size={18} color="#93c5fd" />
            <div style={styles.bannerBoxVal}>{r.expiring_in_30_days ?? "—"}</div>
            <div style={styles.bannerBoxLabel}>Due Soon</div>
          </div>
          <div style={styles.bannerBox}>
            <CheckSquare size={18} color="#fde047" />
            <div style={styles.bannerBoxVal}>{r.upcoming ?? "—"}</div>
            <div style={styles.bannerBoxLabel}>Upcoming</div>
          </div>
          <div style={styles.bannerBox}>
            <RefreshCw size={18} color="#f472b6" />
            <div style={styles.bannerBoxVal}>{r.in_progress ?? "—"}</div>
            <div style={styles.bannerBoxLabel}>In Progress</div>
          </div>
          <div style={styles.bannerBox}>
            <ShieldCheck size={18} color="#34d399" />
            <div style={styles.bannerBoxVal}>{r.renewed ?? "—"}</div>
            <div style={styles.bannerBoxLabel}>Renewed</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <MetricsCard
          title="Total Users"
          value={loading ? "…" : String(s.total_users ?? 0)}
          icon={Users}
          iconColor="#2563eb"
          iconBgColor="rgba(37,99,235,0.08)"
        />
        <MetricsCard
          title="Total Contracts"
          value={loading ? "…" : String(s.total_contracts ?? 0)}
          icon={FileText}
          iconColor="#10b981"
          iconBgColor="rgba(16,185,129,0.08)"
        />
        <MetricsCard
          title="Pending Renewals"
          value={loading ? "…" : String(s.pending_approvals ?? 0)}
          icon={Clock}
          iconColor="#f59e0b"
          iconBgColor="rgba(245,158,11,0.08)"
        />
        <MetricsCard
          title="Active Contracts"
          value={loading ? "…" : String(s.active_contracts ?? 0)}
          icon={ShieldCheck}
          iconColor="#0d9488"
          iconBgColor="rgba(13,148,136,0.08)"
        />
        <MetricsCard
          title="Expiring in 30d"
          value={loading ? "…" : String(r.expiring_in_30_days ?? 0)}
          icon={AlertTriangle}
          iconColor="#ef4444"
          iconBgColor="rgba(239,68,68,0.08)"
        />
        <MetricsCard
          title="Expired Renewals"
          value={loading ? "…" : String(r.expired ?? 0)}
          icon={AlertCircle}
          iconColor="#ef4444"
          iconBgColor="rgba(239,68,68,0.08)"
        />
        <MetricsCard
          title="Renewals Cancelled"
          value={loading ? "…" : String(r.cancelled ?? 0)}
          icon={AlertCircle}
          iconColor="#8b5cf6"
          iconBgColor="rgba(139,92,246,0.08)"
        />
        <MetricsCard
          title="Total Renewed"
          value={loading ? "…" : String(r.renewed ?? 0)}
          icon={RefreshCw}
          iconColor="#10b981"
          iconBgColor="rgba(16,185,129,0.08)"
        />
      </div>

      {/* Charts Row */}
      <div className="split-grid charts-row">
        <div style={styles.widgetWrapper}><ContractActivityChart stats={r} /></div>
        <div style={styles.widgetWrapper}><RiskDistributionChart stats={r} /></div>
      </div>

      {/* Bottom Row */}
      <div className="split-grid details-row">
        <div style={styles.widgetWrapper}><RecentActivities /></div>
        <div style={styles.rightStack}><SystemHealth /></div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" },
  banner: {
    background: "linear-gradient(135deg, #090e1a 0%, #171d34 100%)",
    borderRadius: "var(--radius-lg)",
    padding: "2rem",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
    flexWrap: "wrap",
    gap: "2rem",
  },
  bannerGridPattern: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.08,
    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
    backgroundSize: "20px 20px", pointerEvents: "none",
  },
  bannerLeft: { display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 1, maxWidth: "550px", textAlign: "left" },
  greeting: { fontSize: "0.85rem", fontWeight: "600", color: "#34d399", letterSpacing: "0.3px" },
  welcomeText: { fontSize: "1.75rem", fontWeight: "700", lineHeight: "1.2" },
  bannerSub: { fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5" },
  badgeRow: { display: "flex", alignItems: "center", gap: "12px", marginTop: "0.5rem" },
  aiBadge: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(90deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2))",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "var(--radius-full)", padding: "3px 10px",
    fontSize: "0.65rem", fontWeight: "700", color: "#6ee7b7", letterSpacing: "0.5px",
  },
  updatedText: { fontSize: "0.75rem", color: "#64748b" },
  bannerRight: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", zIndex: 1, minWidth: "400px", width: "45%" },
  bannerBox: {
    backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "12px", padding: "1rem 0.75rem",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px",
  },
  bannerBoxVal: { fontSize: "1.5rem", fontWeight: "700" },
  bannerBoxLabel: { fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.3px" },
  rightStack: { display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" },
  widgetWrapper: { width: "100%", height: "100%" },
};
