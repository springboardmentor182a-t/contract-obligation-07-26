import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  History,
  Lock,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  User,
  XCircle,
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import FormSelect from '../../components/Form/FormSelect';
import Modal from '../../components/Modals/Modal';
import {
  exportAuditReport,
  getAuditAnalytics,
  getAuditLogs,
  getAuditSummary,
} from '../../features/auditLogs/services/getAuditLogs';
import './AuditLogs.css';

const TABS = [
  { id: 'all', label: 'All Logs', icon: Activity },
  { id: 'activity', label: 'User Activity', category: 'Activity', icon: User },
  { id: 'contract', label: 'Contract History', category: 'Contract', icon: FileText },
  { id: 'approval', label: 'Approval Logs', category: 'Approval', icon: CheckCircle2 },
  { id: 'analytics', label: 'Audit Reports', category: 'Reports', icon: BarChart3 },
  { id: 'security', label: 'Security Logs', category: 'Security', icon: ShieldAlert },
  { id: 'change', label: 'Change History', category: 'Change', icon: History },
];

const MODULE_OPTIONS = [
  'All',
  'Authentication',
  'Users',
  'Contracts',
  'Obligations',
  'Renewals',
  'Compliance',
  'Reports',
  'Settings',
  'System',
];

const STATUS_OPTIONS = ['All', 'Success', 'Warning', 'Error'];

const badgeClass = (category) => `audit-category audit-${(category || 'activity').toLowerCase()}`;

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value))
    : '—';

const parseFormattedJson = (value) => {
  if (!value) return 'No previous state recorded';
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return String(value);
  }
};

const moduleIcon = (module) =>
  ({
    Authentication: Lock,
    Users: User,
    Settings: Settings,
    Contracts: FileText,
    Renewals: History,
    Compliance: ShieldCheck,
    Obligations: FileCheck2,
    Reports: BarChart3,
  }[module] || Activity);

const statusBadgeClass = (status, severity) => {
  const stat = (status || 'Success').toLowerCase();
  const sev = (severity || 'Info').toLowerCase();
  if (stat === 'error' || sev === 'error' || sev === 'critical') return 'audit-status audit-status-error';
  if (stat === 'warning' || sev === 'warning') return 'audit-status audit-status-warning';
  return 'audit-status audit-status-success';
};

