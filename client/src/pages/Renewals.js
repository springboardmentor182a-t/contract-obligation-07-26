import React, { useState, useEffect } from "react";
import PageContainer from "../layout/PageContainer";

import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";


import { getRenewals } from "../services/renewalService";
import AddRenewalModal from "../components/Modals/AddRenewalModal";

function Renewals() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRenewals();
  }, []);

  const loadRenewals = async () => {
    try {
      const data = await getRenewals();
      console.log("Renewals:", data);
      setRenewals(data);
    } catch (err) {
      console.error("Failed to load renewals", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: 30 }}>Loading...</div>
      </PageContainer>
    );
  }

  const totalContracts = renewals.length;

  const renewingSoon = renewals.filter((r) => {
    const today = new Date();
    const renewalDate = new Date(r.renewal_date);
    const diff =
      (renewalDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff >= 0 && diff <= 30;
  }).length;

  const expiredContracts = renewals.filter((r) => {
    return new Date(r.renewal_date) < new Date();
  }).length;

  const automaticRenewals = renewals.filter(
    (r) => r.renewal_type === "Automatic"
  ).length;

  const manualRenewals = renewals.filter(
    (r) => r.renewal_type === "Manual"
  ).length;

  return (
    <PageContainer>
      <div
        style={{
          padding: 25,
          background: "#F5F7FB",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Renewal Dashboard</h1>

            <p
              style={{
                color: "#666",
                marginTop: 5,
              }}
            >
              Monitor all contract renewals in one place.
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
              fontWeight: 600,
            }}
          >
            + Add Renewal
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <MetricsCard
            title="Total Contracts"
            value={totalContracts}
            color="#6C4CFF"
          />

          <MetricsCard
            title="Renewing Soon"
            value={renewingSoon}
            color="#F59E0B"
          />

          <MetricsCard
            title="Expired"
            value={expiredContracts}
            color="#EF4444"
          />

          <MetricsCard
            title="Auto Renewal"
            value={automaticRenewals}
            color="#10B981"
          />

          <MetricsCard
            title="Manual Renewal"
            value={manualRenewals}
            color="#3B82F6"
          />
        </div>
                {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3 style={{ marginBottom: 20 }}>
              Contract Activity
            </h3>

            <ContractActivityChart renewals={renewals} />
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3 style={{ marginBottom: 20 }}>
              Risk Distribution
            </h3>

            <RiskDistributionChart renewals={renewals} />
          </div>
        </div>

        {/* Recent Renewals */}

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
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
                    No renewals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <AddRenewalModal
            onClose={() => setShowModal(false)}
            onSuccess={loadRenewals}
          />
        )}
      </div>
    </PageContainer>
  );
}

export default Renewals;