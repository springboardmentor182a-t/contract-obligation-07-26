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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
            User Management
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
            Manage user roles, permissions, access tokens, and security profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <i className="fa-solid fa-search absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={handleAddClick} 
            className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Add User</span>
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
