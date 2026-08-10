import React, { useState, useEffect } from 'react';
import Modal from '../components/Modals/Modal';
import { useObligations } from '../hooks/useObligations';

const ObligationTracker = () => {
  const { data: obligations, setData: setObligations } = useObligations('/api/obligations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    contract: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });

  const handleMarkDone = (id) => {
    setObligations(obligations.map(obl => 
      obl.id === id ? { ...obl, status: 'Completed' } : obl
    ));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newId = `OBL-00${obligations.length + 1}`;
    setObligations([...obligations, {
      id: newId,
      contract: newTask.contract,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: 'Pending',
      priority: newTask.priority
    }]);
    setIsModalOpen(false);
    setNewTask({ contract: '', description: '', dueDate: '', priority: 'Medium' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
            Obligation Tracker
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
            Track and manage deliverables and deadlines across all contracts.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Task</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0B1121]/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E9BAE] border-b border-slate-200 dark:border-[#2A364F]">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Contract</th>
                <th className="px-6 py-4">Task Description</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
              {obligations.map((obl, idx) => {
                const priorityClass = obl.priority === 'Critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                  : obl.priority === 'High'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30';

                const statusClass = obl.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                  : obl.status === 'Overdue'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{obl.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{obl.contract}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{obl.description}</td>
                    <td className={`px-6 py-4 font-medium ${obl.status === 'Overdue' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {obl.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityClass}`}>
                        {obl.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClass}`}>
                        {obl.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {obl.status !== 'Completed' ? (
                        <button 
                          onClick={() => handleMarkDone(obl.id)} 
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                        >
                          Mark Done
                        </button>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1">
                          <i className="fa-solid fa-check"></i>
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {obligations.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    No obligations tracked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Obligation">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Contract Name</label>
            <input 
              required 
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={newTask.contract} 
              onChange={(e) => setNewTask({...newTask, contract: e.target.value})} 
              placeholder="e.g. Acme Corp NDA" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Task Description</label>
            <input 
              required 
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={newTask.description} 
              onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
              placeholder="e.g. Submit Q3 Financials" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Due Date</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={newTask.dueDate} 
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
              placeholder="e.g. Oct 15, 2026" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Priority</label>
            <select 
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-[#0B1121] border border-slate-300 dark:border-[#2A364F] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={newTask.priority} 
              onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
            >
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-[#161F2E] border border-slate-300 dark:border-[#2A364F] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ObligationTracker;
