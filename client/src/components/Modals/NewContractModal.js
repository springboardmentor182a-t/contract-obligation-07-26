import React, { useState } from 'react';
import { API_BASE_URL } from '../../data/constants';

const NewContractModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', party: '', status: 'Active', start_date: '', end_date: '', value: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value)
        })
      });
      
      if (response.ok) {
        onSaveSuccess(); // Refresh the dashboard
        onClose();       // Close the modal
        // Optional: Reset the form so it's blank next time you open it
        setFormData({ name: '', party: '', status: 'Active', start_date: '', end_date: '', value: '' });
      } else {
        // NEW: If the server rejects the data, show exactly why in an alert!
        const errorData = await response.json();
        alert(`Server Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Failed to save contract", error);
      alert("Network error. Is your Terminal 1 (Backend) still running?");
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3 style={{ marginBottom: '15px' }}>Create New Contract</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Contract Name" required onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Party (e.g., AWS, Microsoft)" required onChange={e => setFormData({...formData, party: e.target.value})} style={{ padding: '8px' }} />
          <select onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '8px' }}>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
          <input type="date" required onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ padding: '8px' }} />
          <input type="date" required onChange={e => setFormData({...formData, end_date: e.target.value})} style={{ padding: '8px' }} />
          <input type="number" placeholder="Value ($)" required onChange={e => setFormData({...formData, value: e.target.value})} style={{ padding: '8px' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="submit" style={{ background: '#5f27cd', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Contract</button>
            <button type="button" onClick={onClose} style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContractModal;