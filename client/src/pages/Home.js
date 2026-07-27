import React, { useState, useEffect } from "react";
import PageContainer from "../layout/PageContainer";
import Navbar from "../layout/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { API_BASE_URL } from "../data/constants";

import ContractStatusChart from "../components/Charts/ContractStatusChart";

import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import RecentActivities from "../components/RecentActivities";
import QuickActions from "../components/QuickActions";

import NewContractModal from "../components/Modals/NewContractModal";
import AddRenewalModal from "../components/Modals/AddRenewalModal";

import { getRenewals } from "../services/renewalService";

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

export default Home;