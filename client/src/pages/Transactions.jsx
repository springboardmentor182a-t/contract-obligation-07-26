import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(console.error);
  }, []);

  const handleExport = () => {
    if (transactions.length === 0) return;
    const headers = ['Transaction ID', 'Date', 'Description', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => `"${t.id}","${t.date}","${t.description}","${t.amount}","${t.status}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions-ledger.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const chartData = transactions.map(t => ({
    date: t.date,
    amount: parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
            Financial Transactions
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
            Track and reconcile payments and monetary exchanges tied to your contracts.
          </p>
        </div>
        <button 
          onClick={handleExport} 
          className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-[#161F2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2A364F] shadow-sm transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <i className="fa-solid fa-download text-blue-600 dark:text-blue-400"></i>
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 m-0">Transaction Trends</h2>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2A364F' : '#E2E8F0'} />
              <XAxis dataKey="date" stroke={isDarkMode ? '#8E9BAE' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={isDarkMode ? '#8E9BAE' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#161F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A364F' : '#E2E8F0', borderRadius: '8px', color: isDarkMode ? '#FFF' : '#1E293B' }} />
              <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0B1121]/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8E9BAE] border-b border-slate-200 dark:border-[#2A364F]">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A364F]/60">
              {transactions.map((trx, idx) => {
                const isPaid = ['paid', 'completed', 'success'].includes(String(trx.status || '').toLowerCase());
                const isPending = ['pending', 'processing'].includes(String(trx.status || '').toLowerCase());

                const badgeClass = isPaid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                  : isPending
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{trx.id}</td>
                    <td className="px-6 py-4 text-xs text-[#64748B] dark:text-[#8E9BAE]">{trx.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{trx.description}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{trx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">Loading transactions...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
