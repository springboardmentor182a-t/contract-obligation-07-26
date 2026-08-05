import React, { useState, useEffect } from 'react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  const handleExport = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp', 'User', 'Action', 'Target Object', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...logs.map(l => `"${l.time}","${l.user}","${l.action}","${l.target}","${l.ip}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
            Audit Logs
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
            Immutable, cryptographically verified record of all user actions and system events.
          </p>
        </div>
        <button 
          onClick={handleExport}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-[#161F2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2A364F] shadow-sm transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <i className="fa-solid fa-file-export text-blue-600 dark:text-blue-400"></i>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0B1121]/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E9BAE] border-b border-slate-200 dark:border-[#2A364F]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Object</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-[#64748B] dark:text-[#8E9BAE]">{log.time}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-[#0B1121] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2A364F]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{log.target}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#64748B] dark:text-[#8E9BAE]">{log.ip}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    Loading audit events...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
