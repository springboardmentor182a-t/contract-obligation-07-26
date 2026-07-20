import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, RotateCcw, FolderOpen, MoreVertical } from 'lucide-react';
import Dropdown from '../../components/Buttons/Dropdown';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modals/Modal';
import './Contracts.css';

const ArchivedContracts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [contractToRestore, setContractToRestore] = useState(null);

  const [contracts, setContracts] = useState([
    { id: 'CON-2021-004', name: 'Service Agreement', entity: 'Alpha Co', category: 'Service Agreement', status: 'Archived', value: '$80,000', expiry: '2022-05-31' },
    { id: 'CON-2020-092', name: 'Vendor Contract', entity: 'Beta Ltd', category: 'Vendor Contract', status: 'Archived', value: '$45,000', expiry: '2021-12-15' },
    { id: 'CON-2019-115', name: 'Lease Agreement', entity: 'Old HQ', category: 'Lease Agreement', status: 'Archived', value: '$120,000/yr', expiry: '2020-10-31' },
  ]);

  const getStatusBadge = (status) => {
    return <span className="status-pill status-muted"><FolderOpen size={14} /> {status}</span>;
  };

  const handleRowClick = (id) => {
    navigate(`/contracts/${id}`);
  };

  const handleRestoreClick = (e, id) => {
    e.stopPropagation();
    setContractToRestore(id);
    setRestoreModalOpen(true);
  };

  const confirmRestore = async () => {
    setContracts(contracts.filter(c => c.id !== contractToRestore));
    try {
      const { createNotification } = await import('../../features/notifications/services/notificationAPI');
      await createNotification({ title: 'Contract Restored', message: `Contract ${contractToRestore} was restored from archive.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) { console.error(err); }
    setRestoreModalOpen(false);
    setContractToRestore(null);
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.entity && c.entity.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory ? c.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="cr-dashboard fade-in">
      <div className="cr-header-section">
        <div className="cr-header-content">
          <h1 className="cr-title">Archived Contracts</h1>
          <p className="cr-subtitle">View and manage contracts that have been archived.</p>
        </div>
      </div>

      <div className="cr-main-area animate-slide-up">
        <div className="cr-toolbar">
          <div className="cr-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by ID, name, or counterparty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="cr-filters">
            <select 
              className="cr-select"
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Vendor Contract">Vendor Contract</option>
              <option value="Employment Contract">Employment</option>
              <option value="Lease Agreement">Lease Agreement</option>
              <option value="Service Agreement">Service Agreement</option>
            </select>
          </div>
        </div>

        <div className="cr-table-wrapper">
          <table className="cr-data-table">
            <thead>
              <tr>
                <th>Contract Details</th>
                <th>Category & Value</th>
                <th>Timeline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, index) => (
                <tr key={contract.id} className="cr-table-row" style={{ animationDelay: `${index * 0.05}s` }} onClick={() => handleRowClick(contract.id)}>
                  <td>
                    <div className="cr-entity">{contract.name}</div>
                    <div className="cr-meta">{contract.entity} • ID: {contract.id}</div>
                  </td>
                  <td>
                    <div className="cr-value-text">{contract.category}</div>
                    <div className="cr-meta mt-1">{contract.value}</div>
                  </td>
                  <td>
                    <div className="cr-value-text">Exp: {contract.expiry}</div>
                  </td>
                  <td>{getStatusBadge(contract.status)}</td>
                  <td className="cr-action-cell">
                    <div className="cr-action-group" onClick={(e) => e.stopPropagation()}>
                      <button className="cr-icon-btn" title="View Details" onClick={() => handleRowClick(contract.id)}>
                        <Eye size={16} />
                      </button>
                      <button className="cr-icon-btn" title="Restore Contract" onClick={(e) => handleRestoreClick(e, contract.id)}>
                        <RotateCcw size={16} />
                      </button>
                      <button className="cr-icon-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredContracts.length === 0 && (
            <div className="cr-empty-state">
              <FolderOpen size={48} className="text-muted" style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
              <p>No archived contracts found.</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={restoreModalOpen} 
        onClose={() => setRestoreModalOpen(false)}
        title="Confirm Restore"
        footer={
          <>
            <Button variant="outline" onClick={() => setRestoreModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmRestore}>Restore</Button>
          </>
        }
      >
        <p>Are you sure you want to restore contract <strong>{contractToRestore}</strong>?</p>
        <p className="text-muted mt-2">This will move it back to the active contract repository.</p>
      </Modal>
    </div>
  );
};

export default ArchivedContracts;
