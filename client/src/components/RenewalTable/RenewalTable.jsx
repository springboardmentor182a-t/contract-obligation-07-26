import { useState } from "react";
import "./RenewalTable.css";
import { deleteRenewal } from "../../services/renewalService";
import ViewRenewalModal from "../ViewRenewalModal/ViewRenewalModal";
import EditRenewalModal from "../EditRenewalModal/EditRenewalModal";
import { saveAs } from "file-saver";

import {
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdVisibility,
  MdEdit,
} from "react-icons/md";

const RenewalTable = ({ renewals }) => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const [viewRenewal, setViewRenewal] = useState(null);

  // Delete
  const handleDelete = async (id) => {
  if (!window.confirm("Delete this renewal?")) return;

  try {
    await deleteRenewal(id);

    alert("Deleted successfully");
    window.location.reload();

  } catch (error) {
    console.log("Delete Error:", error);
    console.log("Response:", error.response);

    alert(error.response?.data?.message || "Delete failed");
  }

  };
const handleExport = () => {
  if (!renewals.length) {
    alert("No renewals to export");
    return;
  }

  const headers = [
    "Contract",
    "Counterparty",
    "Renewal Type",
    "Renewal Date",
    "Reminder Days",
    "Status",
  ];

  const rows = renewals.map((item) => [
    item.contract_name,
    item.client_name,
    item.renewal_type,
    new Date(item.renewal_date).toLocaleDateString(),
    item.reminder_days,
    item.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "Renewals.csv");
};
  return (
    <div className="renewal-card">

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "Upcoming" ? "active" : ""}
          onClick={() => setActiveTab("Upcoming")}
        >
          Upcoming Renewals
        </button>

        <button>Overdue Renewals</button>

        <button>Recently Renewed</button>
      </div>

      {/* Header */}
      <div className="table-top">

        <h2>Renewal Contracts</h2>

        <div className="actions">

          <div className="search">
            <MdSearch />
            <input placeholder="Search contracts..." />
          </div>

          <button className="filter">
            <MdFilterList />
            Filters
          </button>

          <button
  className="export"
  onClick={handleExport}
>
  <MdFileDownload />
  Export
</button>

        </div>

      </div>

      {/* Table */}

      <table>

        <thead>

          <tr>
            <th>Contract</th>
            <th>Counterparty</th>
            <th>Renewal Type</th>
            <th>Next Renewal Date</th>
            <th>Days Left</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {renewals.map((item) => (

            <tr key={item.id}>

              <td className="contract">
                <div className="contract-icon">📄</div>
                {item.contract_name}
              </td>

              <td>{item.client_name}</td>

              <td>{item.renewal_type}</td>

              <td>
                {new Date(item.renewal_date).toLocaleDateString()}
              </td>

              <td className="days">
                {item.reminder_days} days
              </td>

              <td>
                <span className="status">
                  {item.status}
                </span>
              </td>

              <td>

                {/* View */}
                <button
                  className="view"
                  onClick={() => setViewRenewal(item)}
                >
                  <MdVisibility />
                </button>

                {/* Edit */}
                <button
                  className="edit"
                  onClick={() => setSelectedRenewal(item)}
                >
                  <MdEdit />
                </button>

                {/* Delete */}
        <button
  className="delete"
  onClick={() => {
    console.log("Deleting item:", item);
    handleDelete(item.id);
  }}
>
  🗑
</button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="footer">

        <span>
          Showing {renewals.length} contract(s)
        </span>

        <div className="pages">
          <button>‹</button>
          <button className="selected">1</button>
          <button>›</button>
        </div>

      </div>

      {/* View Modal */}
      {viewRenewal && (
        <ViewRenewalModal
          renewal={viewRenewal}
          onClose={() => setViewRenewal(null)}
        />
      )}

      {/* Edit Modal */}
      {selectedRenewal && (
        <EditRenewalModal
          renewal={selectedRenewal}
          onClose={() => setSelectedRenewal(null)}
          onSuccess={() => window.location.reload()}
        />
      )}

    </div>
  );
};

export default RenewalTable;