import React, { useEffect, useState } from "react";
import {
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
import InsightsModal from "../components/ContractRepository/InsightsModal";

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
  const [insightsContract, setInsightsContract] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setLoading(true);

    try {
      const data = await getContracts();
      console.log("API Response:", data);
      console.log("Is Array:", Array.isArray(data));
      console.log("Type:", typeof data);

      setContracts(Array.isArray(data) ? data : []);
      

      if (data && data.length > 0) {
        const latest = data.reduce((prev, current) =>
          new Date(prev.updated_at || prev.created_at || 0) > new Date(current.updated_at || current.created_at || 0)
            ? prev
            : current
        );
        setLastUpdated(latest.updated_at || latest.created_at || new Date().toISOString());
      } else {
        setLastUpdated(null);
      }
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
      await loadContracts();
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

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "No updates";

    const date = new Date(timestamp.endsWith("Z") ? timestamp : timestamp + "Z");
    if (isNaN(date.getTime())) {
      return timestamp;
    }
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today • ${time}`;

    if (isYesterday) return `Yesterday • ${time}`;

    return `${date.toLocaleDateString()} • ${time}`;
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
            Last Updated: {formatLastUpdated(lastUpdated)}
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

          onInsights={(contract) => {
            setInsightsContract(contract);
          }}
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

      {insightsContract && (
        <InsightsModal
          contract={insightsContract}
          onClose={() => setInsightsContract(null)}
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
