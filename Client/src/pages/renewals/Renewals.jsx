import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, AlertTriangle, RefreshCw, CheckCircle, Clock,
  XCircle, CalendarClock, Eye, PlayCircle, Bell, Filter,
  TrendingUp, ArrowUpRight, Plus
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modals/Modal';
import './Renewals.css';
import { API_BASE } from "../../constants";

const Renewals = () => {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [newRenewal, setNewRenewal] = useState({
    contract_name: '', contract_id_ref: '', category: 'Software License', vendor: '',
    owner: '', expiry_date: '', notice_period_days: 30, value: '', auto_renew: false,
  });

  const categories = [
    'All', 'Software License', 'Cloud Services', 'IT Services',
    'Communication', 'Security', 'HR Software', 'ERP Software',
    'Network Equipment'
  ];

  const statuses = ['All', 'Upcoming', 'In Progress', 'Renewed', 'Expired', 'Cancelled'];

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/renewals/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      } else {
        setFeedback({ type: 'error', message: 'Could not load renewal summary. Confirm that the backend is running.' });
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
      setFeedback({ type: 'error', message: 'Could not connect to the backend. Start the server and refresh this page.' });
    }
  }, []);

  const fetchRenewals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await fetch(`${API_BASE}/renewals/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRenewals(data);
      } else {
        setFeedback({ type: 'error', message: 'Could not load renewals.' });
      }
    } catch (err) {
      console.error('Failed to fetch renewals:', err);
      setFeedback({ type: 'error', message: 'Could not connect to the backend. Start the server and refresh this page.' });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchSummary();
    fetchRenewals();
  }, [fetchSummary, fetchRenewals]);

  const updateNewRenewal = (field, value) => {
    setNewRenewal((current) => ({ ...current, [field]: value }));
  };

  const handleAddRenewal = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/renewals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRenewal,
          expiry_date: new Date(`${newRenewal.expiry_date}T00:00:00`).toISOString(),
          notice_period_days: Number(newRenewal.notice_period_days),
          value: Number(newRenewal.value),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || 'Unable to create renewal');

      setIsAddModalOpen(false);
      setNewRenewal({
        contract_name: '', contract_id_ref: '', category: 'Software License', vendor: '',
        owner: '', expiry_date: '', notice_period_days: 30, value: '', auto_renew: false,
      });
      setFeedback({ type: 'success', message: 'Renewal created successfully.' });
      await Promise.all([fetchRenewals(), fetchSummary()]);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Unable to create renewal.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    if (renewals.length === 0) {
      setFeedback({ type: 'error', message: 'There are no renewal records to export.' });
      return;
    }
    const columns = ['Contract', 'Contract ID', 'Category', 'Vendor', 'Owner', 'Expiry Date', 'Days Left', 'Value', 'Status'];
    const rows = renewals.map((renewal) => [
      renewal.contract_name, renewal.contract_id_ref, renewal.category, renewal.vendor,
      renewal.owner, renewal.expiry_date, renewal.days_until_expiry, renewal.value, renewal.status,
    ]);
    const csv = [columns, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'renewals.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    setFeedback({ type: 'success', message: 'Renewals exported to CSV.' });
  };

  const handleStartRenewal = async (renewalId) => {
    setActionLoading(renewalId);
    try {
      const res = await fetch(`${API_BASE}/renewals/${renewalId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'In Progress', performed_by: 'Current User' }),
      });
      if (res.ok) {
        await fetchRenewals();
        await fetchSummary();
      }
    } catch (err) {
      console.error('Failed to start renewal:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReminder = async (renewalId) => {
    setActionLoading(`remind-${renewalId}`);
    try {
      // Schedule a reminder for 7 days from now
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 7);

      const res = await fetch(`${API_BASE}/renewals/${renewalId}/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reminder_date: reminderDate.toISOString(),
          message: 'Renewal action required — please review',
        }),
      });
      if (res.ok) {
        alert('Reminder scheduled successfully!');
        await fetchRenewals();
      }
    } catch (err) {
      console.error('Failed to schedule reminder:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Upcoming':    { icon: <Clock size={13} />, className: 'rnw-badge-upcoming' },
      'In Progress': { icon: <RefreshCw size={13} />, className: 'rnw-badge-progress' },
      'Renewed':     { icon: <CheckCircle size={13} />, className: 'rnw-badge-renewed' },
      'Expired':     { icon: <XCircle size={13} />, className: 'rnw-badge-expired' },
      'Cancelled':   { icon: <XCircle size={13} />, className: 'rnw-badge-cancelled' },
    };
    const c = config[status] || { icon: null, className: '' };
    return (
      <span className={`rnw-status-badge ${c.className}`}>
        {c.icon} {status}
      </span>
    );
  };

  const getDaysLeftDisplay = (days) => {
    if (days < 0) {
      return <span className="rnw-days-text rnw-days-expired">Expired</span>;
    }
    let urgencyClass = 'rnw-days-safe';
    if (days <= 30) urgencyClass = 'rnw-days-critical';
    else if (days <= 90) urgencyClass = 'rnw-days-warning';

    return <span className={`rnw-days-text ${urgencyClass}`}>{days}d</span>;
  };

  const getActionRequired = (renewal) => {
    if (renewal.status === 'Expired') return 'Review Required';
    if (renewal.status === 'Cancelled') return 'N/A';
    if (renewal.status === 'Renewed') return 'On Track';
    if (renewal.status === 'In Progress') return 'Initiate Renewal';
    if (renewal.days_until_expiry <= 30) return 'Initiate Renewal';
    return 'Monitor Closely';
  };

  const formatValue = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-CA');
  };

  const summaryCards = summary ? [
    {
      label: 'Upcoming',
      count: summary.upcoming,
      icon: <Clock size={22} />,
      colorClass: 'rnw-card-upcoming',
      desc: 'Pending renewal'
    },
    {
      label: 'In Progress',
      count: summary.in_progress,
      icon: <RefreshCw size={22} />,
      colorClass: 'rnw-card-progress',
      desc: 'Under review'
    },
    {
      label: 'Renewed',
      count: summary.renewed,
      icon: <CheckCircle size={22} />,
      colorClass: 'rnw-card-renewed',
      desc: 'Successfully renewed'
    },
    {
      label: 'Expired',
      count: summary.expired,
      icon: <XCircle size={22} />,
      colorClass: 'rnw-card-expired',
      desc: 'Past expiry date'
    },
    {
      label: 'Cancelled',
      count: summary.cancelled,
      icon: <AlertTriangle size={22} />,
      colorClass: 'rnw-card-cancelled',
      desc: 'Renewal cancelled'
    },
  ] : [];

  return (
    <div className="renewals-dashboard fade-in">
      {/* Header */}
      <div className="rnw-header-section">
        <div className="rnw-header-content">
          <h1 className="rnw-title">Renewal Dashboard</h1>
          <p className="rnw-subtitle">Monitor and manage upcoming contract renewals</p>
        </div>
        <div className="rnw-header-actions">
          <Button variant="outline" icon={TrendingUp} onClick={handleExport}>Export</Button>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>Add Renewal</Button>
        </div>
      </div>

      {feedback && (
        <div className={`rnw-feedback rnw-feedback-${feedback.type}`} role="status">
          <span>{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss message">×</button>
        </div>
      )}

      {/* Stat Cards */}
      {summary && (
        <div className="rnw-stat-cards">
          {summaryCards.map((card) => (
            <div key={card.label} className={`rnw-stat-card ${card.colorClass}`}>
              <div className="rnw-stat-icon">{card.icon}</div>
              <div className="rnw-stat-info">
                <div className="rnw-stat-count">{card.count}</div>
                <div className="rnw-stat-label">{card.label}</div>
                <div className="rnw-stat-desc">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Banner */}
      {summary && summary.expiring_soon_no_action > 0 && (
        <div className="rnw-alert-banner">
          <AlertTriangle size={18} />
          <span>
            <strong>{summary.expiring_soon_no_action} contract{summary.expiring_soon_no_action > 1 ? 's' : ''}</strong> expiring within 30 days with no renewal action started.
            Total value at risk: <strong>{formatValue(summary.total_value_at_risk)}</strong>
          </span>
        </div>
      )}

      {/* Contracts Table Section */}
      <div className="rnw-main-area animate-slide-up">
        <div className="rnw-section-header">
          <h2>Contracts Requiring Renewal Action</h2>
          <span className="rnw-view-all" onClick={() => setStatusFilter('All')}>
            View All Contracts →
          </span>
        </div>

        {/* Filter Bar */}
        <div className="rnw-toolbar">
          <div className="rnw-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search contracts, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rnw-filters">
            <select
              className="rnw-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <select
              className="rnw-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rnw-table-wrapper">
          {loading ? (
            <div className="rnw-loading">
              <div className="rnw-spinner"></div>
              <p>Loading renewals...</p>
            </div>
          ) : renewals.length === 0 ? (
            <div className="rnw-empty-state">
              <CalendarClock size={48} />
              <h3>No renewals found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <table className="rnw-data-table">
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Vendor</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Action Required</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {renewals.map((renewal, index) => (
                  <tr
                    key={renewal.renewal_id}
                    className="rnw-table-row"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <td>
                      <div className="rnw-contract-name">{renewal.contract_name}</div>
                      <div className="rnw-contract-id">{renewal.contract_id_ref}</div>
                    </td>
                    <td className="rnw-vendor">{renewal.vendor}</td>
                    <td className="rnw-date">{formatDate(renewal.expiry_date)}</td>
                    <td>{getDaysLeftDisplay(renewal.days_until_expiry)}</td>
                    <td className="rnw-value">{formatValue(renewal.value)}</td>
                    <td>{getStatusBadge(renewal.status)}</td>
                    <td>
                      <span className="rnw-action-required">{getActionRequired(renewal)}</span>
                    </td>
                    <td className="rnw-action-cell">
                      {renewal.status === 'Upcoming' && renewal.days_until_expiry <= 90 ? (
                        <button
                          className="rnw-action-btn rnw-start-btn"
                          onClick={(e) => { e.stopPropagation(); handleStartRenewal(renewal.renewal_id); }}
                          disabled={actionLoading === renewal.renewal_id}
                        >
                          {actionLoading === renewal.renewal_id ? '...' : 'Start Renewal'}
                        </button>
                      ) : (
                        <button
                          className="rnw-action-btn rnw-view-btn"
                          onClick={() => navigate(`/renewals/${renewal.renewal_id}`)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Add Renewal"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" form="add-renewal-form" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Renewal'}
            </Button>
          </>
        }
      >
        <form id="add-renewal-form" className="rnw-form" onSubmit={handleAddRenewal}>
          <label className="rnw-form-field">Contract name<input required value={newRenewal.contract_name} onChange={(e) => updateNewRenewal('contract_name', e.target.value)} /></label>
          <div className="rnw-form-grid">
            <label className="rnw-form-field">Contract ID<input required value={newRenewal.contract_id_ref} onChange={(e) => updateNewRenewal('contract_id_ref', e.target.value)} placeholder="e.g. CNT-2026-001" /></label>
            <label className="rnw-form-field">Category<select value={newRenewal.category} onChange={(e) => updateNewRenewal('category', e.target.value)}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
          </div>
          <div className="rnw-form-grid">
            <label className="rnw-form-field">Vendor<input required value={newRenewal.vendor} onChange={(e) => updateNewRenewal('vendor', e.target.value)} /></label>
            <label className="rnw-form-field">Owner<input required value={newRenewal.owner} onChange={(e) => updateNewRenewal('owner', e.target.value)} /></label>
          </div>
          <div className="rnw-form-grid">
            <label className="rnw-form-field">Expiry date<input required type="date" value={newRenewal.expiry_date} onChange={(e) => updateNewRenewal('expiry_date', e.target.value)} /></label>
            <label className="rnw-form-field">Value<input required min="0" type="number" step="0.01" value={newRenewal.value} onChange={(e) => updateNewRenewal('value', e.target.value)} /></label>
          </div>
          <div className="rnw-form-grid">
            <label className="rnw-form-field">Notice period (days)<input required min="0" type="number" value={newRenewal.notice_period_days} onChange={(e) => updateNewRenewal('notice_period_days', e.target.value)} /></label>
            <label className="rnw-checkbox"><input type="checkbox" checked={newRenewal.auto_renew} onChange={(e) => updateNewRenewal('auto_renew', e.target.checked)} /> Automatically renew</label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Renewals;
