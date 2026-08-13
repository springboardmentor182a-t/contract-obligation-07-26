import { Eye } from "lucide-react";
import { useState } from "react";
import ComplianceDetailsModal from "./ComplianceDetailsModal";

function riskBadgeClass(risk) {
  switch (risk?.toLowerCase()) {
    case "high":
      return "status-badge status-badge-failed";
    case "medium":
      return "status-badge status-badge-warning";
    default:
      return "status-badge status-badge-passed";
  }
}

export default function ComplianceTable({ data = [] }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="section-card ai-compliance-table-card">
        <div className="section-header">
          <h3 className="section-heading">
            AI Compliance Records
          </h3>

          <span className="control-count-badge">
            {data.length} Record{data.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-responsive">
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Vendor</th>
                <th>Risk</th>
                <th>Approval</th>
                <th>Documents</th>
                <th>Obligations</th>
                <th>Deadline</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "24px",
                    }}
                  >
                    No records match your current filters.
                  </td>
                </tr>
              ) : (
                data.map((record) => (
                  <tr key={record.contract_id}>
                    <td>{record.contract_name}</td>

                    <td>{record.vendor}</td>

                    <td>
                      <span className={riskBadgeClass(record.risk_level)}>
                        {record.risk_level}
                      </span>
                    </td>

                    <td>{record.approval_status}</td>

                    <td>
                      {record.mandatory_documents
                        ? "Available"
                        : "Missing"}
                    </td>

                    <td>{record.overdue_obligations}</td>

                    <td>{record.next_deadline || "-"}</td>

                    <td>
                      <button
                        className="download-hyperlink"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowModal(true);
                        }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ComplianceDetailsModal
        isOpen={showModal}
        record={selectedRecord}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
      />
    </>
  );
}