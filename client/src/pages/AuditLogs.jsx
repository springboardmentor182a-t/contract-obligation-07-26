import React, { useState, useEffect } from 'react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Audit Logs</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Un-editable system record of all user actions and data modifications.</p>
        </div>
        <button className="premium-button" style={{ width: 'auto', padding: '12px 24px', backgroundColor: 'var(--primary-color)' }}>
          <i className="fa-solid fa-file-export" style={{ marginRight: '8px' }}></i> Export CSV
        </button>
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Target Object</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{log.time}</td>
                <td style={{ fontWeight: 600 }}>{log.user}</td>
                <td><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{log.action}</span></td>
                <td>{log.target}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
