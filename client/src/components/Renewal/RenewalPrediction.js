import { RefreshCcw, Sparkles } from "lucide-react";
import { useState } from "react";

function RenewalPrediction({
  data = [],
  defaultVisibleCount = 3,
  onRefresh,
  isRefreshing = false,
}) {
  const [showAll, setShowAll] = useState(false);

  const predictions = Array.isArray(data) ? data : [];

  const visiblePredictions = showAll
    ? predictions
    : predictions.slice(0, defaultVisibleCount);

  return (
    <section className="renewal-card renewal-card--prediction">
      <div className="section-heading">
          <div className="renewal-prediction-title">
            <Sparkles className="prediction-title-icon" size={22} />

            <div>
              <h2>AI Renewal Prediction</h2>
              <p className="prediction-subtitle">
                Suggested actions based on contract signals
              </p>
            </div>
          </div>

          <div className="renewal-prediction-controls">

            <button
              className="prediction-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCcw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>

            <button
              className="prediction-toggle-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : "Show All"}

              <span className="prediction-count">
                {predictions.length}
              </span>
            </button>

          </div>

        </div>

      <div className="prediction-list">
  {predictions.length === 0 ? (
    <div className="prediction-empty-state">
      <Sparkles size={32} />
      <h3>No AI predictions available</h3>
      <p>
        AI recommendations will appear here once contract data has been
        analyzed.
      </p>
    </div>
  ) : (
    visiblePredictions.map((item) => {
      let progressClass = "progress-bar progress-bar--red";
      let percentageClass =
        "prediction-percentage prediction-percentage--red";
      let badgeClass =
        "prediction-badge prediction-badge--red";
      let badgeText = "Low Confidence";

      if (item.confidence >= 90) {
        progressClass =
          "progress-bar progress-bar--emerald";
        percentageClass =
          "prediction-percentage prediction-percentage--emerald";
        badgeClass =
          "prediction-badge prediction-badge--emerald";
        badgeText = "High Confidence";
      } else if (item.confidence >= 75) {
        progressClass =
          "progress-bar progress-bar--blue";
        percentageClass =
          "prediction-percentage prediction-percentage--blue";
        badgeClass =
          "prediction-badge prediction-badge--blue";
        badgeText = "Recommended";
      } else if (item.confidence >= 40) {
        progressClass =
          "progress-bar progress-bar--amber";
        percentageClass =
          "prediction-percentage prediction-percentage--amber";
        badgeClass =
          "prediction-badge prediction-badge--amber";
        badgeText = "Moderate";
      }

      return (
        <article
          key={item.id}
          className="prediction-item"
        >
          <div className="prediction-item__header">
            <div>
              <p className="prediction-item__meta">
                {item.id}
              </p>

              <h3 className="prediction-item__label">
                {item.title}
              </h3>
            </div>

            <div className="prediction-right">
              <span className={badgeClass}>
                {badgeText}
              </span>

              <span className={percentageClass}>
                {item.confidence}%
              </span>
            </div>
          </div>

          <div className="progress-track">
            <div
              className={progressClass}
              style={{
                width: `${item.confidence}%`,
              }}
            />
          </div>
        </article>
      );
    })
  )}
</div>
    </section>
  );
}

export default RenewalPrediction;