export default function AuditLogs() {
  const [activeTab, setActiveTab] = useState('all');
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ total: 0, categories: {} });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    module: 'All',
    status: 'All',
    start_date: '',
    end_date: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const activeTabDef = TABS.find((t) => t.id === activeTab);
      const effectiveCategory = activeTab === 'all' ? filters.category : activeTabDef?.category;

      const effectiveFilters = {
        ...filters,
        category: effectiveCategory,
      };

      const [listData, summaryData, analyticsData] = await Promise.all([
        getAuditLogs(effectiveFilters),
        getAuditSummary(),
        getAuditAnalytics(),
      ]);

      setLogs(listData);
      setSummary(summaryData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 150);
    return () => clearTimeout(timer);
  }, [
    activeTab,
    filters.search,
    filters.category,
    filters.module,
    filters.status,
    filters.start_date,
    filters.end_date,
  ]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFilters((prev) => ({
      ...prev,
      module: 'All',
      status: 'All',
      search: '',
    }));
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      module: 'All',
      status: 'All',
      start_date: '',
      end_date: '',
    });
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const activeTabDef = TABS.find((t) => t.id === activeTab);
      const effectiveCategory = activeTab === 'all' ? filters.category : activeTabDef?.category;

      const effectiveFilters = {
        ...filters,
        category: effectiveCategory,
      };
      const blob = await exportAuditReport(effectiveFilters, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contractiq-audit-${activeTab}-${new Date().toISOString().slice(0, 10)}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const cards = [
    { label: 'Total Audit Logs', value: summary.total || 0, icon: Activity, color: '#2563eb' },
    { label: 'User Activity', value: summary.categories?.Activity || 0, icon: User, color: '#3b82f6' },
    { label: 'Security Events', value: summary.categories?.Security || 0, icon: ShieldAlert, color: '#f59e0b' },
    { label: 'System Changes', value: summary.categories?.Change || 0, icon: History, color: '#ec4899' },
  ];

  return (
    <div className="audit-dashboard fade-in">
      {/* Page Header */}
      <div className="audit-page-header">
        <div className="audit-header-title">
          <ShieldCheck size={26} className="audit-header-icon" />
          <div>
            <h1>Audit & Activity Logs</h1>
            <p>Monitor system events, user activity, security alerts, and change history.</p>
          </div>
        </div>

        <div className="audit-header-actions">
          <Button variant="outline" icon={RefreshCw} onClick={loadData} disabled={loading}>
            Refresh
          </Button>
          <Button variant="outline" icon={Download} onClick={() => handleExport('csv')} disabled={exporting}>
            Export CSV
          </Button>
          <Button variant="primary" icon={Download} onClick={() => handleExport('pdf')} disabled={exporting}>
            PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - 4 Clean Cards */}
      <div className="audit-summary-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div className="audit-summary-card" key={label}>
            <div className="audit-summary-card-top">
              <span>{label}</span>
              <div className="audit-card-icon" style={{ backgroundColor: `${color}12`, color }}>
                <Icon size={18} />
              </div>
            </div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      {/* Main Container Card */}
      <div className="audit-main-card">
        {/* Navigation Tabs Header */}
        <div className="audit-nav-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`audit-nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Analytics Reports View vs Log Table */}
        {activeTab === 'analytics' ? (
          <div className="analytics-container">
            <div className="audit-section-header">
              <h2>Audit Reports & Subsystem Analytics</h2>
              <p>Visual statistics on audit categories, subsystem activity, top active users, and export controls.</p>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Events by Category</h3>
                <div className="analytics-bar-list">
                  {Object.entries(analytics?.category_counts || {}).map(([cat, count]) => {
                    const pct = Math.round((count / (analytics?.total_events || 1)) * 100);
                    return (
                      <div className="analytics-bar-item" key={cat}>
                        <div className="analytics-bar-label">
                          <span>{cat} Logs</span>
                          <strong>
                            {count} ({pct}%)
                          </strong>
                        </div>
                        <div className="analytics-progress-track">
                          <div className={`analytics-progress-fill fill-${cat.toLowerCase()}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="analytics-card">
                <h3>Activity by Subsystem Module</h3>
                <div className="analytics-bar-list">
                  {Object.entries(analytics?.module_counts || {}).map(([mod, count]) => {
                    const pct = Math.round((count / (analytics?.total_events || 1)) * 100);
                    return (
                      <div className="analytics-bar-item" key={mod}>
                        <div className="analytics-bar-label">
                          <span>{mod}</span>
                          <strong>{count}</strong>
                        </div>
                        <div className="analytics-progress-track">
                          <div className="analytics-progress-fill fill-module" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="analytics-card">
                <h3>Top Active System Users</h3>
                <ul className="analytics-user-list">
                  {(analytics?.top_users || []).map((user, idx) => (
                    <li className="analytics-user-item" key={user.name}>
                      <div className="analytics-user-info">
                        <span className="analytics-user-rank">#{idx + 1}</span>
                        <div className="audit-user-avatar">{user.name.slice(0, 2).toUpperCase()}</div>
                        <span className="analytics-user-name">{user.name}</span>
                      </div>
                      <span className="analytics-user-count">{user.count} events</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="analytics-card analytics-export-card">
                <h3>Custom Audit Export</h3>
                <p>Download structured audit activity report in CSV or PDF format.</p>

                <div className="analytics-export-form">
                  <div className="form-group-row">
                    <input
                      type="date"
                      className="audit-date-input"
                      value={filters.start_date}
                      onChange={(e) => updateFilter('start_date', e.target.value)}
                    />
                    <input
                      type="date"
                      className="audit-date-input"
                      value={filters.end_date}
                      onChange={(e) => updateFilter('end_date', e.target.value)}
                    />
                  </div>

                  <div className="analytics-export-buttons">
                    <Button variant="outline" icon={Download} onClick={() => handleExport('csv')}>
                      Export CSV
                    </Button>
                    <Button variant="primary" icon={Download} onClick={() => handleExport('pdf')}>
                      Export PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Crisp Toolbar & Filter Bar */}
            <div className="audit-toolbar">
              <div className="audit-search-box">
                <Search size={16} />
                <input
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search user, action, module..."
                />
              </div>

              <div className="audit-filter-controls">
                {activeTab === 'all' && (
                  <FormSelect
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Activity', label: 'Activity' },
                      { value: 'Contract', label: 'Contracts' },
                      { value: 'Approval', label: 'Approvals' },
                      { value: 'Security', label: 'Security' },
                      { value: 'Change', label: 'Changes' },
                    ]}
                  />
                )}

                <FormSelect
                  value={filters.module}
                  onChange={(e) => updateFilter('module', e.target.value)}
                  options={MODULE_OPTIONS.map((val) => ({ value: val, label: val === 'All' ? 'All Modules' : val }))}
                />

                <FormSelect
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  options={STATUS_OPTIONS.map((val) => ({ value: val, label: val === 'All' ? 'All Statuses' : val }))}
                />

                {(filters.search || filters.category !== 'All' || filters.module !== 'All' || filters.status !== 'All') && (
                  <button className="audit-clear-button" onClick={handleResetFilters}>
                    Reset
                  </button>
                )}
              </div>
            </div>

            {error && <div className="audit-message error">{error}</div>}

            {/* Clean Log Table */}
            <div className="audit-table-container">
              <table className="audit-log-table">
                <thead>
                  <tr>
                    <th style={{ width: '180px' }}>Timestamp</th>
                    <th style={{ width: '170px' }}>User / Actor</th>
                    <th style={{ width: '120px' }}>Category</th>
                    <th style={{ width: '150px' }}>Reference</th>
                    <th>Action & Description</th>
                    <th style={{ width: '150px' }}>Module</th>
                    <th style={{ width: '100px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="audit-message">
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="audit-message">
                        No audit events recorded for this view.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const Icon = moduleIcon(log.module);
                      return (
                        <tr key={log.audit_id} onClick={() => setSelected(log)} className="audit-clickable-row">
                          <td className="audit-time-cell">{formatDate(log.created_at)}</td>
                          <td>
                            <div className="audit-user">
                              <div className="audit-user-avatar">{log.user_name?.slice(0, 2).toUpperCase()}</div>
                              <span className="audit-user-name">{log.user_name}</span>
                            </div>
                          </td>
                          <td>
                            <span className={badgeClass(log.category)}>{log.category}</span>
                          </td>
                          <td>
                            <strong className="audit-entity-type">{log.entity_type || log.module}</strong>
                            <small className="audit-entity-id">{log.entity_id || '—'}</small>
                          </td>
                          <td>
                            <strong className="audit-action-title">{log.action}</strong>
                            <small className="audit-description-sub">{log.description}</small>
                          </td>
                          <td>
                            <span className="audit-module">
                              <Icon size={14} />
                              {log.module}
                            </span>
                          </td>
                          <td>
                            <span className={statusBadgeClass(log.status, log.severity)}>{log.status || 'Success'}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail & Side-by-Side Diff Inspection */}
      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Audit Event #${selected.audit_id} · ${selected.category} Log`}
          footer={<Button variant="primary" onClick={() => setSelected(null)}>Close Inspection</Button>}
        >
          <div className="audit-detail">
            <div className="audit-detail-header-info">
              <h3>{selected.action}</h3>
              <p>{selected.description}</p>
            </div>

            <div className="audit-detail-grid">
              <div>
                <span>Actor / User</span>
                <b>{selected.user_name}</b>
              </div>
              <div>
                <span>Entity Reference</span>
                <b>
                  {selected.entity_type} · {selected.entity_id || 'N/A'}
                </b>
              </div>
              <div>
                <span>Category & Severity</span>
                <b>
                  {selected.category} ({selected.severity || 'Info'})
                </b>
              </div>
              <div>
                <span>IP Address</span>
                <b>{selected.ip_address || '127.0.0.1'}</b>
              </div>
              <div>
                <span>Timestamp</span>
                <b>{formatDate(selected.created_at)}</b>
              </div>
              <div>
                <span>Status</span>
                <b>{selected.status}</b>
              </div>
            </div>

            {/* Side-by-Side Diff Section */}
            <div className="audit-diff-section">
              <h4>Field Change Diff Inspection</h4>
              <div className="audit-diff-container">
                <div className="audit-diff-box before">
                  <label className="diff-label before-label">Previous State (Before)</label>
                  <pre className="diff-content">{parseFormattedJson(selected.old_value)}</pre>
                </div>
                <div className="audit-diff-box after">
                  <label className="diff-label after-label">New State (After)</label>
                  <pre className="diff-content">{parseFormattedJson(selected.new_value)}</pre>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
