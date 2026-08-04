
import React, { useState, useEffect } from "react";
import PageContainer from "../layout/PageContainer";
import Navbar from "../layout/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { API_BASE_URL } from "../data/constants";

import ContractStatusChart from "../components/Charts/ContractStatusChart";
import React from "react";
import QuickActions from "../components/QuickActions";
import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import RecentActivities from "../components/RecentActivities";
import QuickActions from "../components/QuickActions";

import NewContractModal from "../components/Modals/NewContractModal";
import AddRenewalModal from "../components/Modals/AddRenewalModal";

import { getRenewals } from "../services/renewalService";
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
import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import ContractStatusChart from '../components/Charts/ContractStatusChart';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API_BASE_URL } from '../data/constants';
import Navbar from '../layout/Navbar';
import NewContractModal from '../components/Modals/NewContractModal';

const Home = () => {
  

  const [dashboardData, setDashboardData] = useState({
    kpi: {
      total: 0,
      active: 0,
      expiring: 0,
      overdue: 0,
    },
    chartData: [],
    deadlines: [],
    contracts: [],
    activities: [],
  });

  const [loading, setLoading] = useState(true);

  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

 

  const [renewals, setRenewals] = useState([]);

  const [showRenewalModal, setShowRenewalModal] = useState(false);

  

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const loadRenewals = async () => {
    try {
      const data = await getRenewals();
      console.log("Renewals:", data);
      setRenewals(data);
    } catch (error) {
      console.error(error);
    }
  };

  

  useEffect(() => {
    fetchDashboardData();
    loadRenewals();
  }, []);

  

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm("Delete this contract?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/contracts/${contractId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchDashboardData();
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  

  const handleViewDetails = (name) => {
    alert(`Loading ${name}`);
  };

  const handleEdit = (name) => {
    alert(`Editing ${name}`);
  };

  const handleDownload = (name) => {
    alert(`Downloading ${name}`);
  };

  

  const filteredContracts = dashboardData.contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }
  return (
  <PageContainer>
    <Navbar
      onNewContract={() => setIsModalOpen(true)}
      notifications={dashboardData.deadlines}
      onSearch={setSearchTerm}
    />

    <NewContractModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSaveSuccess={fetchDashboardData}
    />

    <AddRenewalModal
      onClose={() => setShowRenewalModal(false)}
      onSuccess={loadRenewals}
      open={showRenewalModal}
    />

    <div
      style={{
        padding: 25,
        background: "#F5F7FB",
        minHeight: "100vh",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>

          <p
            style={{
              color: "#666",
              marginTop: 5,
            }}
          >
            Contract dashboard with renewal tracking.
          </p>
        </div>

        <button
          onClick={() => setShowRenewalModal(true)}
          style={{
            background: "#6C4CFF",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Add Renewal
        </button>
      </div>

      {/* Existing KPI */}

      <div className="kpi-cards">
        <div className="card">
          Total Contracts : {dashboardData.kpi.total}
        </div>

        <div className="card">
          Active Contracts : {dashboardData.kpi.active}
        </div>

        <div className="card">
          Expiring Soon : {dashboardData.kpi.expiring}
        </div>

        <div className="card">
          Overdue Obligations : {dashboardData.kpi.overdue}
        </div>
      </div>


      {/* Renewal Metrics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 18,
          marginTop: 25,
          marginBottom: 25,
        }}
      >
        <MetricsCard
          title="Total Renewals"
          value={renewals.length}
          color="#6C4CFF"
        />

        <MetricsCard
          title="Renewing Soon"
          value={
            renewals.filter((r) => r.status === "Pending").length
          }
          color="#F59E0B"
        />

        <MetricsCard
          title="Expired"
          value={
            renewals.filter((r) => r.status === "Expired").length
          }
          color="#EF4444"
        />

        <MetricsCard
          title="Automatic"
          value={
            renewals.filter(
              (r) => r.renewal_type === "Automatic"
            ).length
          }
          color="#10B981"
        />

        <MetricsCard
          title="Manual"
          value={
            renewals.filter(
              (r) => r.renewal_type === "Manual"
            ).length
          }
          color="#3B82F6"
        />
      </div>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <div className="card">
          <h3>Contract Status Overview</h3>

          {dashboardData.chartData.length > 0 ? (
            <ContractStatusChart
              data={dashboardData.chartData}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        <div className="card">
          <h3>Upcoming Deadlines</h3>

          <ul>
            {dashboardData.deadlines.length > 0 ? (
              dashboardData.deadlines.map((item, index) => (
                <li key={index}>
                  {item.title} - {item.date}
                </li>
              ))
            ) : (
              <li>No deadlines</li>
            )}
          </ul>
        </div>
      </div>

      {/* Renewal Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <ContractActivityChart renewals={renewals} />

        <RiskDistributionChart renewals={renewals} />
      </div>

      {/* Calendar + Activities */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div className="card">
          <h3>Calendar</h3>

          <Calendar />
        </div>

        <RecentActivities />

        <QuickActions />
      </div>

      {/* Recent Contracts */}

      <div className="card recent-contracts">
        <div className="section-header">
          <h3>Recent Contracts</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Contract</th>
              <th>Party</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
                      {filteredContracts.length > 0 ? (
              filteredContracts.map((contract, index) => (
                <tr key={index}>
                  <td>{contract.name}</td>

                  <td>{contract.party}</td>

                  <td>
                    <span
                      className={`status-${contract.status.toLowerCase()}`}
                    >
                      {contract.status}
                    </span>
                  </td>

                  <td>{contract.startDate}</td>

                  <td>{contract.endDate}</td>

                  <td>{contract.value}</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <button
                        onClick={() =>
                          handleViewDetails(contract.name)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        👁️
                      </button>

                      <button
                        onClick={() => handleEdit(contract.name)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(contract.name)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        📥
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteContract(contract.id)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "red",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No matching contracts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Renewals */}

      <div
        className="card"
        style={{
          marginTop: 25,
        }}
      >
        <h3
          style={{
            marginBottom: 20,
          }}
        >
          Recent Renewals
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Contract</th>
              <th>Renewal Type</th>
              <th>Renewal Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {renewals.length > 0 ? (
              renewals.map((renewal) => (
                <tr key={renewal.id}>
                  <td>{renewal.contract_name}</td>

                  <td>{renewal.renewal_type}</td>

                  <td>
                    {new Date(
                      renewal.renewal_date
                    ).toLocaleDateString()}
                  </td>

                  <td>{renewal.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No renewals available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </PageContainer>
);
}


