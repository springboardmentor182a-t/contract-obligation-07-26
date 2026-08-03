import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function getAlertIcon(severity) {
  switch (severity?.toLowerCase()) {
    case "high":
      return (
        <AlertCircle
          size={18}
          className="text-red"
        />
      );

    case "medium":
      return (
        <AlertTriangle
          size={18}
          className="text-amber"
        />
      );

    default:
      return (
        <CheckCircle
          size={18}
          className="text-green"
        />
      );
  }
}

export default function AlertsPanel({ alerts = [] }) {
  return (
    <div className="section-card ai-alerts-card">

      <div className="section-header">
        <h3 className="section-heading">
          AI Compliance Alerts
        </h3>

        <span className="control-count-badge">
          {alerts.length} Alerts
        </span>
      </div>

      {alerts.length === 0 ? (

        <div className="empty-logs-state">
          No compliance alerts.
        </div>

      ) : (

        <div className="ai-alert-list">

          {alerts.map((alert, index) => (

            <div
              key={index}
              className="ai-alert-item"
            >

              <div className="ai-alert-icon">
                {getAlertIcon(alert.severity)}
              </div>

              <div className="ai-alert-content">

                <strong>
                  {alert.title}
                </strong>

                <p>
                  {alert.message}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}