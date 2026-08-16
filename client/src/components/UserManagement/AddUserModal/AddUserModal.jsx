import React from 'react';

const AddUserModal = ({ addingUser, setAddingUser, handleAddUserSubmit }) => {
  if (!addingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add New User</h2>
        <form onSubmit={handleAddUserSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              value={addingUser.name} 
              onChange={(e) => setAddingUser({...addingUser, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Sarah Jenkins"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={addingUser.email} 
              onChange={(e) => setAddingUser({...addingUser, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="s.jenkins@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Access Role</label>
            <select 
              value={addingUser.role} 
              onChange={(e) => setAddingUser({...addingUser, role: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#2A364F] mt-6">
            <button 
              type="button" 
              onClick={() => setAddingUser(null)} 
              className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-[#161F2E] border border-slate-300 dark:border-[#2A364F] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
