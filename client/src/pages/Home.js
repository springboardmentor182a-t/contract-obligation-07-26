import React from "react";
import QuickActions from "../components/QuickActions";
import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import RecentActivities from "../components/RecentActivities";
import AIRecommendations from "../components/AIRecommendations";
import SystemHealth from "../components/SystemHealth";

import {
  Users,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Database,
  Bell,
  CheckSquare,
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div style={styles.container}>

      {/* Banner Area */}
      <div style={styles.banner} className="banner-layout">
        <div style={styles.bannerGridPattern} />

        {/* Banner Left Info */}
        <div style={styles.bannerLeft}>
          <span style={styles.greeting}>Good morning 👋</span>
          <h1 style={styles.welcomeText}>Welcome back, Arjun.</h1>
          <p style={styles.bannerSub}>
            You have <strong style={{ color: "#fff" }}>2 unread notifications</strong>, <strong style={{ color: "#fff" }}>5 pending actions</strong>, and <strong style={{ color: "#fff" }}>3 upcoming renewals</strong> this week.
          </p>

          <div style={styles.badgeRow}>
            <div style={styles.aiBadge}>
              <Sparkles size={12} style={{ marginRight: "4px" }} />
              <span>AI INSIGHTS ACTIVE</span>
            </div>
            <span style={styles.updatedText}>Last updated 5 min ago</span>
          </div>
        </div>

        {/* Banner Right Metric Boxes */}
        <div style={styles.bannerRight} className="banner-right-layout">
          <div style={styles.bannerBox}>
            <Bell size={18} color="#93c5fd" />
            <div style={styles.bannerBoxVal}>2</div>
            <div style={styles.bannerBoxLabel}>Notifications</div>
          </div>

          <div style={styles.bannerBox}>
            <CheckSquare size={18} color="#fde047" />
            <div style={styles.bannerBoxVal}>5</div>
            <div style={styles.bannerBoxLabel}>Pending Actions</div>
          </div>

          <div style={styles.bannerBox}>
            <RefreshCw size={18} color="#f472b6" />
            <div style={styles.bannerBoxVal}>3</div>
            <div style={styles.bannerBoxLabel}>Renewals Due</div>
          </div>

          <div style={styles.bannerBox}>
            <ShieldCheck size={18} color="#34d399" />
            <div style={styles.bannerBoxVal}>84%</div>
            <div style={styles.bannerBoxLabel}>Compliance</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Toolbar */}
      <QuickActions />

      {/* 8 Grid Metrics */}
      <div className="metrics-grid">
        <MetricsCard
          title="Total Users"
          value="142"
          trend="+5 this week"
          trendSubtext="vs last month"
          trendType="positive"
          icon={Users}
          iconColor="#2563eb"
          iconBgColor="rgba(37, 99, 235, 0.08)"
        />
        <MetricsCard
          title="Total Contracts"
          value="61"
          trend="+7 this month"
          trendSubtext="vs last month"
          trendType="positive"
          icon={FileText}
          iconColor="#10b981"
          iconBgColor="rgba(16, 185, 129, 0.08)"
        />
        <MetricsCard
          title="Pending Approvals"
          value="7"
          icon={Clock}
          iconColor="#f59e0b"
          iconBgColor="rgba(245, 158, 11, 0.08)"
        />
        <MetricsCard
          title="Compliance Score"
          value="84%"
          trend="+2% this month"
          trendSubtext="vs last month"
          trendType="positive"
          icon={ShieldCheck}
          iconColor="#0d9488"
          iconBgColor="rgba(13, 148, 136, 0.08)"
        />
        <MetricsCard
          title="Active Contracts"
          value="48"
          icon={ShieldCheck}
          iconColor="#10b981"
          iconBgColor="rgba(16, 185, 129, 0.08)"
        />
        <MetricsCard
          title="Expired Contracts"
          value="8"
          icon={AlertCircle}
          iconColor="#ef4444"
          iconBgColor="rgba(239, 68, 68, 0.08)"
        />
        <MetricsCard
          title="High Risk"
          value="8"
          trend="+1 flagged"
          trendSubtext="vs last month"
          trendType="warning"
          icon={AlertTriangle}
          iconColor="#ef4444"
          iconBgColor="rgba(239, 68, 68, 0.08)"
        />
        <MetricsCard
          title="Storage Used"
          value="73%"
          trend="182 GB / 250 GB"
          trendType="neutral"
          icon={Database}
          iconColor="#8b5cf6"
          iconBgColor="rgba(139, 92, 246, 0.08)"
        />
      </div>

      {/* Row 1: Charts */}
      <div className="split-grid charts-row">
        <div style={styles.widgetWrapper}>
          <ContractActivityChart />
        </div>
        <div style={styles.widgetWrapper}>
          <RiskDistributionChart />
        </div>
      </div>

      {/* Row 2: Recent Activities & AI Recommendations / System Health */}
      <div className="split-grid details-row">
        <div style={styles.widgetWrapper}>
          <RecentActivities />
        </div>
        <div style={styles.rightStack}>
          <AIRecommendations />
          <SystemHealth />
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
  },
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
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    flexWrap: "wrap",
    gap: "2rem",
  },
  bannerGridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
    pointerEvents: "none",
  },
  bannerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    zIndex: 1,
    maxWidth: "550px",
    textAlign: "left",
  },
  greeting: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#34d399",
    letterSpacing: "0.3px",
  },
  welcomeText: {
    fontSize: "1.75rem",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  bannerSub: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    lineHeight: "1.5",
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "0.5rem",
  },
  aiBadge: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    borderRadius: "var(--radius-full)",
    padding: "3px 10px",
    fontSize: "0.65rem",
    fontWeight: "700",
    color: "#d8b4fe",
    letterSpacing: "0.5px",
  },
  updatedText: {
    fontSize: "0.75rem",
    color: "#64748b",
  },
  bannerRight: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    zIndex: 1,
    minWidth: "400px",
    width: "45%",
  },
  bannerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "1rem 0.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "background-color 0.2s",
  },
  bannerBoxVal: {
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  bannerBoxLabel: {
    fontSize: "0.65rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  rightStack: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    height: "100%",
  },
  widgetWrapper: {
    width: "100%",
    height: "100%",
  },
};
