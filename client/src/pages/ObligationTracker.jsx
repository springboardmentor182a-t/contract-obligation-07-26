import React, { useState } from 'react';

const ObligationTracker = () => {
  const [obligations, setObligations] = useState([
    { id: 'OBL-001', contract: 'Acme Corp NDA', description: 'Submit Q3 Financials', dueDate: 'Jul 15, 2026', status: 'Pending', priority: 'High' },
    { id: 'OBL-002', contract: 'TechFlow MSA', description: 'Renew SLA terms', dueDate: 'Jul 20, 2026', status: 'In Progress', priority: 'Medium' },
    { id: 'OBL-003', contract: 'Global Logistics SLA', description: 'Quarterly compliance audit', dueDate: 'Jun 30, 2026', status: 'Completed', priority: 'High' },
    { id: 'OBL-004', contract: 'CloudSystems Vendor', description: 'Update security certificates', dueDate: 'Jul 02, 2026', status: 'Overdue', priority: 'Critical' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    contract: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });

  const handleMarkDone = (id) => {
    setObligations(obligations.map(obl => 
      obl.id === id ? { ...obl, status: 'Completed' } : obl
    ));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newId = `OBL-00${obligations.length + 1}`;
    setObligations([...obligations, {
      id: newId,
      contract: newTask.contract,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: 'Pending',
      priority: newTask.priority
    }]);
    setIsModalOpen(false);
    setNewTask({ contract: '', description: '', dueDate: '', priority: 'Medium' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Obligation Tracker</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Track and manage deliverables and deadlines across all contracts.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="premium-button" style={{ width: 'auto', padding: '12px 24px' }}>
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> New Task
        </button>
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Contract</th>
              <th>Task Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {obligations.map((obl, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{obl.id}</td>
                <td>{obl.contract}</td>
                <td>{obl.description}</td>
                <td style={{ color: obl.status === 'Overdue' ? 'var(--danger-color)' : 'inherit', fontWeight: obl.status === 'Overdue' ? 600 : 'normal' }}>
                  {obl.dueDate}
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: obl.priority === 'Critical' ? 'rgba(239,68,68,0.1)' : obl.priority === 'High' ? 'rgba(245,158,11,0.1)' : 'rgba(30,58,138,0.1)',
                    color: obl.priority === 'Critical' ? 'var(--danger-color)' : obl.priority === 'High' ? 'var(--warning-color)' : 'var(--primary-color)'
                  }}>
                    {obl.priority}
                  </span>
                </td>
                <td><span className={`badge ${obl.status === 'Completed' ? 'active' : obl.status === 'Overdue' ? 'expired' : 'pending'}`}>{obl.status}</span></td>
                <td>
                  {obl.status !== 'Completed' ? (
                    <button onClick={() => handleMarkDone(obl.id)} className="premium-button" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', margin: 0 }}>Mark Done</button>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--success-color)', fontWeight: 600 }}><i className="fa-solid fa-check"></i> Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '500px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '22px' }}>Add New Obligation</h2>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '20px', color: '#9ca3af' }} onClick={() => setIsModalOpen(false)}></i>
            </div>
            
            <form onSubmit={handleAddTask}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Contract Name</label>
                <input required className="premium-input" value={newTask.contract} onChange={(e) => setNewTask({...newTask, contract: e.target.value})} placeholder="e.g. Acme Corp NDA" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Task Description</label>
                <input required className="premium-input" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="e.g. Submit Q3 Financials" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Due Date</label>
                <input type="text" required className="premium-input" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} placeholder="e.g. Oct 15, 2026" />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Priority</label>
                <select className="premium-input" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="premium-button" style={{ width: 'auto', backgroundColor: '#fff', color: 'var(--text-secondary)', border: '1px solid #d1d5db', boxShadow: 'none', padding: '10px 20px' }}>Cancel</button>
                <button type="submit" className="premium-button" style={{ width: 'auto', padding: '10px 24px' }}>Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObligationTracker;
