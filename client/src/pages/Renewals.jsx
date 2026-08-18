import React, { useState, useEffect } from 'react';
import api from '../api';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

const STATUS_CONFIG = {
  upcoming:    { label: 'Upcoming',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  renewed:     { label: 'Renewed',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  expired:     { label: 'Expired',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  cancelled:   { label: 'Cancelled',   color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

const PRIORITY_CONFIG = {
  critical: { color: '#ef4444' },
  high:     { color: '#f97316' },
  medium:   { color: '#f59e0b' },
  low:      { color: '#10b981' },
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Renewals() {
  const [renewals, setRenewals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = () => {
    setLoading(true);
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;

    Promise.all([
      api.get('/renewals', { params }),
      api.get('/renewals/stats'),
    ]).then(([rRes, sRes]) => {
      setRenewals(rRes.data);
      setStats(sRes.data);
      setLoading(false);
    }).catch(err => {
      setError(err.response?.data?.detail || 'Failed to load renewals.');
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, [filter, search]);

  const s = stats || {};

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Renewal Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Track and manage all contract renewals in real time.
          </p>
        </div>
        <button onClick={fetchData} style={btnStyle}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Stats Row */}
      {stats && (
        <div style={statsRow}>
          {[
            { label: 'Total', value: s.total, color: '#3b82f6' },
            { label: 'Upcoming', value: s.upcoming, color: '#6366f1' },
            { label: 'In Progress', value: s.in_progress, color: '#f59e0b' },
            { label: 'Renewed', value: s.renewed, color: '#10b981' },
            { label: 'Expired', value: s.expired, color: '#ef4444' },
            { label: 'Due in 30d', value: s.expiring_in_30_days, color: '#f97316' },
          ].map(item => (
            <div key={item.label} style={statCard}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: item.color }}>{item.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contract, vendor..."
            style={{ ...inputStyle, paddingLeft: '32px' }}
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={inputStyle}>
          <option value="">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="in_progress">In Progress</option>
          <option value="renewed">Renewed</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Renewal #</th>
              <th>Contract / Vendor</th>
              <th>Manager</th>
              <th>End Date</th>
              <th>Days Left</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={centered}>Loading renewals…</td></tr>
            ) : renewals.length === 0 ? (
              <tr><td colSpan="7" style={centered}>No renewals found.</td></tr>
            ) : (
              renewals.map(r => {
                const statusCfg = STATUS_CONFIG[r.status] || { label: r.status, color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
                const priorityCfg = PRIORITY_CONFIG[r.priority] || { color: '#64748b' };
                const days = daysUntil(r.original_end_date);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: '#3b82f6', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {r.renewal_number}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {r.contract?.title || '—'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {r.contract?.vendor_name} · {r.contract?.contract_number}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {r.manager?.full_name || '—'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {r.manager?.department}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                      {r.original_end_date}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: '700', fontSize: '0.85rem',
                        color: days < 0 ? '#ef4444' : days < 30 ? '#f97316' : days < 90 ? '#f59e0b' : '#10b981'
                      }}>
                        {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', fontSize: '0.78rem', color: priorityCfg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {r.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700', color: statusCfg.color, backgroundColor: statusCfg.bg }}>
                        {statusCfg.label}
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
  );
}

const btnStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 16px', background: 'var(--bg-app)',
  border: '1px solid var(--border-color)', borderRadius: '8px',
  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
};
const inputStyle = {
  padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-color)',
  borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
};
const statsRow = {
  display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap',
};
const statCard = {
  flex: '1', minWidth: '100px', background: 'var(--bg-card)',
  border: '1px solid var(--border-color)', borderRadius: '12px',
  padding: '14px 16px', textAlign: 'center',
};
const centered = { textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px' };
const errorStyle = {
  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
  borderRadius: '8px', padding: '12px 16px', color: '#f87171', marginBottom: '16px', fontSize: '13px',
};
