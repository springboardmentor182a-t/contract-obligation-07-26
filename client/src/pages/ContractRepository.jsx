import React, { useState } from 'react';
import Modal from '../components/Modals/Modal';
import { jsPDF } from 'jspdf';
import { useFetchContracts } from '../hooks/useFetchContracts';

const ContractRepository = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { data: contracts, setData: setContracts } = useFetchContracts('/api/contracts/');
  const [viewContract, setViewContract] = useState(null);


  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = String(contract.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(contract.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(contract.owner || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || contract.status === statusFilter;
    const matchesType = typeFilter === '' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDownload = (contract) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Primary color
    doc.text(`Contract: ${contract.id}`, 20, 20);
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    
    doc.text(`Vendor: ${contract.vendor}`, 20, 40);
    doc.text(`Type: ${contract.type}`, 20, 50);
    doc.text(`Value: ${contract.value}`, 20, 60);
    doc.text(`Owner: ${contract.owner}`, 20, 70);
    doc.text(`Status: ${contract.status}`, 20, 80);
    
    doc.save(`${contract.id}.pdf`);
  };

  const handleAddContract = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ownerName = localStorage.getItem('userName');
    const newContract = {
      id: formData.get('id'),
      vendor: formData.get('vendor'),
      type: formData.get('type'),
      value: formData.get('value'),
      status: 'Pending',
      owner: ownerName
    };
    try {
      const res = await fetch('/api/contracts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContract)
      });
      if (res.ok) {
        const added = await res.json();
        setContracts(prev => [...prev, added]);
        setIsModalOpen(false);
      }
    } catch(err) { console.error(err); }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) return alert('File is empty or invalid format.');
      
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const ownerName = localStorage.getItem('userName');
      
      const newContracts = [];
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(val => val.trim());
        if (row.length !== headers.length) continue;
        
        const contract = { owner: ownerName, status: 'Pending' };
        headers.forEach((header, index) => {
          if (header === 'id' || header === 'vendor' || header === 'type' || header === 'value' || header === 'status') {
            contract[header] = row[index];
          }
        });
        
        if (!contract.id || !contract.vendor) continue;
        newContracts.push(contract);
      }
      
      let addedContracts = [];
      for (const contract of newContracts) {
        try {
          const res = await fetch('/api/contracts/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contract)
          });
          if (res.ok) {
            const added = await res.json();
            addedContracts.push(added);
          }
        } catch(err) { console.error('Error uploading contract', contract.id, err); }
      }
      
      setContracts(prev => [...prev, ...addedContracts]);
      alert(`Successfully uploaded ${addedContracts.length} contracts!`);
      e.target.value = null; // reset input
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Contract Repository</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Manage, search, and upload all your corporate contracts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleBulkUpload}
          />
          <button className="premium-button" style={{ backgroundColor: '#fff', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center' }} onClick={() => fileInputRef.current?.click()}>
            <i className="fa-solid fa-file-csv" style={{ marginRight: '8px' }}></i> Upload CSV
          </button>
          <button className="premium-button" style={{ width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center' }} onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Add New Contract
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e5e7eb' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }}></i>
          <input 
            type="text" 
            className="premium-input" 
            placeholder="Search by vendor, ID, or owner..." 
            style={{ paddingLeft: '44px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="premium-input" style={{ width: '200px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Expired">Expired</option>
        </select>
        <select className="premium-input" style={{ width: '200px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="NDA">NDA</option>
          <option value="MSA">MSA</option>
          <option value="SLA">SLA</option>
        </select>
      </div>

      {/* Contracts Table */}
      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Counterparty</th>
              <th>Type</th>
              <th>Value</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map((contract, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>{contract.id}</td>
                <td style={{ fontWeight: 500 }}>{contract.vendor}</td>
                <td>{contract.type}</td>
                <td>{contract.value}</td>
                <td>{contract.owner}</td>
                <td>
                  <span className={`badge ${String(contract.status || '').toLowerCase()}`}>
                    {contract.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => setViewContract(contract)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginRight: '12px' }} title="View Details">
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  <button onClick={() => handleDownload(contract)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Download PDF">
                    <i className="fa-solid fa-download"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredContracts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No contracts found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contract Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload New Contract">
        <form onSubmit={handleAddContract}>
          <div className="form-group">
            <label className="form-label">Contract ID</label>
            <input type="text" name="id" className="premium-input" placeholder="e.g. CTR-2026-006" required />
          </div>
          <div className="form-group">
            <label className="form-label">Counterparty / Vendor Name</label>
            <input type="text" name="vendor" className="premium-input" placeholder="e.g. Acme Corp" required />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Contract Type</label>
              <select name="type" className="premium-input" required>
                <option value="NDA">NDA</option>
                <option value="MSA">MSA</option>
                <option value="SLA">SLA</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Contract Value</label>
              <input type="text" name="value" className="premium-input" placeholder="$0.00" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Upload File (PDF)</label>
            <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '32px', color: 'var(--secondary-color)', marginBottom: '12px' }}></i>
              <div style={{ fontWeight: 500 }}>Click to upload or drag and drop</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>PDF, DOCX up to 10MB</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="premium-button" style={{ backgroundColor: '#e5e7eb', color: 'var(--text-primary)', width: 'auto', padding: '10px 20px', marginTop: 0 }}>Cancel</button>
            <button type="submit" className="premium-button" style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}>Save Contract</button>
          </div>
        </form>
      </Modal>

      {/* View Contract Modal */}
      {viewContract && (
        <Modal isOpen={true} onClose={() => setViewContract(null)} title="Contract Details">
          <div style={{ padding: '16px 0', fontSize: '15px', color: 'var(--text-primary)' }}>
            <p style={{ margin: '8px 0' }}><strong>ID:</strong> {viewContract.id}</p>
            <p style={{ margin: '8px 0' }}><strong>Vendor:</strong> {viewContract.vendor}</p>
            <p style={{ margin: '8px 0' }}><strong>Type:</strong> {viewContract.type}</p>
            <p style={{ margin: '8px 0' }}><strong>Value:</strong> {viewContract.value}</p>
            <p style={{ margin: '8px 0' }}><strong>Owner:</strong> {viewContract.owner}</p>
            <p style={{ margin: '8px 0' }}><strong>Status:</strong> {viewContract.status}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button onClick={() => setViewContract(null)} className="premium-button" style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContractRepository;
