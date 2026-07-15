import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Search, AlertOctagon, 
  Activity, ChevronRight, CheckCircle, Clock, 
  FileText, ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import FormInput from '../../components/Form/FormInput';
import FormSelect from '../../components/Form/FormSelect';
import Button from '../../components/Buttons/Button';
import Badge from '../../components/DataDisplay/Badge';
import Modal from '../../components/Modals/Modal';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import '../contracts/Contracts.css';
import './Compliance.css'; 

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Compliance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const complianceItems = [
    { id: 'CMP-001', requirement: 'GDPR Data Processing', category: 'Data Privacy', entity: 'TechCorp Solutions', status: 'Compliant', risk: 'High', lastAudit: '2023-10-01', score: 98 },
    { id: 'CMP-002', requirement: 'ISO 27001 Certification', category: 'Security', entity: 'Cloud Services LLC', status: 'Non-Compliant', risk: 'High', lastAudit: '2023-09-15', score: 45 },
    { id: 'CMP-003', requirement: 'Annual Background Checks', category: 'HR Policy', entity: 'Staffing Agency', status: 'Under Review', risk: 'Medium', lastAudit: '2023-11-05', score: 72 },
    { id: 'CMP-004', requirement: 'Anti-Bribery Clause', category: 'Legal', entity: 'GlobalTech', status: 'Compliant', risk: 'Low', lastAudit: '2023-01-10', score: 100 },
    { id: 'CMP-005', requirement: 'SLA Uptime >= 99.9%', category: 'Operations', entity: 'HostProvider Inc', status: 'Warning', risk: 'Medium', lastAudit: '2023-11-20', score: 85 },
  ];

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

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Compliance Score Trend (%)',
        data: [78, 82, 85, 84, 89, 94],
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
      y: { grid: { color: 'rgba(0, 0, 0, 0.05)', borderDash: [5, 5] }, min: 50, max: 100, ticks: { font: { family: 'inherit' } } }
    }
  };

  const doughnutData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [2, 2, 1], // Matches dummy data length
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

  return (
    <div className="compliance-dashboard fade-in">
      {/* Header Section */}
      <div className="comp-header-section">
        <div className="comp-header-content">
          <h1 className="comp-title">Compliance Intelligence</h1>
          <p className="comp-subtitle">Real-time monitoring of contractual and regulatory requirements across all vendors.</p>
        </div>
        <div className="comp-header-actions">
          <Button variant="outline" icon={FileText}>Export Report</Button>
          <Button variant="primary" icon={ShieldAlert} onClick={() => alert('Initiating audit across all entities...')}>Initiate Audit</Button>
        </div>
      </div>

      {/* Top Analytics Cards */}
      <div className="comp-analytics-grid">
        <div className="comp-card score-card">
          <div className="score-card-header">
            <h3>Overall Compliance</h3>
            <div className="trend-badge positive"><ArrowUpRight size={14} /> 2.4%</div>
          </div>
          <div className="score-content">
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-path" strokeDasharray="84, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.5" className="percentage">84%</text>
              </svg>
            </div>
            <div className="score-details">
              <p>Your organization is currently operating at a <strong>Healthy</strong> compliance level.</p>
            </div>
          </div>
        </div>

        <div className="comp-card stat-card gradient-blue">
          <div className="stat-icon-wrapper"><ShieldCheck size={28} /></div>
          <div className="stat-info">
            <span className="stat-label">Compliant Contracts</span>
            <h2 className="stat-value">142</h2>
            <span className="stat-trend">+12 this month</span>
          </div>
        </div>

        <div className="comp-card stat-card gradient-red">
          <div className="stat-icon-wrapper"><AlertOctagon size={28} /></div>
          <div className="stat-info">
            <span className="stat-label">Critical Violations</span>
            <h2 className="stat-value">3</h2>
            <span className="stat-trend negative">Needs immediate action</span>
          </div>
        </div>

        <div className="comp-card stat-card gradient-purple">
          <div className="stat-icon-wrapper"><Activity size={28} /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Audits</span>
            <h2 className="stat-value">18</h2>
            <span className="stat-trend">Scheduled for Q4</span>
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
              <input type="text" placeholder="Search compliance requirements or entities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                      <button 
                        className="comp-action-btn"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Compliance Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compliance Details"
        footer={
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button 
              variant="primary" 
              onClick={() => {
                alert(`Action initiated for requirement: ${selectedItem?.requirement}`);
                setIsModalOpen(false);
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
