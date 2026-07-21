import BASE_URL from "../../config/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import ContractTable from "../../components/ContractTable/ContractTable";


import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiShield,
} from "react-icons/fi";

import "../../styles/repository.css";


function ContractRepository() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendor, setVendor] = useState("");
  const [contractType, setContractType] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
  const fetchContracts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/contracts`);

      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }

      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      alert(error.message);
    }
  };

  fetchContracts();
}, []);
  const totalContracts = contracts.length;

  const activeContracts = contracts.filter(
    (contract) => contract.status === "Active"
  ).length;

  const expiringSoon = contracts.filter(
   (contract) => contract.days_remaining <= 90
  ).length;

  const averageCompliance =
    contracts.length > 0
     ? Math.round(
          contracts.reduce(
           (sum, contract) => sum + contract.compliance,
            0
        ) / contracts.length
      )
    : 0;
    const cards = [
  {
    icon: <FiFileText />,
    title: "Total Contracts",
    value: totalContracts,
    sub: "All Contracts",
    color: "#ede9fe",
  },
  {
    icon: <FiCheckCircle />,
    title: "Active Contracts",
    value: activeContracts,
    sub: "Currently Active",
    color: "#dcfce7",
  },
  {
    icon: <FiClock />,
    title: "Expiring Soon",
    value: expiringSoon,
    sub: "Next 90 Days",
    color: "#fef3c7",
  },
  {
    icon: <FiShield />,
    title: "Compliance",
    value: `${averageCompliance}%`,
    sub: "Average Score",
    color: "#dbeafe",
  },
];
const resetFilters = () => {
  setSearchTerm("");
  setVendor("");
  setContractType("");
  setOwner("");
  setStatus("");
};
const exportContracts = () => {
  const data = JSON.stringify(filteredContracts, null, 2);

  const blob = new Blob([data], {
    type: "application/json",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "contracts.json";

  link.click();

  window.URL.revokeObjectURL(url);
};
const filteredContracts = contracts.filter((contract) => {

  const matchesSearch =
  (contract.contract || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  (contract.company || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  (contract.owner || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  (contract.status || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesVendor =
    vendor === "" || contract.company === vendor;

  const matchesType =
    contractType === "" ||
    contract.category === contractType;

  const matchesOwner =
    owner === "" || contract.owner === owner;

  const matchesStatus =
    status === "" || contract.status === status;
  const matchesTab =
    activeTab === "All" ||
    (activeTab === "Active" &&
      contract.status === "Active") ||
    (activeTab === "Expiring" &&
     contract.days_remaining <= 90) ||
    (activeTab === "Archived" &&
      (contract.status === "Archived" ||
        contract.status === "Expired"));

  return (
    matchesSearch &&
    matchesVendor &&
    matchesType &&
    matchesOwner &&
    matchesStatus && 
    matchesTab
  );
});


  return (
    <div className="repository">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="repository-body">
          <div className="page-heading">
            <h1>Contract Repository</h1>

            <p>
              Manage and monitor all your contracts in one place.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="stats-grid">
            {cards.map((card) => (
              <div className="stat-card" key={card.title}>
                <div
                  className="stat-icon"
                  style={{ background: card.color }}
                >
                  {card.icon}
                </div>

                <div>
                  <h4>{card.title}</h4>

                  <h2>{card.value}</h2>

                  <span>{card.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="repository-top">
            <div className="tabs">
              <button
                className={activeTab === "All" ? "active" : ""}
                onClick={() => setActiveTab("All")}
              >
                All
              </button>

              <button
                className={activeTab === "Active" ? "active" : ""}
                onClick={() => setActiveTab("Active")}
              >
                Active
              </button>

              <button
                className={activeTab === "Expiring" ? "active" : ""}
                onClick={() => setActiveTab("Expiring")}
              >
                Expiring
              </button>

              <button
                className={activeTab === "Archived" ? "active" : ""}
                onClick={() => setActiveTab("Archived")}
              >
                Archived
              </button>
            </div>

            <div className="top-buttons">
              <button
                className="export"
                onClick={exportContracts}
              >
                Export
              </button>

              <button
                className="new-contract"
                onClick={() => navigate("/add-contract")}
              >
                + New Contract
              </button>
            </div>
          </div>

          <SearchBar
            contracts={contracts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            vendor={vendor}
            setVendor={setVendor}
            contractType={contractType}
            setContractType={setContractType}
            owner={owner}
            setOwner={setOwner}
            status={status}
            setStatus={setStatus}
            resetFilters={resetFilters}
          />

          <ContractTable contracts={filteredContracts} />
        </div>
      </div>
    </div>
  );
}

export default ContractRepository;