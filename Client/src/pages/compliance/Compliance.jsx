import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Search, AlertOctagon, 
  Activity, ChevronRight, CheckCircle, Clock, 
  FileText, ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import Badge from '../../components/DataDisplay/Badge';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { API_URL } from '../../data/constants';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modals/Modal';
import '../contracts/Contracts.css';
import './Compliance.css'; 

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Compliance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  // Dynamic userRole state for RBAC checks
  const { role } = useAuth();
  const currentRole = role || 'Legal Manager';

  // API State Variables
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState(null);
  const [complianceItems, setComplianceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initiate Audit Modal State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    requirement: '',
    category: 'Data Privacy',
    entity: '',
    contractId: '',
    status: 'Under Review',
    risk: 'Medium',
    score: 70,
    lastAudit: new Date().toISOString().split('T')[0]
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Compliance Details Modal State (from remote branch)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Check if role has access to Compliance Dashboard (Legal Manager and Compliance Officer only)
  const isAuthorized = currentRole === 'Legal Manager' || currentRole === 'Compliance Officer';

  // Reusable refresh function
  const refreshDashboardData = async () => {
    if (!isAuthorized) return;
    try {
      const [summaryRes, trendRes, riskRes] = await Promise.all([
        fetch(`${API_URL}/compliance/summary`, { headers: { 'X-User-Role': currentRole } }),
        fetch(`${API_URL}/compliance/trend`, { headers: { 'X-User-Role': currentRole } }),
        fetch(`${API_URL}/compliance/risk-distribution`, { headers: { 'X-User-Role': currentRole } })
      ]);

      if (summaryRes.ok && trendRes.ok && riskRes.ok) {
        setSummary(await summaryRes.json());
        setTrend(await trendRes.json());
        setRiskDistribution(await riskRes.json());
      }

      let url = `${API_URL}/compliance/contracts?limit=100`;
      
      if (activeTab === 'High Risk') {
        url += '&risk=High';
      } else if (activeTab === 'Pending Review') {
        url += '&status=Under%20Review';
      }
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const tableRes = await fetch(url, { headers: { 'X-User-Role': currentRole } });
      if (tableRes.ok) {
        const data = await tableRes.json();
        setComplianceItems(data.records || []);
      }
    } catch (err) {
      console.error("Failed to refresh dashboard data:", err);
    }
  };

  // Fetch overall dashboard analytics on load
  useEffect(() => {
    if (!isAuthorized) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [summaryRes, trendRes, riskRes] = await Promise.all([
          fetch(`${API_URL}/compliance/summary`, { headers: { 'X-User-Role': currentRole } }),
          fetch(`${API_URL}/compliance/trend`, { headers: { 'X-User-Role': currentRole } }),
          fetch(`${API_URL}/compliance/risk-distribution`, { headers: { 'X-User-Role': currentRole } })
        ]);

        if (!summaryRes.ok || !trendRes.ok || !riskRes.ok) {
          if (summaryRes.status === 403) {
            throw new Error("Access Denied: You do not have permission to view compliance analytics.");
          }
          throw new Error("Failed to load dashboard analytics data");
        }

        const summaryData = await summaryRes.json();
        const trendData = await trendRes.json();
        const riskData = await riskRes.json();

        setSummary(summaryData);
        setTrend(trendData);
        setRiskDistribution(riskData);
      } catch (err) {
        console.error("Failed to load compliance analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentRole, isAuthorized]);

  // Fetch table records based on tab, search query, and active role updates
  useEffect(() => {
    if (!isAuthorized) return;
    const fetchTableData = async () => {
      try {
        let url = `${API_URL}/compliance/contracts?limit=100`;
        
        if (activeTab === 'High Risk') {
          url += '&risk=High';
        } else if (activeTab === 'Pending Review') {
          url += '&status=Under%20Review';
        }
        
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url, { headers: { 'X-User-Role': currentRole } });
        if (!res.ok) {
          throw new Error("Failed to fetch compliance table records");
        }
        const data = await res.json();
        setComplianceItems(data.records || []);
      } catch (err) {
        console.error("Error fetching filtered table data:", err);
      }
    };

    fetchTableData();
  }, [activeTab, searchTerm, currentRole, isAuthorized]);

  // Export report CSV download click handler (using Blob to attach X-User-Role header)
  const handleExportReport = async () => {
    try {
      const res = await fetch(`${API_URL}/compliance/export`, {
        headers: {
          'X-User-Role': currentRole
        }
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access Denied: You do not have permission to export compliance data.");
        }
        throw new Error("Failed to export compliance report");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compliance_report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  // Audit form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/compliance/records`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': currentRole
        },
        body: JSON.stringify({
          ...formData,
          score: parseInt(formData.score)
        })
      });

      if (!res.ok) {
        throw new Error("Failed to register new compliance record");
      }

      // Reset form and close modal
      setFormData({
        requirement: '',
        category: 'Data Privacy',
        entity: '',
        contractId: '',
        status: 'Under Review',
        risk: 'Medium',
        score: 70,
        lastAudit: new Date().toISOString().split('T')[0]
      });
      setIsAuditModalOpen(false);

      // Refresh dashboard analytics and tables
      await refreshDashboardData();
    } catch (err) {
      alert("Error initiating compliance audit: " + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Compliant': return <span className="status-pill status-success"><CheckCircle size={14} /> {status}</span>;
      case 'Non-Compliant': return <span className="status-pill status-danger"><AlertOctagon size={14} /> {status}</span>;
      case 'Warning': return <span className="status-pill status-warning"><ShieldAlert size={14} /> {status}</span>;
      case 'Under Review': return <span className="status-pill status-primary"><Clock size={14} /> {status}</span>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getRiskLevel = (risk) => {
    const riskClass = `risk-level risk-${risk.toLowerCase()}`;
    return (
      <div className={riskClass}>
        <div className="risk-bar-bg">
          <div className="risk-bar-fill"></div>
        </div>
        <span>{risk}</span>
      </div>
    );
  };

  // Chart configs
  const lineChartData = {
    labels: trend.length > 0 ? trend.map(t => t.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Compliance Score Trend (%)',
        data: trend.length > 0 ? trend.map(t => t.compliance_score) : [78, 82, 85, 84, 89, 94],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'inherit' } } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.05)', borderDash: [5, 5] }, min: 0, max: 100, ticks: { font: { family: 'inherit' } } }
    }
  };

  const doughnutData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: riskDistribution 
          ? [riskDistribution.high, riskDistribution.medium, riskDistribution.low] 
          : [2, 2, 1],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: 'inherit', size: 13 } } }
    }
  };

  // If not authorized, display Access Denied screen instead
  if (!isAuthorized) {
    return (
      <div className="compliance-dashboard fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-flex' }}>
          <AlertOctagon size={48} />
        </div>
        <h1 className="comp-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Access Denied</h1>
        <p className="comp-subtitle" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
          Your active role <strong>({currentRole})</strong> does not have permission to view the Compliance Intelligence dashboard.
        </p>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
          Please use the user profile dropdown in the top navbar to switch to an authorized role like <strong>Legal Manager</strong> or <strong>Compliance Officer</strong>.
        </p>
      </div>
    );
  }

  // Overall metric configurations
  const complianceScoreVal = summary ? summary.compliance_score : 84;
  const compliantContractsCount = summary ? summary.compliant_contracts : 142;
  const compliantContractsTrend = summary ? summary.compliant_contracts_trend : "+12 this month";
  const criticalViolationsCount = summary ? summary.critical_violations : 3;
  const criticalViolationsTrend = summary ? summary.critical_violations_trend : "Needs immediate action";
  const pendingAuditsCount = summary ? summary.pending_audits : 18;
  const pendingAuditsTrend = summary ? summary.pending_audits_trend : "Scheduled for Q4";
  const scoreTrendVal = summary ? summary.trend_value : 2.4;

  const scoreAssessment = complianceScoreVal >= 80 ? 'Healthy' : complianceScoreVal >= 60 ? 'Cautionary' : 'Critical';

  return (
    <div className="compliance-dashboard fade-in">
      {/* Header Section */}
      <div className="comp-header-section">
        <div className="comp-header-content">
          <h1 className="comp-title">Compliance Intelligence</h1>
          <p className="comp-subtitle">Real-time monitoring of contractual and regulatory requirements across all vendors.</p>
        </div>
        <div className="comp-header-actions">
          <Button variant="outline" icon={FileText} onClick={handleExportReport}>Export Report</Button>
          <Button variant="primary" icon={ShieldAlert} onClick={() => setIsAuditModalOpen(true)}>Initiate Audit</Button>
        </div>
      </div>

      {/* Top Analytics Cards */}
      <div className="comp-analytics-grid">
        <div className="comp-card score-card">
          <div className="score-card-header">
            <h3>Overall Compliance</h3>
            <div className={`trend-badge ${scoreTrendVal >= 0 ? 'positive' : 'negative'}`}>
              {scoreTrendVal >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
              {Math.abs(scoreTrendVal)}%
            </div>
          </div>
          <div className="score-content">
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-path" strokeDasharray={`${complianceScoreVal}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.5" className="percentage">{complianceScoreVal}%</text>
              </svg>
            </div>
            <div className="score-details">
              <p>Your organization is currently operating at a <strong>{scoreAssessment}</strong> compliance level.</p>
            </div>
          </div>
        </div>

        <div className="comp-card stat-card gradient-blue">
          <div className="stat-icon-wrapper"><ShieldCheck size={28} /></div>
          <div className="stat-info">
            <span className="stat-label">Compliant Contracts</span>
            <h2 className="stat-value">{compliantContractsCount}</h2>
            <span className="stat-trend">{compliantContractsTrend}</span>
          </div>
        </div>

        <div className="comp-card stat-card gradient-red">
          <div className="stat-icon-wrapper"><AlertOctagon size={28} /></div>
          <div className="stat-info">
            <span className="stat-label">Critical Violations</span>
            <h2 className="stat-value">{criticalViolationsCount}</h2>
            <span className="stat-trend negative">{criticalViolationsTrend}</span>
          </div>
        </div>

        <div className="comp-card stat-card gradient-purple">
          <div className="stat-icon-wrapper"><Activity size={28} /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Audits</span>
            <h2 className="stat-value">{pendingAuditsCount}</h2>
            <span className="stat-trend">{pendingAuditsTrend}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="comp-charts-section animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="comp-chart-card">
          <div className="comp-chart-header">
            <h3>Compliance Score Trend</h3>
            <p className="text-muted" style={{fontSize: '0.85rem', marginTop: '0.2rem'}}>6-month organizational average</p>
          </div>
          <div className="comp-chart-container" style={{ height: '280px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="comp-chart-card">
          <div className="comp-chart-header">
            <h3>Risk Distribution</h3>
            <p className="text-muted" style={{fontSize: '0.85rem', marginTop: '0.2rem'}}>Based on current compliance items</p>
          </div>
          <div className="comp-chart-container" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="comp-main-area">
        <div className="comp-tabs">
          {['Overview', 'High Risk', 'Pending Review', 'Audit Log'].map(tab => (
            <button 
              key={tab} 
              className={`comp-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="comp-table-card">
          <div className="comp-table-toolbar">
            <div className="comp-search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search compliance requirements or entities..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <Button variant="outline" icon={Filter}>Filters</Button>
          </div>

          <div className="comp-table-container">
            <table className="comp-data-table">
              <thead>
                <tr>
                  <th>Requirement & Category</th>
                  <th>Entity & Contract</th>
                  <th>Risk Profile</th>
                  <th>Health Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {complianceItems.map((item, index) => (
                  <tr key={item.id} className="comp-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td>
                      <div className="req-title">{item.requirement}</div>
                      <div className="req-category">{item.category} • {item.id}</div>
                    </td>
                    <td>
                      <div className="entity-name">{item.entity}</div>
                      <div className="req-category">ID: {item.contractId}</div>
                    </td>
                    <td>
                      {getRiskLevel(item.risk)}
                    </td>
                    <td>
                      <div className="health-score-cell">
                        <span className={`score-text ${item.score < 50 ? 'text-danger' : item.score < 80 ? 'text-warning' : 'text-success'}`}>{item.score}/100</span>
                        <div className="mini-progress-bg">
                          <div className={`mini-progress-fill ${item.score < 50 ? 'bg-danger' : item.score < 80 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${item.score}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="action-cell">
                      <button className="comp-action-btn" onClick={() => { setSelectedItem(item); setIsDetailsModalOpen(true); }}><ChevronRight size={20} /></button>
                    </td>
                  </tr>
                ))}
                {complianceItems.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No matching compliance requirements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Initiate Audit Modal Overlay */}
      {isAuditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuditModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Initiate New Compliance Audit</h2>
              <button className="modal-close-btn" onClick={() => setIsAuditModalOpen(false)}>
                &times;
              </button>
            </div>
            <form className="modal-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="requirement">Compliance Requirement</label>
                <input 
                  type="text" 
                  id="requirement" 
                  required
                  placeholder="e.g. SOC 2 Type II Auditing"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Data Privacy">Data Privacy</option>
                    <option value="Security">Security</option>
                    <option value="HR Policy">HR Policy</option>
                    <option value="Legal">Legal</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="entity">Legal Entity / Vendor</label>
                  <input 
                    type="text" 
                    id="entity" 
                    required
                    placeholder="e.g. AWS Cloud Services"
                    value={formData.entity}
                    onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contractId">Contract ID Reference</label>
                  <input 
                    type="text" 
                    id="contractId" 
                    required
                    placeholder="e.g. 1"
                    value={formData.contractId}
                    onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastAudit">Last Audit Date</label>
                  <input 
                    type="date" 
                    id="lastAudit" 
                    required
                    value={formData.lastAudit}
                    onChange={(e) => setFormData({ ...formData, lastAudit: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Compliance Status</label>
                  <select 
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Compliant">Compliant</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                    <option value="Warning">Warning</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="risk">Risk Profile</label>
                  <select 
                    id="risk"
                    value={formData.risk}
                    onChange={(e) => setFormData({ ...formData, risk: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="score">Health Score Index (0 - 100)</label>
                <input 
                  type="number" 
                  id="score" 
                  required
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <Button type="button" variant="outline" onClick={() => setIsAuditModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Initiating...' : 'Submit Audit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compliance Details Modal (from remote branch) */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Compliance Details"
        footer={
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
            <Button 
              variant="primary" 
              onClick={() => {
                alert(`Action initiated for requirement: ${selectedItem?.requirement}`);
                setIsDetailsModalOpen(false);
              }}
            >
              Initiate Action
            </Button>
          </div>
        }
      >
        {selectedItem && (
          <div className="compliance-details-modal">
            <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Requirement</p>
                <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>{selectedItem.requirement}</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>ID: {selectedItem.id} • Category: {selectedItem.category}</p>
              </div>
              <div>
                {getStatusBadge(selectedItem.status)}
              </div>
            </div>

            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Entity</p>
                <p style={{ fontWeight: '500' }}>{selectedItem.entity}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Risk Level</p>
                {getRiskLevel(selectedItem.risk)}
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Last Audit</p>
                <p style={{ fontWeight: '500' }}>{selectedItem.lastAudit}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Health Score</p>
                <div className="health-score-cell" style={{ justifyContent: 'flex-start' }}>
                  <span className={`score-text ${selectedItem.score < 50 ? 'text-danger' : selectedItem.score < 80 ? 'text-warning' : 'text-success'}`}>{selectedItem.score}/100</span>
                  <div className="mini-progress-bg" style={{ width: '80px', marginLeft: '0.75rem' }}>
                    <div className={`mini-progress-fill ${selectedItem.score < 50 ? 'bg-danger' : selectedItem.score < 80 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${selectedItem.score}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
               <h4 style={{ marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Audit Notes</h4>
               <p className="text-muted" style={{ lineHeight: '1.5', fontSize: '0.9rem' }}>
                 The current compliance status is based on the latest automated check and manual audit findings.
                 Please review the risk factors associated with this entity. Further documentation might be required to fulfill the <strong>{selectedItem.requirement}</strong> requirements.
               </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Compliance;
