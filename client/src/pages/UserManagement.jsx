import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch users.", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = (userId) => {
    fetch(`/api/users/${userId}`, { method: 'DELETE' })
      .then(() => fetchUsers())
      .catch(console.error);
  };

  const handleAddUser = () => {
    const newUser = {
      name: "New User",
      email: "new.user@company.com",
      role: "User"
    };
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(() => fetchUsers())
    .catch(console.error);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    fetch(`/api/users/${editingUser.user_id || editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status
      })
    })
    .then(() => {
      setEditingUser(null);
      fetchUsers();
    })
    .catch(console.error);
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Auditor': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Inactive': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>User Management</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Manage roles, permissions, and system access.</p>
        </div>
        <button onClick={handleAddUser} className="premium-button" style={{ width: 'auto', padding: '10px 20px' }}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>Loading users...</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(to bottom right, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{user.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${String(user.role || '').toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${String(user.status || '').toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {user.lastLogin}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeactivate(user.user_id || user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--background-white)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-lg)', border: '1px solid #e5e7eb' }} className="animate-fade-in">
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--primary-color)' }}>Edit User</h2>
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Name</label>
                <input 
                  type="text" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="premium-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email</label>
                <input 
                  type="email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="premium-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Role</label>
                <select 
                  value={editingUser.role} 
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="premium-input"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Status</label>
                <select 
                  value={editingUser.status} 
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="premium-input"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#e5e7eb', color: 'var(--text-primary)', borderRadius: '8px', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="premium-button" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
