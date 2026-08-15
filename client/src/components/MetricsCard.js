import React from "react";

export default function MetricsCard({
  title,
  value,
  trend,
  trendSubtext,
  trendType,
  icon: Icon,
  iconColor,
  iconBgColor,
}) {
  return (
    <div className="card kpi-card">
      <div className="kpi-left">
        <span className="kpi-title">{title}</span>
        <span className="kpi-value">{value !== undefined && value !== null ? value : "—"}</span>
        <div className="kpi-trend-container">
          {trend ? (
            <div className="kpi-trend">
              <span
                className={
                  trendType === "positive"
                    ? "color-green"
                    : trendType === "warning"
                    ? "color-red"
                    : "text-muted"
                }
              >
                {trend}{" "}
                {trendSubtext && (
                  <span className="text-muted" style={{ fontWeight: 500 }}>
                    {trendSubtext}
                  </span>
                )}
              </span>
            </div>
          ) : (
            <div className="kpi-trend-placeholder" />
          )}
        </div>
      </div>
      {Icon && (
        <div className="kpi-right">
          <div
            className="kpi-icon-circle"
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            <Icon size={20} />
          </div>
        </div>
      )}
    </div>
  );
}
