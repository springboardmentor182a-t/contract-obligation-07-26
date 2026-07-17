import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, User, Building2, Tag, Clock, DollarSign,
  CheckCircle, XCircle, RefreshCw, AlertTriangle, Shield,
  Bell, FileText, PlayCircle
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import './RenewalDetail.css';
import { API_BASE } from "../../constants";

const RenewalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [renewal, setRenewal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/renewals/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRenewal(data);
      }
    } catch (err) {
      console.error('Failed to fetch renewal detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleApprovalAction = async (stepName, action) => {
    setActionLoading(stepName);
    try {
      const res = await fetch(`${API_BASE}/renewals/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_name: stepName,
          action: action,
          approver: 'Current User',
          comments: action === 'Approved' ? 'Approved by reviewer' : 'Rejected — needs revision',
        }),
      });
      if (res.ok) {
        await fetchDetail();
      }
    } catch (err) {
      console.error('Approval action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setActionLoading('status');
    try {
      const res = await fetch(`${API_BASE}/renewals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, performed_by: 'Current User' }),
      });
      if (res.ok) {
        await fetchDetail();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReminder = async () => {
    setActionLoading('reminder');
    try {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 7);

      const res = await fetch(`${API_BASE}/renewals/${id}/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reminder_date: reminderDate.toISOString(),
          message: 'Renewal follow-up reminder',
        }),
      });
      if (res.ok) {
        alert('Reminder scheduled!');
        await fetchDetail();
      }
    } catch (err) {
      console.error('Reminder failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Upcoming':    { icon: <Clock size={14} />, className: 'rd-badge-upcoming' },
      'In Progress': { icon: <RefreshCw size={14} />, className: 'rd-badge-progress' },
      'Renewed':     { icon: <CheckCircle size={14} />, className: 'rd-badge-renewed' },
      'Expired':     { icon: <XCircle size={14} />, className: 'rd-badge-expired' },
      'Cancelled':   { icon: <XCircle size={14} />, className: 'rd-badge-cancelled' },
    };
    const c = config[status] || { icon: null, className: '' };
    return (
      <span className={`rd-status-badge ${c.className}`}>
        {c.icon} {status}
      </span>
    );
  };

  const getApprovalStepIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={18} className="rd-step-icon approved" />;
      case 'Rejected': return <XCircle size={18} className="rd-step-icon rejected" />;
      default: return <Clock size={18} className="rd-step-icon pending" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatValue = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="rd-loading">
        <div className="rnw-spinner"></div>
        <p>Loading renewal details...</p>
      </div>
    );
  }

  if (!renewal) {
    return (
      <div className="rd-not-found">
        <h2>Renewal not found</h2>
        <Button variant="outline" onClick={() => navigate('/renewals')}>← Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="renewal-detail fade-in">
      {/* Back Link */}
      <div className="rd-back-link" onClick={() => navigate('/renewals')}>
        <ArrowLeft size={18} />
        <span>Back to Renewal Dashboard</span>
      </div>

      {/* Header */}
      <div className="rd-header">
        <div className="rd-header-left">
          <h1 className="rd-title">{renewal.contract_name}</h1>
          <div className="rd-header-meta">
            <span className="rd-contract-id">{renewal.contract_id_ref}</span>
            {getStatusBadge(renewal.status)}
          </div>
        </div>
        <div className="rd-header-actions">
          <Button
            variant="outline"
            icon={Bell}
            onClick={handleSendReminder}
            disabled={actionLoading === 'reminder'}
          >
            Schedule Reminder
          </Button>
          {renewal.status === 'Upcoming' && (
            <Button
              variant="primary"
              icon={PlayCircle}
              onClick={() => handleStatusChange('In Progress')}
              disabled={actionLoading === 'status'}
            >
              Start Renewal
            </Button>
          )}
        </div>
      </div>

      <div className="rd-content-grid">
        {/* Contract Info Panel */}
        <div className="rd-panel rd-info-panel">
          <h2 className="rd-panel-title">
            <FileText size={18} /> Contract Information
          </h2>
          <div className="rd-info-grid">
            <div className="rd-info-item">
              <span className="rd-info-label"><Building2 size={14} /> Vendor</span>
              <span className="rd-info-value">{renewal.vendor}</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><Tag size={14} /> Category</span>
              <span className="rd-info-value">{renewal.category}</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><User size={14} /> Owner</span>
              <span className="rd-info-value">{renewal.owner}</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><DollarSign size={14} /> Contract Value</span>
              <span className="rd-info-value">{formatValue(renewal.value)}</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><Calendar size={14} /> Expiry Date</span>
              <span className="rd-info-value">{formatDate(renewal.expiry_date)}</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><Clock size={14} /> Days Until Expiry</span>
              <span className={`rd-info-value ${renewal.days_until_expiry <= 30 ? 'rd-text-danger' : renewal.days_until_expiry <= 90 ? 'rd-text-warning' : 'rd-text-success'}`}>
                {renewal.days_until_expiry < 0 ? 'Expired' : `${renewal.days_until_expiry} days`}
              </span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><Shield size={14} /> Notice Period</span>
              <span className="rd-info-value">{renewal.notice_period_days} days</span>
            </div>
            <div className="rd-info-item">
              <span className="rd-info-label"><RefreshCw size={14} /> Auto-Renew</span>
              <span className="rd-info-value">{renewal.auto_renew ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Approval Workflow Panel */}
        <div className="rd-panel rd-approval-panel">
          <h2 className="rd-panel-title">
            <Shield size={18} /> Approval Workflow
          </h2>
          {renewal.approvals && renewal.approvals.length > 0 ? (
            <div className="rd-approval-steps">
              {renewal.approvals.map((step, index) => (
                <div key={step.approval_id} className={`rd-approval-step ${step.status.toLowerCase()}`}>
                  <div className="rd-step-left">
                    {getApprovalStepIcon(step.status)}
                    <div className="rd-step-info">
                      <span className="rd-step-name">{step.step_name}</span>
                      <span className="rd-step-approver">{step.approver}</span>
                      {step.comments && <span className="rd-step-comment">{step.comments}</span>}
                      {step.acted_at && (
                        <span className="rd-step-date">{formatDateTime(step.acted_at)}</span>
                      )}
                    </div>
                  </div>
                  <div className="rd-step-right">
                    {step.status === 'Pending' ? (
                      <div className="rd-step-actions">
                        <button
                          className="rd-approve-btn"
                          onClick={() => handleApprovalAction(step.step_name, 'Approved')}
                          disabled={actionLoading === step.step_name}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          className="rd-reject-btn"
                          onClick={() => handleApprovalAction(step.step_name, 'Rejected')}
                          disabled={actionLoading === step.step_name}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`rd-step-status-badge ${step.status.toLowerCase()}`}>
                        {step.status}
                      </span>
                    )}
                  </div>
                  {index < renewal.approvals.length - 1 && <div className="rd-step-connector"></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="rd-empty-approvals">
              <Clock size={32} />
              <p>No approval steps yet. Start the renewal to initiate the approval workflow.</p>
            </div>
          )}
        </div>
      </div>

      {/* Renewal History Timeline */}
      <div className="rd-panel rd-history-panel">
        <h2 className="rd-panel-title">
          <Clock size={18} /> Renewal History
        </h2>
        {renewal.history && renewal.history.length > 0 ? (
          <div className="rd-timeline">
            {renewal.history.map((event) => (
              <div key={event.history_id} className="rd-timeline-item">
                <div className="rd-timeline-dot"></div>
                <div className="rd-timeline-content">
                  <div className="rd-timeline-action">{event.action}</div>
                  <div className="rd-timeline-meta">
                    <span className="rd-timeline-by">{event.performed_by}</span>
                    <span className="rd-timeline-date">{formatDateTime(event.created_at)}</span>
                  </div>
                  {event.details && <div className="rd-timeline-details">{event.details}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rd-empty-history">
            <p>No history entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalDetail;
