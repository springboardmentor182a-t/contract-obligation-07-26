import React, { useEffect, useState } from 'react';
import { Activity, Download, FileCheck2, FileText, History, Search, Settings, Shield, ShieldAlert, ShieldCheck, SlidersHorizontal, User } from 'lucide-react';
import Button from '../../components/Buttons/Button';
import FormSelect from '../../components/Form/FormSelect';
import Modal from '../../components/Modals/Modal';
import { exportAuditReport, getAuditLogs, getAuditSummary } from '../../features/auditLogs/services/getAuditLogs';
import './AuditLogs.css';

const categories = ['Activity', 'Contract', 'Approval', 'Security', 'Change'];
const badgeClass = (category) => `audit-category audit-${category.toLowerCase()}`;
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '—';
const parseValue = (value) => { try { return value ? JSON.stringify(JSON.parse(value), null, 2) : 'No value recorded'; } catch { return value || 'No value recorded'; } };
const moduleIcon = (module) => ({ Authentication: Shield, Users: User, Settings, Contracts: FileText, Renewals: History, Compliance: ShieldCheck, Obligations: FileCheck2 }[module] || Activity);
const statusClass = (status) => `audit-status audit-status-${(status || 'success').toLowerCase()}`;

export default function AuditLogs() {
  const [logs, setLogs] = useState([]); const [summary, setSummary] = useState({ total: 0, categories: {} });
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: 'All', entity_type: 'All', status: 'All', start_date: '', end_date: '' });

  const load = async () => { setLoading(true); setError(''); try { const [list, counts] = await Promise.all([getAuditLogs(filters), getAuditSummary()]); setLogs(list); setSummary(counts); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [filters.search, filters.category, filters.entity_type, filters.status, filters.start_date, filters.end_date]);
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const handleExport = async (format) => { try { const blob = await exportAuditReport(filters, format); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `contractiq-audit-report.${format}`; link.click(); URL.revokeObjectURL(url); } catch (err) { setError(err.message); } };
  const cards = [{ label: 'All audit events', value: summary.total, icon: Activity }, ...categories.slice(0, 4).map((category, index) => ({ label: `${category} logs`, value: summary.categories?.[category] || 0, icon: [History, FileCheck2, ShieldCheck, ShieldAlert][index] }))];

  return <div className="audit-dashboard fade-in">
    <div className="audit-page-header"><div><h1>Audit & Activity Management</h1><p>Track system activity, approvals, security events, and change history.</p></div><div className="audit-header-actions"><Button variant="outline" icon={Download} onClick={() => handleExport('csv')}>Export CSV</Button><Button variant="primary" icon={Download} onClick={() => handleExport('pdf')}>Export report</Button></div></div>
    <div className="audit-summary-grid">{cards.map(({ label, value, icon: Icon }) => <div className="audit-summary-card" key={label}><div className="audit-card-icon"><Icon size={21} /></div><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
    <section className="audit-content-card"><div className="audit-toolbar"><div className="audit-search-box"><Search size={18} /><input value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Search user, event, or reference..." /></div><div className="audit-filter-controls"><SlidersHorizontal size={17} /><FormSelect value={filters.category} onChange={(event) => update('category', event.target.value)} options={[{ value: 'All', label: 'All categories' }, ...categories.map((value) => ({ value, label: value }))]} /><FormSelect value={filters.entity_type} onChange={(event) => update('entity_type', event.target.value)} options={['All', 'Contract', 'Obligation', 'Renewal', 'User', 'Compliance'].map((value) => ({ value, label: value === 'All' ? 'All entities' : value }))} /><FormSelect value={filters.status} onChange={(event) => update('status', event.target.value)} options={['All', 'Success', 'Warning', 'Error'].map((value) => ({ value, label: value === 'All' ? 'All statuses' : value }))} /><input aria-label="Start date" type="date" value={filters.start_date} onChange={(event) => update('start_date', event.target.value)} /><input aria-label="End date" type="date" value={filters.end_date} onChange={(event) => update('end_date', event.target.value)} /></div></div>
      {error && <div className="audit-message error">{error}</div>}
      <div className="audit-table-scroll"><table className="audit-log-table"><thead><tr><th>Timestamp</th><th>User</th><th>Category</th><th>Entity</th><th>Activity</th><th>Module</th><th>IP address</th><th>Status</th><th></th></tr></thead><tbody>{loading ? <tr><td colSpan="9" className="audit-message">Loading audit activity…</td></tr> : logs.length === 0 ? <tr><td colSpan="9" className="audit-message">No audit events match these filters.</td></tr> : logs.map((log) => { const Icon = moduleIcon(log.module); return <tr key={log.audit_id}><td>{formatDate(log.created_at)}</td><td><div className="audit-user"><span>{log.user_name?.slice(0, 2).toUpperCase()}</span>{log.user_name}</div></td><td><span className={badgeClass(log.category)}>{log.category}</span></td><td><strong>{log.entity_type || log.module}</strong><small>{log.entity_id || '—'}</small></td><td><strong>{log.action}</strong><small>{log.description}</small></td><td><span className="audit-module"><Icon size={16} />{log.module}</span></td><td>{log.ip_address || '—'}</td><td><span className={statusClass(log.status)}>{log.status || 'Success'}</span></td><td><button className="audit-detail-button" onClick={() => setSelected(log)}>View details</button></td></tr>})}</tbody></table></div>
    </section>
    {selected && <Modal isOpen onClose={() => setSelected(null)} title={`Audit event #${selected.audit_id}`} footer={<Button variant="primary" onClick={() => setSelected(null)}>Close</Button>}><div className="audit-detail"><p><b>{selected.description}</b></p><div className="audit-detail-grid"><span>Actor <b>{selected.user_name}</b></span><span>Entity <b>{selected.entity_type} · {selected.entity_id || '—'}</b></span><span>Severity <b>{selected.severity}</b></span><span>Time <b>{formatDate(selected.created_at)}</b></span></div><div className="audit-diff"><div><label>Before</label><pre>{parseValue(selected.old_value)}</pre></div><div><label>After</label><pre>{parseValue(selected.new_value)}</pre></div></div></div></Modal>}
  </div>;
}
