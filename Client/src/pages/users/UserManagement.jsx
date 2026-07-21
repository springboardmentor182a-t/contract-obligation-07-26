import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import Badge from '../../components/DataDisplay/Badge';
import Dropdown from '../../components/Buttons/Dropdown';
import Modal from '../../components/Modals/Modal';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import SignupForm from '../../features/authentication/components/SignupForm';
import { signupService } from '../../features/authentication/services/signup';
import { getAllUsers } from '../../features/authentication/services/getAllUsers';
import { deleteUser as deleteUserService } from '../../features/authentication/services/deleteUser';
import { updateUser as updateUserService } from '../../features/authentication/services/updateUser';
import { toggleUserStatus as toggleUserStatusService } from '../../features/authentication/services/toggleUserStatus';
import { getOrganizations } from '../../features/organizations/services/organizationAPI';

const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice.smith@contractiq.com', role: 'Admin', department: 'IT', status: 'Active' },
  { id: 2, name: 'Bob Jones', email: 'bob.jones@contractiq.com', role: 'Legal Manager', department: 'Legal', status: 'Active' },
  { id: 3, name: 'Charlie Davis', email: 'charlie.davis@contractiq.com', role: 'Compliance Officer', department: 'Compliance', status: 'Inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana.prince@contractiq.com', role: 'Contract Manager', department: 'Operations', status: 'Active' },
  { id: 5, name: 'Evan Wright', email: 'evan.wright@contractiq.com', role: 'Admin', department: 'Sales', status: 'Active' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona.g@contractiq.com', role: 'Contract Manager', department: 'Marketing', status: 'Active' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  React.useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data || []);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = user.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const deptMatch = user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch || roleMatch || deptMatch;
  });

  const handleCreateUserFull = async (formData) => {
    setIsCreating(true);
    setCreateError('');
    try {
      await signupService(formData);
      alert(`User ${formData.name || 'New User'} registered successfully!`);
      fetchUsers();
      setIsAddUserModalOpen(false);
    } catch (err) {
      setCreateError(err.message || 'Registration failed.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUserService(editingUser);
      alert('User updated successfully!');
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await toggleUserStatusService(user.user_id);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to change user status');
    }
  };

  const handleDeleteUser = async (user_id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await deleteUserService(user_id);
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <div className="dashboard-header mb-2 stagger-1">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={28} className="text-primary" /> User Management
          </h1>
          <p className="text-muted mt-1">Manage user roles, permissions, and account status.</p>
        </div>
        <div className="dashboard-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="header-search" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', width: '250px' }}>
            <Search size={16} className="text-muted" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={handleSearch}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddUserModalOpen(true)}>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid stagger-1 mb-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Total Users</p>
            <div className="stat-icon" style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(107, 142, 177, 0.15)' }}>
              <Users size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Active Accounts</p>
            <div className="stat-icon" style={{ color: 'var(--color-success)', backgroundColor: 'rgba(46, 204, 113, 0.15)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.is_active !== false).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Inactive Accounts</p>
            <div className="stat-icon" style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(231, 76, 60, 0.15)' }}>
              <XCircle size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.is_active === false).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">Administrators</p>
            <div className="stat-icon" style={{ color: 'var(--color-warning)', backgroundColor: 'rgba(241, 196, 15, 0.15)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'Admin').length}</h3>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="dashboard-card stagger-2" style={{ overflow: 'visible' }}>
        <div className="activity-table-wrapper" style={{ overflow: 'visible' }}>
          <table className="activity-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.user_id || user.email}>
                    <td>
                      <div className="table-user">
                        <div className="table-avatar" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                          {(user.full_name || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ marginBottom: '0.1rem', color: 'var(--color-text)' }}>{user.full_name || 'Unknown User'}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={user.role === 'Admin' ? 'warning' : 'primary'}>{user.role || 'Unassigned'}</Badge>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>{user.department || 'N/A'}</span>
                    </td>
                    <td>
                      <Badge variant={user.is_active !== false ? 'success' : 'danger'}>{user.is_active !== false ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Dropdown 
                        label={<MoreVertical size={16} />}
                        hideArrow
                        onSelect={(item) => {
                          if (item.action === 'edit') setEditingUser({ name: user.full_name, ...user });
                          if (item.action === 'toggleStatus') handleToggleUserStatus(user);
                          if (item.action === 'delete') handleDeleteUser(user.user_id);
                        }}
                        items={[
                          { label: 'Edit Profile', action: 'edit' },
                          { label: user.is_active !== false ? 'Deactivate Account' : 'Activate Account', action: 'toggleStatus' },
                          { label: 'Remove User', action: 'delete', danger: true }
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)}
        title="Register New User"
      >
        <div style={{ padding: '0.5rem 0' }}>
          {createError && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #f87171' }}>
              {createError}
            </div>
          )}
          <SignupForm onSubmit={handleCreateUserFull} disabled={isCreating} hideAdminRole={true} />
        </div>
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal 
          isOpen={!!editingUser} 
          onClose={() => setEditingUser(null)}
          title="Edit User Profile"
          footer={
            <>
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button type="button" variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
            </>
          }
        >
          <form onSubmit={handleUpdateUser} id="edit-user-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormInput 
                label="Full Name" 
                type="text" 
                required 
                value={editingUser.name || editingUser.full_name || ''} 
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} 
              />
              <FormInput 
                label="Employee ID" 
                type="text" 
                required 
                value={editingUser.employee_id || ''} 
                onChange={(e) => setEditingUser({...editingUser, employee_id: e.target.value})} 
              />
              <FormInput 
                label="Email Address" 
                type="email" 
                required 
                readOnly
                value={editingUser.email || ''} 
                style={{ backgroundColor: 'var(--color-bg)' }}
              />
              <FormInput 
                label="Phone Number" 
                type="tel" 
                required 
                value={editingUser.phone || ''} 
                onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} 
              />
              <FormSelect 
                label="System Role"
                value={editingUser.role || 'Admin'}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                options={[
                  { value: 'Admin', label: 'Admin' },
                  { value: 'Legal Manager', label: 'Legal Manager' },
                  { value: 'Compliance Officer', label: 'Compliance Officer' },
                  { value: 'Contract Manager', label: 'Contract Manager' }
                ]}
              />
              <FormSelect 
                label="Organization"
                value={editingUser.organization_id || ''}
                onChange={(e) => {
                  const selectedOrg = organizations.find(org => org.organization_id.toString() === e.target.value);
                  setEditingUser({
                    ...editingUser, 
                    organization_id: e.target.value,
                    company_name: selectedOrg ? selectedOrg.company_name : ''
                  });
                }}
                options={organizations.map(org => ({
                  value: org.organization_id.toString(),
                  label: org.company_name
                }))}
              />
              <FormSelect 
                label="Department" 
                value={editingUser.department || ''} 
                onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                options={[
                  { value: 'Administration', label: 'Administration' },
                  { value: 'Legal', label: 'Legal' },
                  { value: 'Compliance', label: 'Compliance' },
                  { value: 'Contracts', label: 'Contracts' },
                  { value: 'IT', label: 'IT' },
                  { value: 'HR', label: 'HR' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Operations', label: 'Operations' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'Marketing', label: 'Marketing' }
                ]}
              />
              <FormInput 
                label="Designation" 
                type="text" 
                value={editingUser.designation || ''} 
                onChange={(e) => setEditingUser({...editingUser, designation: e.target.value})} 
              />
              <FormInput 
                label="Office Location" 
                type="text" 
                value={editingUser.location || ''} 
                onChange={(e) => setEditingUser({...editingUser, location: e.target.value})} 
              />
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1.75rem' }}>
                <input 
                  type="checkbox" 
                  id="isActiveCheck"
                  checked={editingUser.is_active !== false}
                  onChange={(e) => setEditingUser({...editingUser, is_active: e.target.checked})}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="isActiveCheck" style={{ cursor: 'pointer', fontWeight: '500' }}>Account is Active</label>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
