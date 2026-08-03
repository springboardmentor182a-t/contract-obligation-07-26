import React from 'react';

const UserTable = ({ filteredUsers, loading, handleEditClick, handleDeactivate }) => {
  return (
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
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No users found.</td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id || user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
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
                    <button onClick={() => handleEditClick(user)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeactivate(user.user_id || user.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Deactivate">
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
  );
};

export default UserTable;
