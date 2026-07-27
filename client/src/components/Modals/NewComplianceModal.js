import React, { useState } from 'react';
import { API_BASE_URL } from '../../data/constants';

const NewComplianceModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    item_name: '', description: '', contract_ref: '', obligation: '', 
    status: 'Compliant', risk_level: 'Low', next_review: '', owner_name: 'Spandana Doe'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/compliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSaveSuccess(); 
        onClose();       
        setFormData({ item_name: '', description: '', contract_ref: '', obligation: '', status: 'Compliant', risk_level: 'Low', next_review: '', owner_name: 'Spandana Doe' });
      } else {
        const errorData = await response.json();
        alert(`Server Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Failed to save compliance item", error);
      alert("Network error. Is your backend running?");
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3 style={{ marginBottom: '15px' }}>Add Compliance Review</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Item Name (e.g., Data Privacy)" required onChange={e => setFormData({...formData, item_name: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Description / Requirements" required onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Contract Ref (e.g., CON-001)" required onChange={e => setFormData({...formData, contract_ref: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Obligation" required onChange={e => setFormData({...formData, obligation: e.target.value})} style={{ padding: '8px' }} />
          
          <select onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '8px' }}>
            <option value="Compliant">Compliant</option>
            <option value="At Risk">At Risk</option>
            <option value="Non-Compliant">Non-Compliant</option>
            <option value="Pending Review">Pending Review</option>
          </select>
          
          <select onChange={e => setFormData({...formData, risk_level: e.target.value})} style={{ padding: '8px' }}>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
          
          <label style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Next Review Date</label>
          <input type="date" required onChange={e => setFormData({...formData, next_review: e.target.value})} style={{ padding: '8px' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="submit" style={{ background: '#5f27cd', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Review</button>
            <button type="button" onClick={onClose} style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplianceModal;