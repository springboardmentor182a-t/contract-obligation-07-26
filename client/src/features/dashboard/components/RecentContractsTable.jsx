import React from 'react';
import { useNavigate } from 'react-router-dom';

const RISK_COLORS = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Critical: '#EF4444' };

export const RecentContractsTable = ({ isDarkMode, recentContracts }) => {
  const navigate = useNavigate();
  const fmtValue = (v) => {
    const n = Number(v) || 0;
    return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  };

  return (
    <div className={`rounded-xl border p-5 transition-all ${
      isDarkMode ? 'bg-[#161F2E] border-[#2A364F] shadow-lg' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className={`flex items-center justify-between pb-4 mb-4 border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-100'}`}>
        <h2 className={`text-base font-bold m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>Recent Contracts</h2>
        <button 
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            isDarkMode ? 'bg-[#0B1121] hover:bg-slate-800 text-slate-200 border-[#2A364F]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
          }`}
          onClick={() => navigate('/contracts')}
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#0B1121]/60 text-[#8E9BAE]' : 'bg-slate-50 text-slate-500'} border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-200'}`}>
            <tr>
              <th className="px-4 py-3">Contract</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-[#2A364F]/60' : 'divide-slate-100'}`}>
            {recentContracts.map((contract, index) => {
              const isCompliant = ['active', 'approved', 'completed'].includes(String(contract.status || '').toLowerCase());
              const isPending = ['pending', 'in review'].includes(String(contract.status || '').toLowerCase());
              const badgeClass = isCompliant
                ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                : isPending
                ? (isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200')
                : (isDarkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200');

              return (
                <tr key={index} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors`}>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{contract.type} · {contract.vendor}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{contract.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: RISK_COLORS[contract.risk] || '#64748B', fontWeight: 600, fontSize: '13px' }}>
                      {contract.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{fmtValue(contract.value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
