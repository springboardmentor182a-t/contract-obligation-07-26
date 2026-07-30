import React, { useState, useEffect } from 'react';

const Renewals = () => {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/renewals')
      .then(res => res.json())
      .then(data => {
        setRenewals(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Renewals Tracker</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Manage upcoming contract renewals and expirations.</p>
        </div>
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Type</th>
              <th>Renewal Date</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>Loading renewals...</td>
              </tr>
            ) : renewals.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No renewals found</td>
              </tr>
            ) : (
              renewals.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{r.contract}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.type}</td>
                  <td style={{ fontWeight: 500 }}>{r.renewalDate}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.owner}</td>
                  <td>
                    <span className={`badge ${String(r.status || '').toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Renewals;
