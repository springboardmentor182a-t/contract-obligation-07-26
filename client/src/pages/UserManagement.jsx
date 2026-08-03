import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserManagement/UserTable/UserTable';
import EditUserModal from '../components/UserManagement/EditUserModal/EditUserModal';
import AddUserModal from '../components/UserManagement/AddUserModal/AddUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addingUser)
    })
    .then(() => {
      setAddingUser(null);
      fetchUsers();
    })
    .catch(console.error);
  };

  const handleAddClick = () => {
    setAddingUser({
      name: "",
      email: "",
      role: "User"
    });
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

  const filteredUsers = users.filter(user => 
    (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>User Management</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Manage roles, permissions, and system access.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-input"
              style={{ paddingLeft: '36px', minWidth: '250px' }}
            />
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ position: 'absolute', left: '10px', top: '12px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button onClick={handleAddClick} className="premium-button" style={{ width: 'auto', padding: '10px 20px' }}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </button>
        </div>
      </div>

      <UserTable 
        filteredUsers={filteredUsers}
        loading={loading}
        handleEditClick={handleEditClick}
        handleDeactivate={handleDeactivate}
      />
      
      <EditUserModal 
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        handleUpdateUser={handleUpdateUser}
      />
      
      <AddUserModal 
        addingUser={addingUser}
        setAddingUser={setAddingUser}
        handleAddUserSubmit={handleAddUserSubmit}
      />
    </div>
  );
};

export default UserManagement;
