import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileWarning,
  Lightbulb,
  RefreshCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { getContractInsights } from "../../services/contractAPI";


const formatDate = (value) => {
  if (!value) return "Not available";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const formatDays = (days) => {
  if (days === null || days === undefined) return "Not available";
  if (days < 0) return `${Math.abs(days)} days past end date`;
  if (days === 0) return "Ends today";
  return `${days} days remaining`;
};


export default function InsightsModal({ contract, onClose }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInsights = useCallback(async () => {
    if (!contract?.id) return;

    setLoading(true);
    setError("");

    try {
      const data = await getContractInsights(contract.id);
      setInsights(data);
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      setError(detail || "Unable to generate AI contract insights.");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  if (!contract) return null;

  const contractData = insights?.contract || contract;
  const riskClass = (insights?.risk_level || "low").toLowerCase();

  return (
    <div className="modal-overlay insights-overlay" role="presentation">
      <section
        className="insights-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insights-title"
      >
        <header className="insights-header">
          <div className="insights-title-wrap">
            <span className="insights-title-icon">
              <Sparkles size={22} />
            </span>

            <div>
              <p>AI Contract Insights</p>
              <h2 id="insights-title">{contractData.contract_name}</h2>
              <span>
                {contractData.contract_number} · {contractData.vendor}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="close-btn insights-close-btn"
            onClick={onClose}
            aria-label="Close AI Insights"
          >
            <X size={21} />
          </button>
        </header>

        <div className="insights-body">
          {loading && (
            <div className="insights-state" role="status">
              <Sparkles className="insights-loading-icon" size={34} />
              <h3>Analyzing contract data</h3>
              <p>Calculating deterministic signals and generating the assessment.</p>
            </div>
          )}

          {!loading && error && (
            <div className="insights-state insights-state--error" role="alert">
              <AlertTriangle size={34} />
              <h3>Insights could not be generated</h3>
              <p>{error}</p>
              <button type="button" onClick={loadInsights}>
                <RefreshCcw size={16} />
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && insights && (
            <>
              <div className="insights-overview-grid">
                <article className="insight-overview-card insight-overview-card--score">
                  <div
                    className="health-score-ring"
                    style={{ "--health-score": `${insights.health_score * 3.6}deg` }}
                    aria-label={`Health score ${insights.health_score} out of 100`}
                  >
                    <strong>{insights.health_score}</strong>
                    <span>/ 100</span>
                  </div>

                  <div>
                    <span className="insight-card-label">Contract Health Score</span>
                    <p>Calculated from existing contract signals.</p>
                  </div>
                </article>

                <article className="insight-overview-card">
                  <span className="insight-card-icon insight-card-icon--risk">
                    <AlertTriangle size={20} />
                  </span>
                  <div>
                    <span className="insight-card-label">Overall Risk Level</span>
                    <strong className={`risk-badge ${riskClass}`}>
                      {insights.risk_level} Risk
                    </strong>
                  </div>
                </article>

                <article className="insight-overview-card">
                  <span className="insight-card-icon insight-card-icon--renewal">
                    <CalendarClock size={20} />
                  </span>
                  <div>
                    <span className="insight-card-label">Renewal / End Date</span>
                    <strong>{insights.renewal.status}</strong>
                    <p>
                      {formatDate(insights.renewal.end_date)} ·{" "}
                      {formatDays(insights.renewal.days_remaining)}
                    </p>
                  </div>
                </article>
              </div>

              <div className="insights-summary-grid">
                <section className="insight-section">
                  <div className="insight-section-title">
                    <ClipboardCheck size={19} />
                    <h3>Obligation Summary</h3>
                  </div>

                  <div className="obligation-metrics">
                    <div>
                      <span>Total</span>
                      <strong>{insights.obligations.total}</strong>
                    </div>
                    <div className="obligation-metric--completed">
                      <span>Completed</span>
                      <strong>{insights.obligations.completed}</strong>
                    </div>
                    <div className="obligation-metric--pending">
                      <span>Pending</span>
                      <strong>{insights.obligations.pending}</strong>
                    </div>
                    <div className="obligation-metric--overdue">
                      <span>Overdue</span>
                      <strong>{insights.obligations.overdue}</strong>
                    </div>
                  </div>
                </section>

                <section className="insight-section">
                  <div className="insight-section-title">
                    <FileWarning size={19} />
                    <h3>Compliance Status</h3>
                  </div>

                  <div className="compliance-heading">
                    <strong>{insights.compliance.status}</strong>
                    <span>
                      Percentage: {insights.compliance.percentage ?? "Not available"}
                    </span>
                  </div>

                  <ul className="insight-list insight-list--compact">
                    {insights.compliance.signals.map((signal, index) => (
                      <li key={`compliance-${index}`}>
                        <CheckCircle2 size={15} />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>

                  {insights.compliance.limitation && (
                    <p className="insight-limitation">
                      {insights.compliance.limitation}
                    </p>
                  )}
                </section>
              </div>

              {!insights.ai.available && (
                <div className="insights-ai-notice" role="status">
                  <AlertTriangle size={18} />
                  <div>
                    <strong>AI analysis unavailable</strong>
                    <p>
                      {insights.ai.error_message ||
                        "AI analysis is temporarily unavailable."}
                    </p>
                  </div>
                </div>
              )}

              <section className="insight-section insight-section--assessment">
                <div className="insight-section-title">
                  <Sparkles size={19} />
                  <h3>AI Overall Assessment</h3>
                </div>
                <p>{insights.ai.overall_assessment}</p>
              </section>

              <div className="insights-summary-grid">
                <section className="insight-section">
                  <div className="insight-section-title">
                    <Lightbulb size={19} />
                    <h3>Key Findings</h3>
                  </div>
                  <ul className="insight-list">
                    {insights.ai.key_findings.length > 0 ? (
                      insights.ai.key_findings.map((finding, index) => (
                        <li key={`finding-${index}`}>
                          <span className="insight-list-number">{index + 1}</span>
                          <span>{finding}</span>
                        </li>
                      ))
                    ) : (
                      <li className="insight-list-empty">
                        No AI findings are available.
                      </li>
                    )}
                  </ul>
                </section>

                <section className="insight-section">
                  <div className="insight-section-title">
                    <Target size={19} />
                    <h3>Recommended Actions</h3>
                  </div>
                  <ul className="insight-list">
                    {insights.ai.recommended_actions.length > 0 ? (
                      insights.ai.recommended_actions.map((action, index) => (
                        <li key={`action-${index}`}>
                          <span className="insight-list-number">{index + 1}</span>
                          <span>{action}</span>
                        </li>
                      ))
                    ) : (
                      <li className="insight-list-empty">
                        No AI recommended actions are available.
                      </li>
                    )}
                  </ul>
                </section>
              </div>

              <section className="insight-section score-breakdown">
                <div className="score-breakdown-heading">
                  <div className="insight-section-title">
                    <AlertTriangle size={19} />
                    <h3>Why this score?</h3>
                  </div>
                  <strong>
                    max(0, {insights.score_breakdown.base_score} -{" "}
                    {insights.score_breakdown.total_penalty}) ={" "}
                    {insights.health_score}
                  </strong>
                </div>

                <div className="score-factor-list">
                  {insights.score_breakdown.factors.map((factor, index) => (
                    <div className="score-factor" key={`factor-${index}`}>
                      <div>
                        <strong>{factor.factor}</strong>
                        <p>{factor.detail}</p>
                      </div>
                      <span className={factor.penalty ? "has-penalty" : ""}>
                        {factor.penalty ? `-${factor.penalty}` : "0"} points
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
