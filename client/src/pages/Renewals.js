import React, { useState, useEffect } from "react";
import PageContainer from "../layout/PageContainer";

import MetricsCard from "../components/MetricsCard";
import ContractActivityChart from "../components/ContractActivityChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import RenewalTypesChart from "../components/RenewalTypesChart";

import {
  getRenewals,
  deleteRenewal,
} from "../services/renewalService";

import AddRenewalModal from "../components/Modals/AddRenewalModal";
import EditRenewalModal from "../components/Modals/EditRenewalModal";
import ViewRenewalModal from "../components/Modals/ViewRenewalModal";
import {
  LuEye,
  LuPencil,
  LuTrash2
} from "react-icons/lu";

function Renewals() {
  const [renewals, setRenewals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [selectedRenewal, setSelectedRenewal] =
    useState(null);

  useEffect(() => {
    loadRenewals();
  }, []);

  const loadRenewals = async () => {
    try {
      const data = await getRenewals();

      console.log("Renewals:", data);

      setRenewals(data);
    } catch (err) {
      console.error(
        "Failed to load renewals",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VIEW RENEWAL
     ========================= */

  const handleView = (renewal) => {
    setSelectedRenewal(renewal);
    setShowViewModal(true);
  };

  /* =========================
     EDIT RENEWAL
     ========================= */

  const handleEdit = (renewal) => {
    setSelectedRenewal(renewal);
    setShowEditModal(true);
  };

  /* =========================
     DELETE RENEWAL
     ========================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this renewal?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteRenewal(id);

      alert(
        "Renewal deleted successfully!"
      );

      await loadRenewals();
    } catch (err) {
      console.error(
        "Failed to delete renewal:",
        err
      );

      alert(
        err.message ||
          "Failed to delete renewal"
      );
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: 30 }}>
          Loading...
        </div>
      </PageContainer>
    );
  }

  const totalContracts = renewals.length;

  const renewingSoon = renewals.filter((r) => {
    const today = new Date();

    const renewalDate = new Date(
      r.renewal_date
    );

    const diff =
      (renewalDate.getTime() -
        today.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff >= 0 && diff <= 30;
  }).length;

  const expiredContracts = renewals.filter(
    (r) =>
      new Date(r.renewal_date) <
      new Date()
  ).length;

  const automaticRenewals =
    renewals.filter(
      (r) =>
        r.renewal_type === "Automatic"
    ).length;

  const manualRenewals =
    renewals.filter(
      (r) =>
        r.renewal_type === "Manual"
    ).length;

  return (
    <PageContainer>
      <div
        style={{
          padding: "20px 25px",
          background: "#F5F7FB",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >

        {/* =========================
            HEADER
            ========================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
              }}
            >
              Renewal Dashboard
            </h1>

            <p
              style={{
                color: "#666",
                marginTop: 5,
                marginBottom: 0,
                fontSize: 15,
              }}
            >
              Monitor all contract
              renewals in one place.
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            style={{
              background: "#6C4CFF",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            + Add Renewal
          </button>
        </div>

        {/* =========================
            KPI CARDS
            ========================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5, 1fr)",
            gap: 14,
            marginBottom: 20,
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

        {/* =========================
            CHARTS
            ========================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1.7fr 0.9fr 0.9fr",
            gap: 14,
            marginBottom: 20,
            alignItems: "stretch",
          }}
        >

          {/* MONTHLY RENEWALS */}

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 14,
              boxSizing: "border-box",
              minWidth: 0,
              height: 330,
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: 18,
              }}
            >
              Monthly Renewals
            </h3>

            <div style={{ height: 270 }}>
              <ContractActivityChart
                renewals={renewals}
              />
            </div>
          </div>

          {/* RENEWAL PROGRESS */}

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 14,
              boxSizing: "border-box",
              minWidth: 0,
              height: 330,
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: 18,
              }}
            >
              Renewal Progress
            </h3>

            <div style={{ height: 270 }}>
              <RiskDistributionChart
                renewals={renewals}
              />
            </div>
          </div>

          {/* RENEWAL TYPES */}

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 14,
              boxSizing: "border-box",
              minWidth: 0,
              height: 330,
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: 18,
              }}
            >
              Renewal Types
            </h3>

            <div style={{ height: 270 }}>
              <RenewalTypesChart
                renewals={renewals}
              />
            </div>
          </div>
        </div>

        {/* =========================
            RECENT RENEWALS
            ========================= */}

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 18,
            boxSizing: "border-box",
            marginBottom: 20,
            overflowX: "auto",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: 18,
            }}
          >
            Recent Renewals
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 800,
            }}
          >
            <thead>
              <tr>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    background: "#F8F7FF",
                  }}
                >
                  Contract
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    background: "#F8F7FF",
                  }}
                >
                  Renewal Type
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    background: "#F8F7FF",
                  }}
                >
                  Renewal Date
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    background: "#F8F7FF",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    background: "#F8F7FF",
                  }}
                >
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {renewals.length > 0 ? (

                renewals.map(
                  (renewal) => (

                    <tr
                      key={renewal.id}
                    >

                      {/* CONTRACT */}

                      <td
                        style={{
                          padding: "10px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {
                          renewal.contract_name
                        }
                      </td>

                      {/* RENEWAL TYPE */}

                      <td
                        style={{
                          padding: "10px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {
                          renewal.renewal_type
                        }
                      </td>

                      {/* DATE */}

                      <td
                        style={{
                          padding: "10px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {new Date(
                          renewal.renewal_date
                        ).toLocaleDateString()}
                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          padding: "10px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {
                          renewal.status
                        }
                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          padding: "10px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            handleView(
                              renewal
                            )
                          }
                          style={{
                            background:
                              "#EDE9FE",
                            color:
                              "#6C4CFF",
                            border: "none",
                            padding:
                              "7px 12px",
                            borderRadius: 6,
                            cursor:
                              "pointer",
                            marginRight: 6,
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          <LuEye />
                        </button>

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(
                              renewal
                            )
                          }
                          style={{
                            background:
                              "#6C4CFF",
                            color: "#fff",
                            border: "none",
                            padding:
                              "7px 12px",
                            borderRadius: 6,
                            cursor:
                              "pointer",
                            marginRight: 6,
                            fontSize: 13,
                          }}
                        >
                          <LuPencil />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(
                              renewal.id
                            )
                          }
                          style={{
                            background:
                              "#EF4444",
                            color: "#fff",
                            border: "none",
                            padding:
                              "7px 12px",
                            borderRadius: 6,
                            cursor:
                              "pointer",
                            fontSize: 13,
                          }}
                        >
                          <LuTrash2 />
                        </button>

                      </td>
                    </tr>
                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan="5"
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

        {/* =========================
            ADD RENEWAL MODAL
            ========================= */}

        {showModal && (
          <AddRenewalModal
            onClose={() =>
              setShowModal(false)
            }
            onSuccess={
              loadRenewals
            }
          />
        )}

        {/* =========================
            EDIT RENEWAL MODAL
            ========================= */}

        {showEditModal &&
          selectedRenewal && (

            <EditRenewalModal
              renewal={
                selectedRenewal
              }

              onClose={() => {
                setShowEditModal(
                  false
                );

                setSelectedRenewal(
                  null
                );
              }}

              onSuccess={
                loadRenewals
              }
            />

          )}

        {/* =========================
            VIEW RENEWAL MODAL
            ========================= */}

        {showViewModal &&
          selectedRenewal && (

            <ViewRenewalModal
              renewal={
                selectedRenewal
              }

              onClose={() => {
                setShowViewModal(
                  false
                );

                setSelectedRenewal(
                  null
                );
              }}
            />

          )}

      </div>
    </PageContainer>
  );
}

export default Renewals;