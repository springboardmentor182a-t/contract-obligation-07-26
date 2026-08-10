import React from 'react';

const UserTable = ({ filteredUsers, loading, handleEditClick, handleDeactivate }) => {
  return (
    <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-[#0B1121]/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E9BAE] border-b border-slate-200 dark:border-[#2A364F]">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const isActive = String(user.status || '').toLowerCase() === 'active';
                const statusBadge = isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';

                const roleBadge = String(user.role || '').toLowerCase() === 'admin'
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30';

                return (
                  <tr key={user.id || user.user_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                          {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-[#64748B] dark:text-[#8E9BAE]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadge}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#64748B] dark:text-[#8E9BAE]">
                      {user.lastLogin || 'Recent'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleEditClick(user)} 
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
                          title="Edit User"
                        >
                          <i className="fa-solid fa-pen-to-square text-sm"></i>
                        </button>
                        <button 
                          onClick={() => handleDeactivate(user.user_id || user.id)} 
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
                          title="Deactivate User"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
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
    </div>
  );
};

export default UserTable;
