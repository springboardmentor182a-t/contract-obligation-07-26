import React, { useEffect, useState } from "react";

import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import RecentActivities from "../components/RecentActivities";
import QuickActions from "../components/QuickActions";


import { getRenewals } from "../services/renewalService";
import AddRenewalModal from "../components/Modals/AddRenewalModal";

function Home() {
  const [renewals, setRenewals] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRenewals();
  }, []);

  const loadRenewals = async () => {
    try {
      const data = await getRenewals();
      console.log("Renewals received:", data);
      setRenewals(data);
    } catch (error) {
      console.error("Failed to load renewals:", error);
    }
  };

  return (
    <>
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
            <h1
              style={{
                margin: 0,
                color: "#222",
              }}
            >
              Renewal Dashboard
            </h1>

            <p
              style={{
                color: "#777",
                marginTop: 6,
              }}
            >
              Monitor contract renewals and stay ahead of deadlines.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#6C4CFF",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Add Renewal
          </button>
        </div>

        {/* Metrics */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 18,
            marginBottom: 25,
          }}
        >
          <MetricsCard
            title="Total Contracts"
            value={renewals.length}
            color="#6C4CFF"
          />

          <MetricsCard
            title="Renewing Soon"
            value={renewals.filter((r) => r.status === "Pending").length}
            color="#F59E0B"
          />

          <MetricsCard
            title="Expired"
            value={renewals.filter((r) => r.status === "Expired").length}
            color="#EF4444"
          />

          <MetricsCard
            title="Auto Renewal"
            value={
              renewals.filter((r) => r.renewal_type === "Automatic").length
            }
            color="#10B981"
          />

          <MetricsCard
            title="Manual Renewal"
            value={renewals.filter((r) => r.renewal_type === "Manual").length}
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
          <ContractActivityChart renewals={renewals} />
          <RiskDistributionChart renewals={renewals} />
        </div>

        {/* Recent Activities */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            marginBottom: 25,
          }}
        >
          <RecentActivities />
          <QuickActions />
        </div>

        {/* AI + System */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
          }}
        >
          
          
        </div>
      </div>

      {showModal && (
        <AddRenewalModal
          onClose={() => setShowModal(false)}
          onSuccess={loadRenewals}
        />
      )}
    </>
  );
}

export default Home;