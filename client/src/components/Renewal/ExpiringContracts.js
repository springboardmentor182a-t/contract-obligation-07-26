
import { Eye } from "lucide-react";
import { useState } from "react";

function ExpiringContracts({ data }) {
  const [showAll, setShowAll] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const contracts = Array.isArray(data) && data.length
    ? data
        .map((contract) => ({
          id: contract.id,
          name: contract.contract_name || contract.name || "Unnamed Contract",
          vendor: contract.vendor || "Unknown Vendor",
          expiry: contract.expiry_date || contract.expiry || "TBD",
          amount: contract.contract_value
            ? `$${Number(contract.contract_value).toLocaleString()}`
            : "$0",
          days: contract.expiry_date
            ? Math.max(0, Math.ceil((new Date(contract.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)))
            : 0,
          status: contract.status || "Upcoming",
              chipColor:
                contract.status === "Critical"
                  ? "contract-status contract-status--critical"
                  : contract.status === "Approved"
                  ? "contract-status contract-status--approved"
                  : contract.status === "Renewed"
                  ? "contract-status contract-status--renewed"
                  : "contract-status contract-status--upcoming",
        }))
        .sort((a, b) => a.days - b.days)
    : [];

  const visibleContracts = showAll ? contracts : contracts.slice(0, 3);

  const handleView = (id) => {
    setSelectedId((current) => (current === id ? null : id));
    setActionMessage("");
  };

  const handleInitiate = (contract) => {
    setSelectedId(contract.id);
    setActionMessage(`Initiated renewal for ${contract.name}.`);
    setTimeout(() => setActionMessage(""), 4000);
  };

  return (
    <section className="renewal-card renewal-card--contracts">
      <div className="section-heading renewal-contracts-heading">
        <div>
          <h2>Contracts Expiring Soon</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Review contracts that need attention</p>
        </div>
        <button
          type="button"
          className="prediction-toggle-btn"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "Show All"}

          <span className="prediction-count">
            {contracts.length}
          </span>
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="mx-7 mb-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No expiring contracts to display right now.
        </div>
      ) : (
        <div className="contract-list">
          {visibleContracts.map((contract) => (
            <article key={contract.id} className="contract-row">
                      <div className="contract-row__content">
                <div>
                  <div className="contract-row__main">
                    <div>
                      <h3 className="contract-item__title">{contract.name}</h3>
                      <p className="contract-item__subtitle">{contract.vendor}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${contract.chipColor}`}>
                      {contract.status}
                    </span>
                  </div>

                  <div className="contract-row__details">
                    <div>
                      <strong>{contract.days}</strong> days left
                    </div>
                    <div>{contract.expiry}</div>
                    <div>{contract.amount}</div>
                  </div>
                </div>

                <div className="contract-row__actions">
                  <button
                    className="contract-row__button contract-row__button--view"
                    type="button"
                    onClick={() => handleView(contract.id)}
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    className="contract-row__button contract-row__button--renew"
                    type="button"
                    onClick={() => handleInitiate(contract)}
                  >
                    Initiate Renewal
                  </button>
                </div>
              </div>

              {selectedId === contract.id && (
                <div className="contract-details-panel">
                  <p className="contract-details-panel__text">Review this contract details and confirm renewal action. Status: {contract.status}.</p>
                  <p className="contract-details-panel__text">Vendor: {contract.vendor}</p>
                  <p className="contract-details-panel__text">Expiry date: {contract.expiry}</p>
                  <p className="contract-details-panel__text">Amount: {contract.amount}</p>
                </div>
              )}
            </article>
          ))}

          {actionMessage && <div className="contract-action-message">{actionMessage}</div>}
        </div>
      )}
    </section>
  );
}

export default ExpiringContracts;