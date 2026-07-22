import React, { useEffect, useState } from "react";
import {
  Upload,
  Download,
  Plus,
} from "lucide-react";

import SummaryCards from "../components/ContractRepository/SummaryCards";
import ContractSearch from "../components/ContractRepository/ContractSearch";
import FilterTabs from "../components/ContractRepository/FilterTabs";
import ViewToggle from "../components/ContractRepository/ViewToggle";
import ContractTable from "../components/ContractRepository/ContractTable";
import ViewContractModal from "../components/ContractRepository/ViewContractModal";
import NewContractModal from "../components/ContractRepository/NewContractModal";

import {
  getContracts,
  deleteContract,
} from "../services/contractAPI";

import "../styles/contract-repository.css";

export default function ContractRepository() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedContract, setSelectedContract] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setLoading(true);

    try {
      const data = await getContracts();
      setContracts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load contracts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this contract?"
  );

  if (!confirmDelete) return;

  try {
    await deleteContract(id);
    loadContracts();
  } catch (err) {
    console.error(err);
    alert("Failed to delete contract.");
  }
};

const handleExport = () => {
  if (contracts.length === 0) {
    alert("No contracts available to export.");
    return;
  }

  const headers = [
    "Contract Name",
    "Contract Number",
    "Vendor",
    "Department",
    "Type",
    "Status",
    "Risk Level",
    "Owner",
    "Renewal Type",
    "Contract Value",
    "Start Date",
    "End Date",
    "Description",
  ];

  const rows = contracts.map((contract) => [
    contract.contract_name,
    contract.contract_number,
    contract.vendor,
    contract.department,
    contract.contract_type,
    contract.status,
    contract.risk_level,
    contract.owner,
    contract.renewal_type,
    contract.contract_value,
    contract.start_date,
    contract.end_date,
    contract.description,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${value ?? ""}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `contracts_${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

  return (
    <div className="contract-repository-page">

      {/* Header */}

      <div className="contract-repository-header">

        <div className="header-left">
          <h1>Contract Repository</h1>

          <p>
            Manage, search and organize all contracts from one place.
          </p>

          <span className="last-updated">
            Last Updated: Today • 09:45 AM
          </span>
        </div>

        <div className="header-actions">

          <button
            className="outline-btn"
            onClick={handleExport}
          >
            <Download size={18} />
            Export
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingContract(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            New Contract
          </button>

        </div>

      </div>

      {/* Summary */}

      <SummaryCards contracts={contracts} />

      {/* Search */}

      <ContractSearch
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />

      {/* Toolbar */}

      <div className="filter-toolbar">

        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <ViewToggle
          view={view}
          setView={setView}
        />

      </div>

      {/* Grid / Table */}

      {loading ? (
        <p>Loading contracts...</p>
      ) : (
        <ContractTable
          contracts={contracts}
          searchTerm={searchTerm}
          activeTab={activeTab}
          view={view}

          onView={(contract) => {
            setSelectedContract(contract);
            setShowViewModal(true);
          }}

          onEdit={(contract) => {
            setEditingContract(contract);
            setShowAddModal(true);
          }}

          onDelete={handleDelete}
        />
      )}

      {/* View Modal */}

      {showViewModal && selectedContract && (
        <ViewContractModal
          contract={selectedContract}
          onClose={() => {
            setShowViewModal(false);
            setSelectedContract(null);
          }}
        />
      )}

      {/* Add / Edit Modal */}

      {showAddModal && (
        <NewContractModal
          contract={editingContract}
          onClose={() => {
            setEditingContract(null);
            setShowAddModal(false);
          }}
          onSuccess={() => {
            setEditingContract(null);
            setShowAddModal(false);
            loadContracts();
          }}
        />
      )}

    </div>
  );
}