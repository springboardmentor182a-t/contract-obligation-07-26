import React from 'react';

const AddUserModal = ({ addingUser, setAddingUser, handleAddUserSubmit }) => {
  if (!addingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: 'var(--background-white)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }} className="animate-fade-in">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--primary-color)' }}>Add New User</h2>
        <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Name</label>
            <input 
              type="text" 
              value={addingUser.name} 
              onChange={(e) => setAddingUser({...addingUser, name: e.target.value})}
              className="premium-input"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              value={addingUser.email} 
              onChange={(e) => setAddingUser({...addingUser, email: e.target.value})}
              className="premium-input"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Role</label>
            <select 
              value={addingUser.role} 
              onChange={(e) => setAddingUser({...addingUser, role: e.target.value})}
              className="premium-input"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button type="button" onClick={() => setAddingUser(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--background-light)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }}>
              Cancel
            </button>
            <button type="submit" className="premium-button" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
