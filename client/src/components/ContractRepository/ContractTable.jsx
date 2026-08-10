
import React, { useEffect, useRef, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

function ContractTable({
  contracts,
  searchTerm,
  activeTab,
  view,
  onView,
  onEdit,
  onDelete,
  onInsights,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contract_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.vendor
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    let matchesTab = true;

    if (activeTab !== "all") {
      if (activeTab === "expiring") {
        const today = new Date();
        const endDate = new Date(contract.end_date);

        const diffDays = Math.ceil(
          (endDate - today) / (1000 * 60 * 60 * 24)
        );

        matchesTab = diffDays >= 0 && diffDays <= 30;
      } else {
        matchesTab =
          contract.status?.toLowerCase() === activeTab;
      }
    }

    return matchesSearch && matchesTab;
  });

  // ================= GRID VIEW =================

  if (view === "grid") {
    return (
      <div className="contract-grid">
        {filteredContracts.map((contract) => (
          <div
            className="contract-card"
            key={contract.id}
          >
            <div className="card-top">
              <div className="card-badges">
                <span
                  className={`status-badge ${contract.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {contract.status}
                </span>

                <span
                  className={`risk-badge ${(contract.risk_level || "low")
                    .toLowerCase()}`}
                >
                  {(contract.risk_level || "low").toLowerCase() === "high"
                    ? "High Risk"
                    : (contract.risk_level || "low").toLowerCase() === "medium"
                    ? "Medium Risk"
                    : "Low Risk"}
                </span>
              </div>

              <div
  className="card-menu"
  ref={openMenuId === contract.id ? menuRef : null}
>
  <button
    className="menu-btn"
    onClick={() =>
      setOpenMenuId(
        openMenuId === contract.id
          ? null
          : contract.id
      )
    }
  >
    <MoreHorizontal size={18} />
  </button>

  {openMenuId === contract.id && (
    <div className="card-dropdown">
      <button
        onClick={() => {
          setOpenMenuId(null);
          onEdit(contract);
        }}
      >
        <Pencil size={16} />
        Edit
      </button>

      <button
        className="delete-option"
        onClick={() => {
          setOpenMenuId(null);
          onDelete(contract.id);
        }}
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  )}
</div>
            </div>

            <h3>{contract.contract_name}</h3>

            <span className="vendor">
              {contract.vendor}
            </span>

            <div className="card-divider"></div>

            <div className="card-info">
              <div className="info-block">
                <span className="info-label">
                  Contract Value
                </span>

                <span className="info-value">
                  ₹
                  {Number(
                    contract.contract_value
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="info-block">
                <span className="info-label">
                  End Date
                </span>

                <span className="info-value">
                  {new Date(
                    contract.end_date
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="info-block">
                <span className="info-label">
                  Type
                </span>

                <span className="info-value">
                  {contract.contract_type}
                </span>
              </div>

              <div className="info-block">
                <span className="info-label">
                  Contract Number
                </span>

                <span className="info-value">
                  {contract.contract_number}
                </span>
              </div>
            </div>

            <div className="card-footer">
              <button
                type="button"
                onClick={() => onView(contract)}
              >
                View Details
              </button>

              <button
                type="button"
                className="card-insights-btn"
                onClick={() => onInsights(contract)}
              >
                <Sparkles size={15} />
                AI Insights
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ================= TABLE VIEW =================

  return (
    <div className="table-container">
      <table className="contract-table">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Type</th>
            <th>Value</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <tr key={contract.id}>
                <td>
                  <div className="contract-name">
                    <strong>
                      {contract.contract_name}
                    </strong>

                    <span>
                      {contract.vendor}
                    </span>
                  </div>
                </td>

                <td>
                  {contract.contract_type}
                </td>

                <td>
                  ₹
                  {Number(
                    contract.contract_value
                  ).toLocaleString("en-IN")}
                </td>

                <td>
                  {new Date(
                    contract.end_date
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td>
                  <span
                    className={`status-badge ${contract.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {contract.status}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="action-btn action-btn--label"
                      title="View Details"
                      onClick={() =>
                        onView(contract)
                      }
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      className="action-btn action-btn--label action-btn--insights"
                      title="AI Insights"
                      onClick={() => onInsights(contract)}
                    >
                      <Sparkles size={16} />
                      <span>AI Insights</span>
                    </button>

                    <button
                      className="action-btn"
                      title="Edit"
                      onClick={() =>
                        onEdit(contract)
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="action-btn"
                      title="Delete"
                      onClick={() =>
                        onDelete?.(contract.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "60px",
                }}
              >
                <div className="empty-state">
                  <h3>
                    No Contracts Found
                  </h3>

                  <p>
                    Try changing your
                    search or filter
                    criteria.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
          <div className="pagination">
          <div className="pagination-info">
            Showing {filteredContracts.length} of {contracts.length} contracts
          </div>
        </div>
      </div>
    
  );
}

export default ContractTable;
