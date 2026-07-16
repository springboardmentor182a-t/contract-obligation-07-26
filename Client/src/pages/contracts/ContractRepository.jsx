import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import { CONTRACT_API_URL } from "../../config/api";
import { saveAs } from "file-saver";
import axios from 'axios';
import './Contracts.css';

import ContractDetails from './ContractDetails';

const ContractRepository = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal & Edit tracking states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContractId, setCurrentContractId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  // Dynamic Form Field Payload state (Fully Sync'd with Backend Schemas)
  const [formData, setFormData] = useState({
    title: '',
    vendor: '',
    type: 'SaaS License',
    value: '',
    start_date: '',
    end_date: '',
    owner: '',
    status: 'Active',
    compliance: 90,
    description: '',
    auto_renewal: 'N/A',
    payment_terms: 'N/A',
    governing_law: 'N/A',
    liability_cap: 'N/A'
  });

  // --- READ: Fetch records from backend ---
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(CONTRACT_API_URL, {
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined
        }
      });
      
      // Safety Check: Verify response.data is actually an array before setting state
      if (Array.isArray(response.data)) {
        setContracts(response.data);
      } else {
        console.error("Expected an array of contracts, but received:", response.data);
        setContracts([]); 
      }
    } catch (error) {
      console.error("Backend connection failed:", error);
      setContracts([]); // Fallback to avoid crashing when offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContracts();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- EXPORT TO EXCEL ---
  const handleExport = () => {
    if (!Array.isArray(contracts) || contracts.length === 0) {
      alert("No data available to export.");
      return;
    }

    const exportData = contracts.map((contract) => ({
      ID: contract.id,
      Title: contract.title,
      Vendor: contract.vendor,
      Type: contract.type,
      Value: contract.value,
      "Start Date": contract.start_date,
      "End Date": contract.end_date,
      Owner: contract.owner,
      Status: contract.status,
      Compliance: `${contract.compliance}%`,
      Description: contract.description,
      "Auto Renewal": contract.auto_renewal,
      "Payment Terms": contract.payment_terms,
      "Governing Law": contract.governing_law,
      "Liability Cap": contract.liability_cap
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });

    saveAs(file, "Contracts.xlsx");
  };

  // --- CREATE & UPDATE: Combined submit handler ---
  const handleSubmitContract = async (e) => {
    e.preventDefault();

    // 1. Convert value string safely into a clean Float
    const rawValue = formData.value.toString();
    const numericValue = parseFloat(rawValue.replace(/[\$,M\s]/gi, '')) || 0;

    // 2. Map compliance safely to a pure integer matching your database schemas
    const complianceInt = parseInt(formData.compliance, 10) || 0;

    // 3. Match backend requirements perfectly
    const payload = {
      title: formData.title,
      vendor: formData.vendor,
      type: formData.type,
      value: numericValue,
      start_date: formData.start_date,
      end_date: formData.end_date, 
      owner: formData.owner,
      status: formData.status,
      compliance: complianceInt,
      description: formData.description || "No description provided for this contract.",
      auto_renewal: formData.auto_renewal || "N/A",
      payment_terms: formData.payment_terms || "N/A",
      governing_law: formData.governing_law || "N/A",
      liability_cap: formData.liability_cap || "N/A"
    };

    try {
      if (isEditing) {
        await axios.put(`${CONTRACT_API_URL}/${currentContractId}`, payload);
      } else {
        await axios.post(CONTRACT_API_URL, payload);
      }
      closeModal();
      fetchContracts(); 
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("FastAPI Validation Error Details:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Failed to save contract record:", error.message);
      }
    }
  };

  // --- DELETE: Destroy handler with safety prompt ---
  const handleDeleteContract = async (id) => {
    if (window.confirm(`Are you absolutely sure you want to delete contract ${id}?`)) {
      try {
        await axios.delete(`${CONTRACT_API_URL}/${id}`);
        fetchContracts(); 
      } catch (error) {
        console.error("Failed to delete contract record:", error);
      }
    }
  };

  // --- Open Modal for Editing ---
  const openEditModal = (contract) => {
    setIsEditing(true);
    setCurrentContractId(contract.id);
    
    // Convert backend percentage score cleanly to a numeric state
    const cleanCompliance = contract.compliance 
      ? parseInt(contract.compliance.toString().replace(/%/g, ''), 10) 
      : 100;

    setFormData({
      title: contract.title,
      vendor: contract.vendor,
      type: contract.type,
      value: contract.value,
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      owner: contract.owner || '',
      status: contract.status,
      compliance: isNaN(cleanCompliance) ? 90 : cleanCompliance,
      description: contract.description || '',
      auto_renewal: contract.auto_renewal || 'N/A',
      payment_terms: contract.payment_terms || 'N/A',
      governing_law: contract.governing_law || 'N/A',
      liability_cap: contract.liability_cap || 'N/A'
    });
    setIsModalOpen(true);
  };
  
  // --- Close and clear form modal safely ---
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentContractId(null);
    setFormData({
      title: '',
      vendor: '',
      type: 'SaaS License',
      value: '',
      start_date: '',
      end_date: '',
      owner: '',
      status: 'Active',
      compliance: 90,
      description: '',
      auto_renewal: 'N/A',
      payment_terms: 'N/A',
      governing_law: 'N/A',
      liability_cap: 'N/A'
    });
  };

  // Helper color logic selector for progress meters
  const getComplianceColor = (val) => {
    const numericVal = parseInt(val, 10) || 0;
    if (numericVal >= 90) return '#10b981'; 
    if (numericVal >= 80) return '#f59e0b'; 
    return '#ef4444'; 
  };

  if (selectedContract) {
    return (
      <ContractDetails 
        contract={selectedContract} 
        onBack={() => setSelectedContract(null)} 
        onEditClick={openEditModal}
      />
    );
  }

  return (
    <div className="repository-container">
      
      {/* Title Bar Section */}
      <div className="header-row">
        <div>
          <h1 className="title-main">Contract Repository</h1>
          <p className="subtitle-count">{Array.isArray(contracts) ? contracts.length : 0} contracts total</p>
        </div>
        <div className="action-button-group">
          <button className="btn-export" onClick={handleExport}>
            📄 Export
          </button>
          <button
            className="btn-create"
            onClick={() => {
              setIsEditing(false);
              setCurrentContractId(null);
              setFormData({
                title: '',
                vendor: '',
                type: 'SaaS License',
                value: '',
                start_date: '',
                end_date: '',
                owner: '',
                status: 'Active',
                compliance: 90,
                description: '',
                auto_renewal: 'N/A',
                payment_terms: 'N/A',
                governing_law: 'N/A',
                liability_cap: 'N/A'
              });
              setIsModalOpen(true);
            }}
          >
            + New Contract
          </button>
        </div>
      </div>

      {/* Filter Block Panel */}
      <div className="filter-panel">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search contracts..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {['All', 'Active', 'Renewal Due', 'Under Review', 'Expired'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn-filter ${statusFilter === status ? 'active' : 'inactive'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">Loading live repository entries...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header">ID</th>
                <th className="table-header">Title / Vendor</th>
                <th className="table-header">Type</th>
                <th className="table-header">Value</th>
                <th className="table-header">End Date</th>
                <th className="table-header">Owner</th>
                <th className="table-header">Status</th>
                <th className="table-header">Compliance</th>
                <th className="table-header actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(contracts) && contracts.length > 0 ? (
                contracts.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="cell-mono">{item.id}</td>
                    
                    <td 
                      className="cell-data" 
                      onClick={() => setSelectedContract(item)} 
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="contract-title" style={{ color: '#1e3a8a', fontWeight: '600' }}>
                        {item.title}
                      </div>
                      <div className="contract-vendor">{item.vendor}</div>
                    </td>

                    <td className="cell-data type-text">{item.type}</td>
                    <td className="cell-data value-text">
                      {typeof item.value === 'number' ? `$${item.value.toFixed(2)}M` : item.value}
                    </td>
                    <td className="cell-data date-text">{item.end_date}</td>
                    <td className="cell-data owner-text">{item.owner || 'N/A'}</td>
                    <td className="cell-data">
                      <span className={`status-badge ${
                        item.status === 'Active' ? 'active-status' : 
                        item.status === 'Renewal Due' ? 'renewal-status' : 
                        item.status === 'Expired' ? 'expired-status' : 'review-status'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="cell-data compliance-cell">
                      <div className="compliance-wrapper">
                        <div className="progress-bar-bg">
                          <div 
                            className="progress-bar-fill" 
                            style={{ 
                              width: `${parseInt(item.compliance, 10) || 0}%`, 
                              backgroundColor: getComplianceColor(item.compliance) 
                            }}
                          />
                        </div>
                        <span className="compliance-text">
                          {item.compliance}%
                        </span>
                      </div>
                    </td>
                    <td className="cell-data actions-col">
                      <div className="actions-wrapper">
                        <button 
                          className="action-icon-btn" 
                          title="View"
                          onClick={() => setSelectedContract(item)}
                        >
                          👁️
                        </button>
                        <button className="action-icon-btn" title="Edit" onClick={() => openEditModal(item)}>✏️</button>
                        <button className="action-icon-btn delete" title="Delete" onClick={() => handleDeleteContract(item.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- FORM OVERLAY MODAL WINDOW --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{isEditing ? 'Modify Contract Details' : 'Create New Contract'}</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmitContract}>
              <div className="form-grid">
                
                <div className="form-group">
                  <label className="form-label">Contract Title</label>
                  <input type="text" name="title" required className="form-input" placeholder="e.g. AWS Production Infrastructure" value={formData.title} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Vendor Name</label>
                  <input type="text" name="vendor" required className="form-input" placeholder="e.g. Amazon Web Services" value={formData.vendor} onChange={handleInputChange} />
                </div>

                <div className="form-row-half">
                  <div className="form-group">
                    <label className="form-label">Contract Type</label>
                    <select name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                      <option>SaaS License</option>
                      <option>Cloud Services</option>
                      <option>IaaS</option>
                      <option>Software License</option>
                      <option>Hardware & Support</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contract Value (Millions)</label>
                    <input type="text" name="value" required className="form-input" placeholder="e.g. 1.20" value={formData.value} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row-half">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" name="start_date" required className="form-input" value={formData.start_date} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" name="end_date" required className="form-input" value={formData.end_date} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row-half">
                  <div className="form-group">
                    <label className="form-label">Contract Owner</label>
                    <input type="text" name="owner" required className="form-input" placeholder="e.g. Sarah Chen" value={formData.owner} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                      <option>Active</option>
                      <option>Renewal Due</option>
                      <option>Under Review</option>
                      <option>Expired</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Compliance Score (%)</label>
                  <input type="number" name="compliance" min="0" max="100" className="form-input" value={formData.compliance} onChange={handleInputChange} />
                </div>

                {/* --- ADDED DETAILED DYNAMIC FIELDS FOR METRICS --- */}
                <div className="form-group">
                  <label className="form-label">Contract Summary Description</label>
                  <textarea 
                    name="description" 
                    rows="3" 
                    className="form-input" 
                    placeholder="Enter short outline details of contract requirements..." 
                    value={formData.description} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row-half">
                  <div className="form-group">
                    <label className="form-label">Auto-Renewal Clause</label>
                    <input type="text" name="auto_renewal" className="form-input" placeholder="e.g. Yearly automatic" value={formData.auto_renewal} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Terms</label>
                    <input type="text" name="payment_terms" className="form-input" placeholder="e.g. Net 30" value={formData.payment_terms} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row-half">
                  <div className="form-group">
                    <label className="form-label">Governing Law</label>
                    <input type="text" name="governing_law" className="form-input" placeholder="e.g. California, USA" value={formData.governing_law} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Liability Cap</label>
                    <input type="text" name="liability_cap" className="form-input" placeholder="e.g. 100% contract value" value={formData.liability_cap} onChange={handleInputChange} />
                  </div>
                </div>

              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-submit"
                >
                  {isEditing ? "Update Contract" : "Create Contract"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContractRepository;