import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TaxEstimators = () => {
  const [taxData, setTaxData] = useState(null);

  useEffect(() => {
    fetch('/api/tax-estimators')
      .then(res => res.json())
      .then(data => setTaxData(data))
      .catch(console.error);
  }, []);

  if (!taxData) {
    return <div>Loading tax estimations...</div>;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
  const chartData = taxData.breakdown.map(item => ({
    name: item.category,
    value: parseFloat(item.amount.replace(/[^0-9.-]+/g, "")) || 0
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Tax Estimators</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Automated estimations for contract liabilities and deductions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Estimated Total Tax</h3>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-color)' }}>{taxData.estimatedTax}</div>
        </div>
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Effective Tax Rate</h3>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--warning-color)' }}>{taxData.taxRate}</div>
        </div>
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Deductions</h3>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success-color)' }}>{taxData.deductions}</div>
        </div>
        <div className="stat-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Projected Net Income</h3>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--secondary-color)' }}>{taxData.netIncome}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="premium-table-container flex-1">
          <h2 className="table-title border-b p-4 mb-0">Tax Breakdown</h2>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Jurisdiction / Category</th>
                <th>Estimated Amount</th>
              </tr>
            </thead>
            <tbody>
              {taxData.breakdown.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{item.category} Tax</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 flex-1 h-[400px]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 text-center">Tax Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TaxEstimators;
