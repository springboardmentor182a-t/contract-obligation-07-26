import React, { useState } from 'react';
import { 
  Plus, Search, Filter, CheckCircle, Clock,Eye, Edit,
  Trash2,
  AlertTriangle, MoreVertical, Calendar, GripVertical,
Grid3X3,
  ArrowRight, LayoutList 
} from 'lucide-react';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';

import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modals/Modal';
import SortableCard from "./SortableCard";
import './Obligations.css';

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";


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
  const [menuOpen, setMenuOpen] = useState(null);
  const [viewMode, setViewMode] = useState("table");
const [selectedObligation, setSelectedObligation] = useState(null);

  const [newObligation, setNewObligation] = useState({
  description: '',
  contractId: '',
  dueDate: '',
  status: 'Pending',
  priority: 'Medium',
  assignedTo: '',
  progress: '0%',
  obligationType: 'Payment Obligation'
});

  const getStatusBadge = (status) => {
  switch (status) {
    case "Completed":
      return (
        <span className="status-pill status-success">
          <CheckCircle size={14} /> Completed
        </span>
      );

    case "Pending":
      return (
        <span className="status-pill status-pending">
          <Clock size={14} /> Pending
        </span>
      );

    case "In Progress":
      return (
        <span className="status-pill status-progress">
          <Clock size={14} /> In Progress
        </span>
      );

    case "Due Soon":
      return (
        <span className="status-pill status-due">
          <Clock size={14} /> Due Soon
        </span>
      );

    case "Overdue":
      return (
        <span className="status-pill status-danger">
          <AlertTriangle size={14} /> Overdue
        </span>
      );

    default:
      return (
        <span className="status-pill status-default">
          {status}
        </span>
      );
  }
};
  const getPriorityBadge = (priority) => {
  switch (priority) {
    case "High":
      return <span className="priority-badge priority-high">High</span>;

    case "Medium":
      return <span className="priority-badge priority-medium">Medium</span>;

    case "Low":
      return <span className="priority-badge priority-low">Low</span>;

    case "Critical":
      return <span className="priority-badge priority-critical">Critical</span>;

    default:
      return <span className="priority-badge">{priority}</span>;
  }
};

  const getDueDateStatus = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return <span style={{ color: "red" }}>🔴 Overdue</span>;
  }

  if (diffDays === 0) {
    return <span style={{ color: "orange" }}>🟠 Due Today</span>;
  }

  if (diffDays === 1) {
    return <span style={{ color: "orange" }}>🟠 Due Tomorrow</span>;
  }

  return <span style={{ color: "green" }}>🟢 Due in {diffDays} days</span>;
};

  const handleAddObligation = (e) => {
  e.preventDefault();

  const id = `OBL-${Math.floor(Math.random() * 900) + 100}`;

  setObligations([{ id, ...newObligation }, ...obligations]);

  setIsAddModalOpen(false);
setNewObligation({
  description: '',
  contractId: '',
  dueDate: '',
  status: 'Pending',
  priority: 'Medium',
  assignedTo: '',
  progress: '0%',
  obligationType: 'Payment Obligation',
});
  // Success message
  alert("✅ Obligation added successfully!");
};

  const handleStatusChange = (e, id, newStatus) => {
    e.stopPropagation();
    setObligations(obligations.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };
  const overdueCount = obligations.filter(
  (o) => o.status === "Overdue"
).length;

const pendingCount = obligations.filter(
  (o) => o.status === "Pending"
).length;

const completedCount = obligations.filter(
  (o) => o.status === "Completed"
).length;
const handleDragEnd = (event) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = obligations.findIndex(
    (item) => item.id === active.id
  );

  const newIndex = obligations.findIndex(
    (item) => item.id === over.id
  );

  setObligations((items) =>
    arrayMove(items, oldIndex, newIndex)
  );
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
          <p className="obl-subtitle"><p>
  {obligations.length} Obligations • {overdueCount} Overdue
</p></p>
        </div>
       <div className="obl-header-actions">

  
    <button
  className={`view-toggle ${viewMode === "table" ? "active" : ""}`}
  onClick={() => setViewMode("table")}
>
  <LayoutList size={16} />
</button>

<button
  className={`view-toggle ${viewMode === "grid" ? "active" : ""}`}
  onClick={() => setViewMode("grid")}
>
  <Grid3X3 size={16} />
</button>



  <Button
    variant="primary"
    onClick={() => setIsAddModalOpen(true)}
    icon={Plus}
  >
    Add Obligation
  </Button>

</div>
      </div>

      <div className="obl-analytics-grid">
        <div className="obl-card glass-red">
  <div className="obl-card-top">
    <div className="obl-card-icon">
      <AlertTriangle size={24} />
    </div>
  </div>

  <div className="obl-card-data">
    <div className="obl-val">{overdueCount}</div>
    <h3>Overdue</h3>
    <p>Past due obligations</p>
  </div>
</div>

        <div className="obl-card glass-orange">
  <div className="obl-card-top">
    <div className="obl-card-icon">
      <Clock size={24} />
    </div>
  </div>

  <div className="obl-card-data">
    <div className="obl-val">2</div>
    <h3>Due Soon</h3>
    <p>Due within 7 days</p>
  </div>
</div>
<div className="obl-card glass-blue">
  <div className="obl-card-top">
    <div className="obl-card-icon">
      <Clock size={24} />
    </div>
  </div>

  <div className="obl-card-data">
    <div className="obl-val">1</div>
    <h3>In Progress</h3>
    <p>Currently being worked on</p>
  </div>
</div>
<div className="obl-card glass-gray">
  <div className="obl-card-top">
    <div className="obl-card-icon">
      <Clock size={24} />
    </div>
  </div>

  <div className="obl-card-data">
    <div className="obl-val">{pendingCount}</div>
    <h3>Pending</h3>
    <p>Waiting to start</p>
  </div>
</div>

        <div className="obl-card glass-green">
          <div className="obl-card-top">
            <div className="obl-card-icon"><CheckCircle size={24} /></div>
          </div>
          <div className="obl-card-data">
            <h3>Completed Tasks</h3>
            <div className="obl-val">{completedCount}</div>
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
              placeholder="Search contracts..."
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

        <div
  className="obl-table-wrapper"
  style={{
    display: viewMode === "table" ? "block" : "none",
  }}
>
          <table className="obl-data-table">
            <thead>
  <tr>
    <th>ID</th>
    <th>TITLE / TYPE</th>
    <th>CONTRACT</th>
    <th>DUE DATE</th>
    <th>PRIORITY</th>
    <th>STATUS</th>
    <th>PROGRESS</th>
    <th>ASSIGNEE</th>
    <th style={{ textAlign: "right" }}>ACTIONS</th>
  </tr>
</thead>
            <tbody>
              {filteredObligations.map((obligation, index) => (
              <tr
  key={obligation.id}
  className="obl-table-row"
  style={{
  animationDelay: `${index * 0.05}s`,
}}
>
<td>
  <strong>{obligation.id}</strong>
</td>

<td>
  <div className="obl-entity">
    {obligation.description}
  </div>

  <div className="obl-meta">
    {obligation.obligationType}
  </div>
</td>

<td>
  {obligation.contractId}
</td>

<td>
  <div className="obl-value-text">
    <Calendar size={14} />
    {obligation.dueDate}
  </div>

  <div className="obl-meta">
    {getDueDateStatus(obligation.dueDate)}
  </div>
</td>
                  
  
                  <td>{getPriorityBadge(obligation.priority)}</td>
                  <td>
  {getStatusBadge(obligation.status)}
</td>
<td>
  <div className="progress-wrapper">
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: obligation.progress }}
      ></div>
    </div>

    <span className="progress-text">
      {obligation.progress}
    </span>
  </div>
</td>
<td>
  {obligation.assignedTo || "Not Assigned"}
</td>

                 <td className="obl-action-cell">
  <div className="obl-action-group">

    {/* View */}
    <button
      className="obl-icon-btn"
      title="View"
    >
      <Eye size={16} />
    </button>

    {/* Edit */}
    <button
      className="obl-icon-btn"
      title="Edit"
      onClick={() => {
        setSelectedObligation(obligation);
        setNewObligation(obligation);
        setIsAddModalOpen(true);
      }}
    >
      <Edit size={16} />
    </button>

    {/* Delete */}
    <button
      className="obl-icon-btn delete-btn"
      title="Delete"
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this obligation?")) {
          setObligations(
            obligations.filter((o) => o.id !== obligation.id)
          );
        }
      }}
    >
      <Trash2 size={16} />
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
{viewMode === "grid" && (
  <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
    <SortableContext
      items={filteredObligations.map((o) => o.id)}
      strategy={rectSortingStrategy}
    >
      <div className="obl-grid-view">

       {filteredObligations.map((obligation) => (

  <SortableCard
    key={obligation.id}
    id={obligation.id}
  >
   <div className="obl-grid-card">

  <div className="card-header">
    <h4>{obligation.description}</h4>

    <GripVertical
      size={20}
      className="drag-handle"
    />
  </div>

  <p>{obligation.contractId}</p>
  <div className="obl-card-footer">
    <small>
        Drag to reorder
    </small>
</div>

  <div className="grid-badges">
    {getPriorityBadge(obligation.priority)}
    {getStatusBadge(obligation.status)}
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: obligation.progress }}
    ></div>
  </div>

</div>
</SortableCard>

        ))}

      </div>
    </SortableContext>
  </DndContext>
)}
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
  onChange={(e) =>
    setNewObligation({
      ...newObligation,
      contractId: e.target.value,
    })
  }
