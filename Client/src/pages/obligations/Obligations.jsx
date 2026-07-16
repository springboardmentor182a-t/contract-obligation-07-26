import React, { useState } from 'react';
import { 
  Plus, Search, Filter, CheckCircle, Clock, 
  AlertTriangle, MoreVertical, Calendar, 
  ArrowRight, LayoutList 
} from 'lucide-react';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modals/Modal';
import './Obligations.css';

const Obligations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [obligations, setObligations] = useState([
    { id: 'OBL-101', description: 'Quarterly Payment to Vendor', contractId: 'CON-2023-001', dueDate: '2023-09-30', status: 'Pending', priority: 'High' },
    { id: 'OBL-102', description: 'Annual Security Audit', contractId: 'CON-2023-045', dueDate: '2023-11-15', status: 'Completed', priority: 'High' },
    { id: 'OBL-103', description: 'Software License Renewal Notice', contractId: 'CON-2023-089', dueDate: '2023-08-01', status: 'Overdue', priority: 'Medium' },
    { id: 'OBL-104', description: 'Submit Performance Report', contractId: 'CON-2022-404', dueDate: '2023-12-01', status: 'Pending', priority: 'Low' },
    { id: 'OBL-105', description: 'Data Processing Addendum Review', contractId: 'CON-2021-112', dueDate: '2023-10-15', status: 'Pending', priority: 'Medium' },
  ]);

  const [newObligation, setNewObligation] = useState({ description: '', contractId: '', dueDate: '', status: 'Pending', priority: 'Medium' });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return <span className="status-pill status-success"><CheckCircle size={14} /> {status}</span>;
      case 'Pending': return <span className="status-pill status-warning"><Clock size={14} /> {status}</span>;
      case 'Overdue': return <span className="status-pill status-danger"><AlertTriangle size={14} /> {status}</span>;
      default: return <span className="status-pill status-default">{status}</span>;
    }
  };
  
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'High': return <span className="priority-dot dot-danger">High</span>;
      case 'Medium': return <span className="priority-dot dot-warning">Medium</span>;
      case 'Low': return <span className="priority-dot dot-success">Low</span>;
      default: return <span className="priority-dot">{priority}</span>;
    }
  };

  const handleAddObligation = (e) => {
    e.preventDefault();
    const id = `OBL-${Math.floor(Math.random() * 900) + 100}`;
    setObligations([{ id, ...newObligation }, ...obligations]);
    setIsAddModalOpen(false);
    setNewObligation({ description: '', contractId: '', dueDate: '', status: 'Pending', priority: 'Medium' });
  };

  const handleStatusChange = (e, id, newStatus) => {
    e.stopPropagation();
    setObligations(obligations.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filteredObligations = obligations.filter(o => {
    const matchesSearch = o.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.contractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? o.status === filterStatus : true;
    const matchesPriority = filterPriority ? o.priority === filterPriority : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="obl-dashboard fade-in">
      <div className="obl-header-section">
        <div className="obl-header-content">
          <h1 className="obl-title">Obligation Tracking</h1>
          <p className="obl-subtitle">Monitor and manage all contractual obligations, deliverables, and deadlines.</p>
        </div>
        <div className="obl-header-actions">
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={Plus}>
            New Obligation
          </Button>
        </div>
      </div>

      <div className="obl-analytics-grid">
        <div className="obl-card glass-orange">
          <div className="obl-card-top">
            <div className="obl-card-icon"><AlertTriangle size={24} /></div>
          </div>
          <div className="obl-card-data">
            <h3>Overdue Actions</h3>
            <div className="obl-val">1</div>
            <p>Immediate attention required</p>
          </div>
        </div>

        <div className="obl-card glass-blue">
          <div className="obl-card-top">
            <div className="obl-card-icon"><Clock size={24} /></div>
          </div>
          <div className="obl-card-data">
            <h3>Pending Deliverables</h3>
            <div className="obl-val">3</div>
            <p>Upcoming in next 30 days</p>
          </div>
        </div>

        <div className="obl-card glass-green">
          <div className="obl-card-top">
            <div className="obl-card-icon"><CheckCircle size={24} /></div>
          </div>
          <div className="obl-card-data">
            <h3>Completed Tasks</h3>
            <div className="obl-val">12</div>
            <p>Successfully met this month</p>
          </div>
        </div>
      </div>

      <div className="obl-main-area animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="obl-toolbar">
          <div className="obl-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search description or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="obl-filters">
            <select 
              className="obl-select"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
            <select 
              className="obl-select"
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="obl-table-wrapper">
          <table className="obl-data-table">
            <thead>
              <tr>
                <th>Obligation Details</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredObligations.map((obligation, index) => (
                <tr key={obligation.id} className="obl-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td>
                    <div className="obl-entity">{obligation.description}</div>
                    <div className="obl-meta">ID: {obligation.id} • Contract: {obligation.contractId}</div>
                  </td>
                  <td>
                    <div className="obl-value-text flex items-center gap-2">
                      <Calendar size={14} className="text-muted" /> {obligation.dueDate}
                    </div>
                  </td>
                  <td>{getPriorityBadge(obligation.priority)}</td>
                  <td>{getStatusBadge(obligation.status)}</td>
                  <td className="obl-action-cell">
                    <div className="obl-action-group">
                      {obligation.status !== 'Completed' && (
                        <button 
                          className="obl-action-btn complete-btn" 
                          title="Mark Completed" 
                          onClick={(e) => handleStatusChange(e, obligation.id, 'Completed')}
                        >
                          <CheckCircle size={14} /> Done
                        </button>
                      )}
                      <button className="obl-icon-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredObligations.length === 0 && (
            <div className="obl-empty-state">
              <LayoutList size={48} className="text-muted" style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
              <p>No obligations found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Obligation"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="button" variant="primary" onClick={handleAddObligation}>Save Obligation</Button>
          </>
        }
      >
        <form onSubmit={handleAddObligation} id="add-obligation-form">
          <FormInput 
            label="Description"
            type="text" 
            placeholder="e.g. Submit quarterly tax report" 
            required 
            value={newObligation.description}
            onChange={(e) => setNewObligation({...newObligation, description: e.target.value})}
          />
          <FormInput 
            label="Contract ID"
            type="text" 
            placeholder="e.g. CON-2023-001" 
            required 
            value={newObligation.contractId}
            onChange={(e) => setNewObligation({...newObligation, contractId: e.target.value})}
          />
          <div className="flex gap-4">
            <FormInput 
              label="Due Date"
              type="date" 
              required 
              value={newObligation.dueDate}
              onChange={(e) => setNewObligation({...newObligation, dueDate: e.target.value})}
            />
            <FormSelect 
              label="Priority"
              value={newObligation.priority}
              onChange={(e) => setNewObligation({...newObligation, priority: e.target.value})}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' }
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Obligations;
