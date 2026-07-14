import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Download, 
  Filter, 
  Shield,
  User,
  Settings,
  FileText,
  Clock
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import Badge from '../../components/DataDisplay/Badge';
import Modal from '../../components/Modals/Modal';
import './AuditLogs.css';

import { getAuditLogs } from '../../features/auditLogs/services/getAuditLogs';

const getModuleIcon = (module) => {
  switch (module) {
    case 'Authentication': return <Shield size={16} />;
    case 'Users': return <User size={16} />;
    case 'Settings': return <Settings size={16} />;
    case 'Contracts': return <FileText size={16} />;
    case 'System': return <Activity size={16} />;
    default: return <FileText size={16} />;
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Success': return 'success';
    case 'Warning': return 'warning';
    case 'Error': return 'danger';
    default: return 'primary';
  }
};

const formatDate = (isoString) => {
  if (!isoString) return 'Unknown Date';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(date);
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs();
      const mappedLogs = data.map(log => ({
        id: `AL-${log.audit_id || log.id || Math.floor(Math.random()*1000)}`,
        timestamp: log.created_at || log.timestamp || new Date().toISOString(),
        user: log.user_name || log.user || 'System',
        avatar: (log.user_name || log.user || 'SY').substring(0,2).toUpperCase(),
        action: log.action || 'Unknown Action',
        module: log.module || 'System',
        ipAddress: log.ip_address || log.ipAddress || '127.0.0.1',
        status: log.status || 'Success',
        details: {
          resource: log.resource || 'N/A',
          description: log.description || 'No description provided.'
        }
      }));
      setLogs(mappedLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(log.id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'All' || log.module === filterModule;
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  const handleExport = () => {
    alert("Exporting audit logs to CSV...");
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="audit-logs-header mb-2">
        <div>
          <h1 className="text-2xl font-bold">System Audit Logs</h1>
          <p className="text-muted mt-1">Review system events, user actions, and security alerts.</p>
        </div>
        <div className="header-actions">
          <Button variant="outline" icon={Download} onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="audit-filters-bar mb-2 stagger-1">
        <div className="audit-search">
          <FormInput 
            type="text" 
            placeholder="Search by ID, User, or Action..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        
        <div className="audit-filter-group">
          <Filter size={18} className="text-muted" />
          <FormSelect 
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            options={[
              { value: 'All', label: 'All Modules' },
              { value: 'Authentication', label: 'Authentication' },
              { value: 'Users', label: 'Users' },
              { value: 'Contracts', label: 'Contracts' },
              { value: 'Settings', label: 'Settings' },
              { value: 'System', label: 'System' }
            ]}
            style={{ marginBottom: 0, minWidth: '150px' }}
          />
          <FormSelect 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Success', label: 'Success' },
              { value: 'Warning', label: 'Warning' },
              { value: 'Error', label: 'Error' }
            ]}
            style={{ marginBottom: 0, minWidth: '140px' }}
          />
        </div>
      </div>

      <div className="audit-table-wrapper stagger-2">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="audit-empty-state">
                    <p>No audit logs match your search filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} onClick={() => setSelectedLog(log)}>
                  <td className="font-semibold text-muted">{log.id}</td>
                  <td className="text-sm">{formatDate(log.timestamp)}</td>
                  <td>
                    <div className="audit-user-cell">
                      <div className="audit-avatar">{log.avatar}</div>
                      <span className="font-semibold">{log.user}</span>
                    </div>
                  </td>
                  <td className="audit-action-cell" title={log.action}>{log.action}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)' }}>
                      {getModuleIcon(log.module)} {log.module}
                    </div>
                  </td>
                  <td className="text-sm text-muted">{log.ipAddress}</td>
                  <td>
                    <Badge variant={getStatusVariant(log.status)}>{log.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Log Details: ${selectedLog.id}`}
          footer={
            <Button type="button" variant="primary" onClick={() => setSelectedLog(null)}>Close</Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--color-text-dark)' }}>{selectedLog.action}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {formatDate(selectedLog.timestamp)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{getModuleIcon(selectedLog.module)} {selectedLog.module}</span>
                </div>
              </div>
              <Badge variant={getStatusVariant(selectedLog.status)}>{selectedLog.status}</Badge>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Actor</p>
                <div className="audit-user-cell">
                  <div className="audit-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>{selectedLog.avatar}</div>
                  <span className="font-semibold">{selectedLog.user}</span>
                </div>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>IP Address</p>
                <p className="font-semibold">{selectedLog.ipAddress}</p>
              </div>
            </div>

            <div>
              <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Technical Details</p>
              <div className="audit-details-code">
                {JSON.stringify(selectedLog.details, null, 2)}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuditLogs;
