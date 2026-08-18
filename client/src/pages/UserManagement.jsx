import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';

const ROLE_COLORS = {
  administrator: '#8b5cf6',
  legal_manager: '#3b82f6',
  compliance_officer: '#0d9488',
  contract_manager: '#10b981',
  department_head: '#f59e0b',
  employee: '#64748b',
};

function roleLabel(role) {
  return (role || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then(res => { setUsers(res.data); setLoading(false); })
      .catch(err => { setError(err.response?.data?.detail || 'Failed to load users.'); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeactivate = (userId) => {
    if (!window.confirm('Deactivate this user?')) return;
    api.delete(`/users/${userId}`)
      .then(() => fetchUsers())
      .catch(err => alert(err.response?.data?.detail || 'Failed to deactivate.'));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    api.put(`/users/${editUser.id}`, {
      name: editUser.full_name,
      email: editUser.email,
      department: editUser.department,
    }).then(() => { setEditUser(null); fetchUsers(); })
      .catch(err => alert(err.response?.data?.detail || 'Update failed.'));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
            User Management
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage system users, roles, and access permissions.
          </p>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={centered}>Loading users…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={centered}>No users found.</td></tr>
            ) : (
              users.map(user => {
                const roleColor = ROLE_COLORS[user.role] || '#64748b';
                const initials = user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: '700', fontSize: '0.82rem', flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{user.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
                        fontSize: '0.72rem', fontWeight: '700',
                        color: roleColor, background: `${roleColor}18`
                      }}>
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {user.department || '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
                        fontSize: '0.72rem', fontWeight: '700',
                        color: user.is_active ? '#10b981' : '#ef4444',
                        background: user.is_active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      }}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => setEditUser({ ...user })} style={iconBtn('#3b82f6')} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeactivate(user.id)} style={iconBtn('#ef4444')} title="Deactivate">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Edit User</h2>
              <button onClick={() => setEditUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input className="premium-input" value={editUser.full_name}
                  onChange={e => setEditUser({ ...editUser, full_name: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input className="premium-input" type="email" value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <input className="premium-input" value={editUser.department || ''}
                  onChange={e => setEditUser({ ...editUser, department: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setEditUser(null)} style={cancelBtn}>Cancel</button>
                <button type="submit" style={saveBtn}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn = (color) => ({
  width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '6px',
  color, cursor: 'pointer',
});
const centered = { textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px' };
const errorStyle = { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', color: '#f87171', marginBottom: '16px', fontSize: '13px' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modal = { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' };
const cancelBtn = { flex: 1, padding: '10px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' };
const saveBtn = { flex: 1, padding: '10px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '700' };
