import React from "react";
import { X } from "lucide-react";

export default function ViewContractModal({
  contract,
  onClose,
}) {
  if (!contract) return null;

  return (
    <div className="modal-overlay">
      <div className="view-contract-modal">
        <div className="modal-header">
          <h2>Contract Details</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">

          <div className="detail-row">
            <span>Contract Name</span>
            <strong>{contract.contract_name}</strong>
          </div>

          <div className="detail-row">
            <span>Contract Number</span>
            <strong>{contract.contract_number}</strong>
          </div>

          <div className="detail-row">
            <span>Vendor</span>
            <strong>{contract.vendor}</strong>
          </div>

          <div className="detail-row">
            <span>Department</span>
            <strong>{contract.department}</strong>
          </div>

          <div className="detail-row">
            <span>Type</span>
            <strong>{contract.contract_type}</strong>
          </div>

          <div className="detail-row">
            <span>Value</span>
            <strong>
              ₹{Number(contract.contract_value).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <strong>{contract.status}</strong>
          </div>

          <div className="detail-row">
            <span>Start Date</span>
            <strong>{contract.start_date}</strong>
          </div>

          <div className="detail-row">
            <span>End Date</span>
            <strong>{contract.end_date}</strong>
          </div>

          <div className="detail-description">
            <span>Description</span>

            <p>
              {contract.description || "No description available."}
            </p>
          </div>

        </div>

        <div className="modal-footer">
          <button
            className="primary-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}