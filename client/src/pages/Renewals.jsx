import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Renewals = () => {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/renewals')
      .then(res => {
        setRenewals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
            Renewals Tracker
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
            Manage upcoming contract renewals, expirations, and notice windows.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0B1121]/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E9BAE] border-b border-slate-200 dark:border-[#2A364F]">
              <tr>
                <th className="px-6 py-4">Contract</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">ACV</th>
                <th className="px-6 py-4">Renewal Date</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
                  </td>
                </tr>
              ) : renewals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">No renewals found. Click 'Load Demo Data' in Settings to populate.</td>
                </tr>
              ) : (
                renewals.map((r, idx) => {
                  const isCompliant = ['active', 'renewed', 'approved'].includes(String(r.status || '').toLowerCase());
                  const isPending = ['pending', 'in review', 'upcoming', 'draft'].includes(String(r.status || '').toLowerCase());

                  const badgeClass = isCompliant
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                    : isPending
                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{r.contract}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{r.type}</td>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{r.acv}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{r.renewalDate}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{r.owner}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Renewals;
