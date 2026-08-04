import { Eye, Sparkles } from "lucide-react";
import { useState } from "react";

function ExpiringContracts({ data }) {
  const [showAll, setShowAll] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiStrategies, setAiStrategies] = useState({});
  const [aiErrors, setAiErrors] = useState({});

  const contracts =
    Array.isArray(data) && data.length
      ? data
          .map((contract) => {
            const expiryDate =
              contract.expiry_date ||
              contract.expiry ||
              null;

            const daysLeft = expiryDate
              ? Math.ceil(
                  (new Date(
                    `${expiryDate}T00:00:00`
                  ).getTime() -
                    new Date().setHours(
                      0,
                      0,
                      0,
                      0
                    )) /
                    (1000 * 60 * 60 * 24)
                )
              : null;

            const status =
              contract.status || "Upcoming";

            return {
              // AI endpoint requires the original contract ID.
              id:
                contract.contract_id ||
                contract.id,

              // Renewal record ID is preserved separately.
              renewalId: contract.id,

              name:
                contract.contract_name ||
                contract.name ||
                "Unnamed Contract",

              vendor:
                contract.vendor ||
                "Unknown Vendor",

              expiry:
                expiryDate || "TBD",

              amount:
                contract.contract_value !==
                  null &&
                contract.contract_value !==
                  undefined
                  ? `$${Number(
                      contract.contract_value
                    ).toLocaleString()}`
                  : "$0",

              days: daysLeft,

              status,

              approvalStatus:
                contract.approval_status ||
                "Not Available",

              chipColor:
                status === "Critical" ||
                status === "Action Needed"
                  ? "contract-status contract-status--critical"
                  : status === "Approved"
                    ? "contract-status contract-status--approved"
                    : status === "Renewed"
                      ? "contract-status contract-status--renewed"
                      : "contract-status contract-status--upcoming",
            };
          })
          .sort((first, second) => {
            const firstDays =
              first.days ??
              Number.MAX_SAFE_INTEGER;

            const secondDays =
              second.days ??
              Number.MAX_SAFE_INTEGER;

            return firstDays - secondDays;
          })
      : [];

  const visibleContracts = showAll
    ? contracts
    : contracts.slice(0, 3);

  const handleView = (id) => {
    setSelectedId((current) =>
      current === id ? null : id
    );

    setActionMessage("");
  };

  const handleInitiate = (contract) => {
    setSelectedId(contract.id);

    setActionMessage(
      `Initiated renewal for ${contract.name}.`
    );

    setTimeout(() => {
      setActionMessage("");
    }, 4000);
  };

  const handleAIStrategy = async (
    contract
  ) => {
    if (!contract.id) {
      setAiErrors((current) => ({
        ...current,
        [contract.renewalId]:
          "This renewal is not connected to a contract.",
      }));

      return;
    }

    setAiLoadingId(contract.id);

    setAiErrors((current) => ({
      ...current,
      [contract.id]: "",
    }));

    try {
      const response = await fetch(
        `/api/renewal-ai/${contract.id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let responseData = {};

      try {
        responseData =
          await response.json();
      } catch {
        responseData = {};
      }

      if (!response.ok) {
        throw new Error(
          responseData.detail ||
            "Unable to generate the AI renewal strategy."
        );
      }

      setAiStrategies((current) => ({
        ...current,
        [contract.id]: responseData,
      }));

      setSelectedId(contract.id);
    } catch (error) {
      console.error(
        "AI renewal strategy error:",
        error
      );

      setAiErrors((current) => ({
        ...current,
        [contract.id]:
          error.message ||
          "Unable to generate the AI renewal strategy.",
      }));
    } finally {
      setAiLoadingId(null);
    }
  };

  const formatDays = (days) => {
    if (days === null) {
      return "Expiry date unavailable";
    }

    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    }

    if (days === 0) {
      return "Expires today";
    }

    return `${days} days left`;
  };

  return (
    <section className="renewal-card renewal-card--contracts">
      <div className="section-heading renewal-contracts-heading">
        <div>
          <h2>Contracts Expiring Soon</h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Review contracts that need
            attention and generate live AI
            renewal strategies.
          </p>
        </div>

        <button
          type="button"
          className="prediction-toggle-btn"
          onClick={() =>
            setShowAll(
              (previousValue) =>
                !previousValue
            )
          }
        >
          {showAll
            ? "Show Less"
            : "Show All"}

          <span className="prediction-count">
            {contracts.length}
          </span>
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="mx-7 mb-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No expiring contracts to display
          right now.
        </div>
      ) : (
        <div className="contract-list">
          {visibleContracts.map(
            (contract) => {
              const strategy =
                aiStrategies[contract.id];

              const aiError =
                aiErrors[contract.id];

              const isAnalyzing =
                aiLoadingId === contract.id;

              return (
                <article
                  key={
                    contract.renewalId ||
                    contract.id
                  }
                  className="contract-row"
                >
                  <div className="contract-row__content">
                    <div>
                      <div className="contract-row__main">
                        <div>
                          <h3 className="contract-item__title">
                            {contract.name}
                          </h3>

                          <p className="contract-item__subtitle">
                            {contract.vendor}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${contract.chipColor}`}
                        >
                          {contract.status}
                        </span>
                      </div>

                      <div className="contract-row__details">
                        <div>
                          <strong>
                            {formatDays(
                              contract.days
                            )}
                          </strong>
                        </div>

                        <div>
                          {contract.expiry}
                        </div>

                        <div>
                          {contract.amount}
                        </div>

                        <div>
                          Approval:{" "}
                          {
                            contract.approvalStatus
                          }
                        </div>
                      </div>
                    </div>

                    <div className="contract-row__actions">
                      <button
                        className="contract-row__button contract-row__button--view"
                        type="button"
                        onClick={() =>
                          handleView(
                            contract.id
                          )
                        }
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        className="contract-row__button contract-row__button--ai"
                        type="button"
                        onClick={() =>
                          handleAIStrategy(
                            contract
                          )
                        }
                        disabled={
                          isAnalyzing
                        }
                      >
                        <Sparkles
                          size={16}
                        />

                        {isAnalyzing
                          ? "Analyzing..."
                          : strategy
                            ? `AI: ${strategy.recommendation}`
                            : "AI Strategy"}
                      </button>

                      <button
                        className="contract-row__button contract-row__button--renew"
                        type="button"
                        onClick={() =>
                          handleInitiate(
                            contract
                          )
                        }
                      >
                        Initiate Renewal
                      </button>
                    </div>
                  </div>
                                    {selectedId ===
                    contract.id && (
                    <div className="contract-details-panel">
                      <p className="contract-details-panel__text">
                        Review the contract
                        details and confirm the
                        appropriate renewal
                        action.
                      </p>

                      <p className="contract-details-panel__text">
                        Status:{" "}
                        {contract.status}
                      </p>

                      <p className="contract-details-panel__text">
                        Vendor:{" "}
                        {contract.vendor}
                      </p>

                      <p className="contract-details-panel__text">
                        Expiry date:{" "}
                        {contract.expiry}
                      </p>

                      <p className="contract-details-panel__text">
                        Amount:{" "}
                        {contract.amount}
                      </p>

                      <p className="contract-details-panel__text">
                        Approval status:{" "}
                        {
                          contract.approvalStatus
                        }
                      </p>
                    </div>
                  )}

                  {aiError && (
                    <div className="contract-ai-panel contract-ai-panel--error">
                      {aiError}
                    </div>
                  )}

                  {strategy && (
                    <div className="contract-ai-panel">
                      <div className="contract-ai-panel__header">
                        <div>
                          <p className="contract-ai-panel__eyebrow">
                            AI Renewal
                            Strategy
                          </p>

                          <h4 className="contract-ai-panel__title">
                            {
                              strategy.recommendation
                            }
                          </h4>
                        </div>

                        <span className="contract-ai-panel__confidence">
                          {
                            strategy.confidence
                          }
                          % confidence
                        </span>
                      </div>

                      <div className="contract-ai-panel__meta">
                        <span>
                          Risk:{" "}
                          <strong>
                            {
                              strategy.risk_level
                            }
                          </strong>
                        </span>

                        <span>
                          Days to expiry:{" "}
                          <strong>
                            {strategy.days_to_expiry ??
                              "Not available"}
                          </strong>
                        </span>

                        <span>
                          Pending obligations:{" "}
                          <strong>
                            {
                              strategy.pending_obligations
                            }
                          </strong>
                        </span>

                        <span>
                          Overdue obligations:{" "}
                          <strong>
                            {
                              strategy.overdue_obligations
                            }
                          </strong>
                        </span>
                      </div>

                      <div className="contract-ai-panel__section">
                        <h5>
                          Why this strategy?
                        </h5>

                        <ul>
                          {Array.isArray(
                            strategy.reasons
                          ) &&
                            strategy.reasons.map(
                              (
                                reason,
                                index
                              ) => (
                                <li
                                  key={`${contract.id}-${index}`}
                                >
                                  {reason}
                                </li>
                              )
                            )}
                        </ul>
                      </div>

                      {strategy.alternative_strategy && (
                        <div className="contract-ai-panel__section">
                          <h5>
                            Alternative
                            Strategy
                          </h5>

                          <p>
                            {
                              strategy.alternative_strategy
                            }
                          </p>
                        </div>
                      )}

                      <div className="contract-ai-panel__section">
                        <h5>
                          Suggested Action
                        </h5>

                        <p>
                          {
                            strategy.suggested_action
                          }
                        </p>
                      </div>

                      <div className="contract-ai-panel__notice">
                        AI provides decision
                        support only. The final
                        renewal decision must be
                        approved by an authorized
                        user.
                      </div>
                    </div>
                  )}
                </article>
              );
            }
          )}

          {actionMessage && (
            <div className="contract-action-message">
              {actionMessage}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ExpiringContracts;