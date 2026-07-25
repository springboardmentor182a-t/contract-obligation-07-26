import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Archive,
  FileText,
  AlertCircle,
  Clock,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  FolderOpen
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modals/Modal';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import './Contracts.css';

import { createNotification } from '../../features/notifications/services/notificationAPI';
import { getContracts } from '../../features/contracts/services/contractAPI';

const ContractRepository = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [contracts, setContracts] = useState([]);
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContracts();
        setContracts(data);
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
      }
    };
    fetchData();
  }, []);

  const [newContract, setNewContract] = useState({ name: '', companyName: '', vendorName: '', category: 'Vendor Contract', value: '', expiry: '' });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <span className="status-pill status-success"><CheckCircleIcon /> {status}</span>;
      case 'Under Review': return <span className="status-pill status-warning"><Clock size={14} /> {status}</span>;
      case 'Draft': return <span className="status-pill status-primary"><FileText size={14} /> {status}</span>;
      case 'Approved': return <span className="status-pill status-success"><CheckCircleIcon /> {status}</span>;
      case 'Expired': return <span className="status-pill status-danger"><AlertCircle size={14} /> {status}</span>;
      case 'Archived': return <span className="status-pill status-muted"><FolderOpen size={14} /> {status}</span>;
      default: return <span className="status-pill status-default">{status}</span>;
    }
  };

  const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  );

  const handleRowClick = (id) => {
    navigate(`/contracts/${id}`);
  };

  const handleUploadContract = async (e) => {
    e.preventDefault();
    const id = `CON-2023-${Math.floor(Math.random() * 900) + 100}`;
    setContracts([{ id, name: newContract.name, entity: newContract.vendorName || newContract.companyName, category: newContract.category, value: newContract.value, expiry: newContract.expiry, status: 'Draft' }, ...contracts]);
    setIsUploadModalOpen(false);
    
    try {
      await createNotification({ title: 'Contract Created', message: `Draft contract ${id} created successfully.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) {
      console.error(err);
    }
    
    setNewContract({ name: '', companyName: '', vendorName: '', category: 'Vendor Contract', value: '', expiry: '' });
  };

  const handleArchive = async (e, id) => {
    e.stopPropagation();
    setContracts(contracts.map(c => c.id === id ? { ...c, status: 'Archived' } : c));
    try {
      await createNotification({ title: 'Contract Archived', message: `Contract ${id} has been archived.` });
      window.dispatchEvent(new Event('notification-created'));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.entity && c.entity.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory ? c.category === filterCategory : true;
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="cr-dashboard fade-in">
      {/* Header Section */}
      <div className="cr-header-section">
        <div className="cr-header-content">
          <h1 className="cr-title">Contract Repository</h1>
          <p className="cr-subtitle">Centralized hub for all your enterprise agreements and legal documents.</p>
        </div>
        <div className="cr-header-actions">
          <Button variant="primary" onClick={() => setIsUploadModalOpen(true)} icon={Plus}>
            New Contract
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="cr-analytics-grid">
        <div className="cr-card glass-blue">
          <div className="cr-card-top">
            <div className="cr-card-icon"><FileText size={24} /></div>
            <span className="cr-trend positive"><ArrowUpRight size={14} /> {contracts.filter(c => c.status === 'Active').length}</span>
          </div>
          <div className="cr-card-data">
            <h3>Active Contracts</h3>
            <div className="cr-val">{contracts.filter(c => c.status === 'Active').length}</div>
            <p>Currently managing</p>
          </div>
        </div>

        <div className="cr-card glass-green">
          <div className="cr-card-top">
            <div className="cr-card-icon"><CheckCircleIcon /></div>
            <span className="cr-trend positive"><ArrowUpRight size={14} /> {contracts.filter(c => c.status === 'Approved').length}</span>
          </div>
          <div className="cr-card-data">
            <h3>Approved</h3>
            <div className="cr-val">{contracts.filter(c => c.status === 'Approved').length}</div>
            <p>Ready for execution</p>
          </div>
        </div>

        <div className="cr-card glass-orange">
          <div className="cr-card-top">
            <div className="cr-card-icon"><Clock size={24} /></div>
            <span className="cr-trend neutral">Steady</span>
          </div>
          <div className="cr-card-data">
            <h3>Pending Review</h3>
            <div className="cr-val">{contracts.filter(c => c.status === 'Under Review').length}</div>
            <p>Awaiting signatures</p>
          </div>
        </div>
        
        <div className="cr-card glass-purple">
          <div className="cr-card-top">
            <div className="cr-card-icon"><FolderOpen size={24} /></div>
            <span className="cr-trend positive"><ArrowDownRight size={14} /> {contracts.filter(c => c.status === 'Archived').length}</span>
          </div>
          <div className="cr-card-data">
            <h3>Archived</h3>
            <div className="cr-val">{contracts.filter(c => c.status === 'Archived').length}</div>
            <p>Historical records</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="cr-main-area animate-slide-up" style={{ animationDelay: '0.1s' }}>
        
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
            
            <select 
              className="cr-select"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Expired">Expired</option>
              <option value="Archived">Archived</option>
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
                      <button className="cr-icon-btn" onClick={() => handleRowClick(contract.id)} title="View Details">
                        <Eye size={16} />
                      </button>
                      {contract.status !== 'Archived' && (
                        <button className="cr-icon-btn" onClick={(e) => handleArchive(e, contract.id)} title="Archive">
                          <Archive size={16} />
                        </button>
                      )}
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
              <FolderOpen size={48} className="text-muted" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>No contracts found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload New Contract"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button type="button" variant="primary" onClick={handleUploadContract}>Upload & Create Draft</Button>
          </>
        }
      >
        <form onSubmit={handleUploadContract} id="upload-contract-form">
          <FormInput label="Contract Name" type="text" placeholder="e.g. Acme Corp NDA" required value={newContract.name} onChange={(e) => setNewContract({...newContract, name: e.target.value})} />
          <FormInput label="Company/Entity Name" type="text" placeholder="e.g. Global Industries Ltd." required value={newContract.companyName} onChange={(e) => setNewContract({...newContract, companyName: e.target.value})} />
          <FormSelect 
            label="Category"
            value={newContract.category}
            onChange={(e) => setNewContract({...newContract, category: e.target.value})}
            options={[
              { value: 'Vendor Contract', label: 'Vendor Contract' },
              { value: 'Employment Contract', label: 'Employment Contract' },
              { value: 'Lease Agreement', label: 'Lease Agreement' },
              { value: 'Service Agreement', label: 'Service Agreement' }
            ]}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormInput label="Value" type="text" placeholder="$0.00" value={newContract.value} onChange={(e) => setNewContract({...newContract, value: e.target.value})} />
            <FormInput label="Expiry Date" type="date" required value={newContract.expiry} onChange={(e) => setNewContract({...newContract, expiry: e.target.value})} />
          </div>
          <FormInput label="Attach Document (PDF, DOCX)" type="file" required />
        </form>
      </Modal>
    </div>
  );
};

export default ContractRepository;
