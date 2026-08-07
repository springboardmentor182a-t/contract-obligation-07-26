import { X } from "lucide-react";

export default function ComplianceDetailsModal({
  isOpen,
  onClose,
  record,
}) {
  if (!isOpen || !record) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-content compliance-details-modal">

        <div className="modal-header">

          <h2>Compliance Details</h2>

          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        <div className="compliance-details-grid">

          <div>
            <label>Contract</label>
            <p>{record.contract_name}</p>
          </div>

          <div>
            <label>Vendor</label>
            <p>{record.vendor}</p>
          </div>

          <div>
            <label>Risk Level</label>
            <p>{record.risk_level}</p>
          </div>

          <div>
            <label>Compliance Status</label>
            <p>{record.compliance_status}</p>
          </div>

          <div>
            <label>Approval Status</label>
            <p>{record.approval_status}</p>
          </div>

          <div>
            <label>Mandatory Documents</label>
                <p>
                {record.mandatory_documents ? (
                    <span className="status-badge status-badge-passed">
                    Available
                    </span>
                ) : (
                    <span className="status-badge status-badge-failed">
                    Missing
                    </span>
                )}
                </p>
          </div>

          <div>
            <label>Overdue Obligations</label>
            <p>{record.overdue_obligations}</p>
          </div>

          <div>
            <label>Next Deadline</label>
            <p>{record.next_deadline || "-"}</p>
          </div>

        </div>

        <div className="recommendation-box">

          <h4>AI Recommendation</h4>

          <p>{record.recommendation}</p>

        </div>

      </div>

    </div>
  );
}