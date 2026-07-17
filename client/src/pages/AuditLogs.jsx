import React from 'react';

const AuditLogs = () => {
  const logs = [
    { time: '2026-07-12 09:42 AM', user: 'Admin User', action: 'Login', target: 'System', ip: '192.168.1.45' },
    { time: '2026-07-11 14:22 PM', user: 'Jane Doe', action: 'Uploaded Contract', target: 'CTR-2026-001', ip: '10.0.0.12' },
    { time: '2026-07-10 11:05 AM', user: 'John Smith', action: 'Approved', target: 'CTR-2026-002', ip: '172.16.0.4' },
    { time: '2026-07-09 16:45 PM', user: 'System', action: 'Automated Scan', target: 'All Active', ip: 'localhost' },
  ];

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
