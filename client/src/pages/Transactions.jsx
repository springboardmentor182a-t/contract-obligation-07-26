import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Financial Transactions</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Track all payments and monetary exchanges tied to your contracts.</p>
        </div>
        <button onClick={handleExport} className="premium-button" style={{ width: 'auto', padding: '12px 24px' }}>
          <i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Export Ledger
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 mb-8 h-80">
        <h2 className="text-xl font-bold text-gray-200 mb-4">Transaction Trends</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{trx.id}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{trx.date}</td>
                <td style={{ fontWeight: 500 }}>{trx.description}</td>
                <td style={{ fontWeight: 600 }}>{trx.amount}</td>
                <td>
                  <span className={`badge ${String(trx.status || '').toLowerCase()}`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>Loading transactions...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