/>
          <FormInput
  label="Due Date"
  type="date"
  required
  value={newObligation.dueDate}
  onChange={(e) =>
    setNewObligation({
      ...newObligation,
      dueDate: e.target.value,
    })
  }
/>

<FormSelect
  label="Assigned To"
  value={newObligation.assignedTo}
  onChange={(e) =>
    setNewObligation({
      ...newObligation,
      assignedTo: e.target.value,
    })
  }
  options={[
    { value: "", label: "Select Employee" },
    { value: "John", label: "John" },
    { value: "Alice", label: "Alice" },
    { value: "David", label: "David" },
    { value: "Sarah", label: "Sarah" },
    { value: "Michael", label: "Michael" },
  ]}
/>

<FormSelect
  label="Progress"
  value={newObligation.progress}
  onChange={(e) =>
    setNewObligation({
      ...newObligation,
      progress: e.target.value,
    })
  }
  options={[
    { value: "0%", label: "0%" },
    { value: "25%", label: "25%" },
    { value: "50%", label: "50%" },
    { value: "75%", label: "75%" },
    { value: "100%", label: "100%" },
  ]}
/>

<FormSelect
  label="Obligation Type"
  value={newObligation.obligationType}
  onChange={(e) =>
    setNewObligation({
      ...newObligation,
      obligationType: e.target.value,
    })
  }
  options={[
    { value: "Payment Obligation", label: "Payment Obligation" },
    { value: "Delivery Commitment", label: "Delivery Commitment" },
    { value: "Reporting Requirement", label: "Reporting Requirement" },
    { value: "Renewal Condition", label: "Renewal Condition" },
    { value: "Service Level Agreement", label: "Service Level Agreement" },
    { value: "Legal Compliance", label: "Legal Compliance" },
  ]}
/>          
        </form>
           </Modal>
    </div>
  );
};

export default Obligations;