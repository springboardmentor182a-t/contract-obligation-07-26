import React, { useState, useEffect } from 'react';
import { getReportsAnalytics, getChartData, getSavedReports, generateReport } from '../../features/reports/services/getReportsAnalytics';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  PieChart as PieChartIcon, 
  TrendingUp,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import Button from '../../components/Buttons/Button';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Reports = () => {
  const [reportType, setReportType] = useState('contract');
  const BASE_URL = "http://127.0.0.1:8000/api";
  
  const reportTypes = [
    { id: 'contract', label: 'Contract Reports' },
    { id: 'compliance', label: 'Compliance Reports' },
    { id: 'renewal', label: 'Renewal Reports' },
    { id: 'obligation', label: 'Obligation Reports' },
    { id: 'audit', label: 'Audit Reports' }
  ];
  const [dateRange, setDateRange] = useState('YTD');

  const [analyticsData, setAnalyticsData] = useState({});
  const [barChartData, setBarChartData] = useState({ labels: [], data: [], title: "" });
  const [pieChartData, setPieChartData] = useState({ labels: [], data: [], title: "" });
  const [savedReports, setSavedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate Report Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportForm, setReportForm] = useState({
    days: 30,
    report_name: '',
    type: 'Contract',
    format: 'PDF',
    message: ''
  });

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      await generateReport(reportForm);
      setIsGenerateModalOpen(false);
      // Refresh saved reports
      const reports = await getSavedReports();
      setSavedReports(reports);
      alert("Report generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/reports/download-report/${filename}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download:", error);
      alert("Failed to download file");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const daysMap = { '7D': 7, '30D': 30, '90D': 90, 'YTD': 365 };
        const days = daysMap[dateRange] || 365;

        const [analytics, chartApiData, reports] = await Promise.all([
          getReportsAnalytics(reportType, days),
          getChartData(reportType),
          getSavedReports()
        ]);
        
        if (analytics) {
          setAnalyticsData(analytics);
        }
        
        let newBar = { labels: [], data: [], title: "" };
        let newPie = { labels: [], data: [], title: "" };

        if (analytics && Array.isArray(chartApiData)) {
          if (reportType === 'contract') {
             newBar.title = "Quarterly Contract Value (INR M)";
             newBar.labels = chartApiData.map(i => {
                const y = i.year !== undefined ? i.year : i[0];
                const q = i.quarter !== undefined ? i.quarter : i[1];
                return `Q${q} '${String(y || '').slice(-2)}'`;
             });
             newBar.data = chartApiData.map(i => {
                const t = i.total !== undefined ? i.total : i[2];
                return Number(((t || 0) / 1000000).toFixed(2));
             });
             
             newPie.title = "Contract Status Distribution";
             newPie.labels = ['Active', 'Renewal Due', 'Expired'];
             newPie.data = [analytics.active_contracts || 0, analytics.upcoming_renewals || 0, analytics.expired_contracts || 0];
          } else if (reportType === 'renewal') {
             newBar.title = "Monthly Renewals";
             const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
             newBar.labels = chartApiData.map(i => {
                const y = i.year !== undefined ? i.year : i[0];
                const m = i.month !== undefined ? i.month : i[1];
                return `${monthNames[(m || 1) - 1]} '${String(y || '').slice(-2)}'`;
             });
             newBar.data = chartApiData.map(i => {
                const c = i.count !== undefined ? i.count : i[2];
                return c || 0;
             });

             newPie.title = "Renewal Status";
             newPie.labels = ['Completed', 'Pending', 'Failed'];
             newPie.data = [analytics.completed || 0, analytics.pending || 0, analytics.failed || 0];
          } else if (reportType === 'compliance') {
             newBar.title = "Compliance by Risk Level";
             newBar.labels = ['High Risk', 'Medium Risk', 'Low Risk'];
             newBar.data = [analytics.high_risk || 0, analytics.medium_risk || 0, analytics.low_risk || 0];

             newPie.title = "Compliance Status";
             newPie.labels = chartApiData.map(i => {
                const s = i.status !== undefined ? i.status : i[0];
                return String(s || 'Unknown').replace('ComplianceStatus.', '').replace('_', ' ');
             });
             newPie.data = chartApiData.map(i => {
                const c = i.count !== undefined ? i.count : i[1];
                return c || 0;
             });
          } else if (reportType === 'obligation') {
             newBar.title = "Obligations by Priority";
             newBar.labels = ['High Priority', 'Medium Priority', 'Low Priority'];
             newBar.data = [analytics.high_priority || 0, analytics.medium_priority || 0, analytics.low_priority || 0];

             newPie.title = "Obligation Status";
             newPie.labels = ['Completed', 'Pending', 'Overdue'];
             newPie.data = [analytics.completed || 0, analytics.pending || 0, analytics.overdue || 0];
          } else if (reportType === 'audit') {
             newBar.title = "Audit Actions Status";
             newBar.labels = ['Successful', 'Failed'];
             newBar.data = [analytics.successful_actions || 0, analytics.failed_actions || 0];

             newPie.title = "Audit Actions Breakdown";
             newPie.labels = chartApiData.map(i => {
                const a = i.action !== undefined ? i.action : i[0];
                return String(a || 'Unknown');
             });
             newPie.data = chartApiData.map(i => {
                const c = i.count !== undefined ? i.count : i[1];
                return c || 0;
             });
          }
        }
        
        setBarChartData(newBar);
        setPieChartData(newPie);

        if (reports && Array.isArray(reports)) {
          setSavedReports(reports);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reportType, dateRange]);

  const getCardsConfig = () => {
    switch (reportType) {
      case 'compliance':
        return [
          { title: "Total Compliances", value: analyticsData.total_compliances || 0, subtitle: "Overall checked", icon: FileText, color: "blue" },
          { title: "Compliance %", value: `${analyticsData.compliance_percentage || 0}%`, subtitle: "Overall score", icon: TrendingUp, color: "green" },
          { title: "High Risk", value: analyticsData.high_risk || 0, subtitle: "Action required", icon: AlertTriangle, color: "orange" },
          { title: "Avg Health Score", value: analyticsData.average_health_score || 0, subtitle: "Out of 100", icon: CheckCircle, color: "purple" }
        ];
      case 'renewal':
        return [
          { title: "Total Renewals", value: analyticsData.total_renewals || 0, subtitle: "In period", icon: FileText, color: "blue" },
          { title: "Completion %", value: `${analyticsData.completion_percentage || 0}%`, subtitle: "Success rate", icon: TrendingUp, color: "green" },
          { title: "Upcoming Expiry", value: analyticsData.upcoming_expiry || 0, subtitle: "Next 30 days", icon: AlertTriangle, color: "orange" },
          { title: "Avg Extension Days", value: analyticsData.average_extension_days || 0, subtitle: "Per renewal", icon: Clock, color: "purple" }
        ];
      case 'obligation':
        return [
          { title: "Total Obligations", value: analyticsData.total_obligations || 0, subtitle: "Tracked", icon: FileText, color: "blue" },
          { title: "Completion Rate", value: `${analyticsData.completion_rate || 0}%`, subtitle: "Success", icon: TrendingUp, color: "green" },
          { title: "Overdue", value: analyticsData.overdue || 0, subtitle: "Past due date", icon: AlertTriangle, color: "orange" },
          { title: "Avg Completion Days", value: analyticsData.average_completion_days || 0, subtitle: "Time to complete", icon: Clock, color: "purple" }
        ];
      case 'audit':
        return [
          { title: "Total Logs", value: analyticsData.total_logs || 0, subtitle: "System actions", icon: FileText, color: "blue" },
          { title: "Success Rate", value: `${analyticsData.success_rate || 0}%`, subtitle: "Successful actions", icon: TrendingUp, color: "green" },
          { title: "Unique Users", value: analyticsData.unique_users || 0, subtitle: "Active accounts", icon: CheckCircle, color: "orange" },
          { title: "Unique Modules", value: analyticsData.unique_modules || 0, subtitle: "Accessed areas", icon: FileText, color: "purple" }
        ];
      case 'contract':
      default:
        return [
          { title: "Total Contract Value", value: `₹${analyticsData.total_contract_value?.toLocaleString() || 0}`, subtitle: "Active portfolio value", icon: FileText, color: "blue" },
          { title: "Active Contracts", value: analyticsData.active_contracts || 0, subtitle: "Currently active", icon: CheckCircle, color: "green" },
          { title: "Upcoming Renewals", value: analyticsData.upcoming_renewals || 0, subtitle: "Requires action", icon: AlertTriangle, color: "orange" },
          { title: "Obligation Compliance", value: `${analyticsData.obligation_compliance || 0}%`, subtitle: "Overall score", icon: TrendingUp, color: "purple" }
        ];
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0';
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  // Main Bar Chart dynamic config
  const mainBarData = {
    labels: barChartData.labels,
    datasets: [
      {
        label: 'Total',
        data: barChartData.data,
        backgroundColor: '#86b4d3',
        borderRadius: 4,
        barThickness: 32
      }
    ]
  };

  const mainBarOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'inherit', color: '#9ca3af' } } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'inherit', color: '#9ca3af' } } },
      y: { 
        grid: { color: 'rgba(0, 0, 0, 0.05)', borderDash: [5, 5] }, 
        ticks: { 
          font: { family: 'inherit', color: '#9ca3af' },
          callback: (value) => reportType === 'contract' ? `₹${value}M` : value
        },
        beginAtZero: true
      }
    }
  };

  // Pie chart config (Doughnut)
  // Give dynamic colors to labels, defaulting if many
  const pieColors = ['#5b8fb9', '#f3a436', '#e65151', '#98c1d9', '#6b7280', '#10b981', '#8b5cf6'];
  const mainPieData = {
    labels: pieChartData.labels,
    datasets: [
      {
        data: pieChartData.data,
        backgroundColor: pieChartData.labels.map((_, i) => pieColors[i % pieColors.length]),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }
    ]
  };

  const statusDoughnutOptions = {
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false } 
    }
  };




  return (
    <div className="reports-dashboard fade-in">
      {/* Header Section */}
      <div className="rep-header-section">
        <div className="rep-header-content">
          <h1 className="rep-title">Report & Analytics</h1>
          <p className="rep-subtitle">Comprehensive insights across your entire contract portfolio.</p>
        </div>
        <div className="rep-header-actions">
          <div className="rep-time-filters">
            {['7D', '30D', '90D', 'YTD'].map(range => (
              <button
                key={range}
                className={`rep-time-btn ${dateRange === range ? 'active' : ''}`}
                onClick={() => setDateRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" icon={Download} onClick={() => alert('Downloading PDF report...')}>PDF</Button>
          <Button variant="outline" icon={Download} onClick={() => alert('Downloading CSV report...')}>CSV</Button>
          <Button variant="primary" icon={Plus} onClick={() => setIsGenerateModalOpen(true)}>Generate Report</Button>
        </div>
      </div>

      {/* Report Type Filters */}
      <div className="rep-type-filters-container animate-fade-in">
        <div className="rep-type-filters">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              className={`rep-type-btn ${reportType === type.id ? 'active' : ''}`}
              onClick={() => setReportType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Analytics Cards */}
      <div className="rep-analytics-grid">
        {getCardsConfig().map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div className={`rep-card ${card.color} fade-in`} style={{ animationDelay: `${index * 0.1}s` }} key={index}>
              <div className="rep-card-top">
                <div className="rep-card-icon"><IconComponent size={24} /></div>
              </div>
              <div className="rep-card-data">
                <h3>{card.title}</h3>
                <div className="rep-val">{card.value}</div>
                <p>{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <div className="rep-charts-grid">
        <div className="rep-chart-card animate-slide-up">
          <div className="rep-chart-header">
            <div className="rep-chart-title">
              <h3>{barChartData.title}</h3>
            </div>
          </div>
          <div className="rep-chart-canvas">
            <Bar data={mainBarData} options={mainBarOptions} />
          </div>
        </div>

        <div className="rep-chart-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="rep-chart-header">
            <div className="rep-chart-title">
              <h3>{pieChartData.title}</h3>
            </div>
          </div>
          <div className="rep-chart-canvas status-doughnut-container">
            <div className="status-doughnut">
              <Doughnut data={mainPieData} options={statusDoughnutOptions} />
            </div>
            <div className="status-legend">
              {pieChartData.labels.map((label, i) => (
                <div className="status-legend-item" key={label}>
                  <span className="status-dot" style={{ background: pieColors[i % pieColors.length] }}></span>
                  <div><strong>{pieChartData.data[i]}</strong><span>{label}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Reports Table */}
      <div className="rep-chart-card animate-slide-up" style={{ animationDelay: '0.2s', padding: 0 }}>
        <div className="rep-reports-header">
          <h3>Saved Reports</h3>
          <span className="rep-reports-count">{savedReports.length} reports</span>
        </div>
        <div className="rep-reports-table-wrapper">
          <table className="rep-reports-table">
            <thead>
              <tr>
                <th>REPORT NAME</th>
                <th>TYPE</th>
                <th>GENERATED BY</th>
                <th>DATE</th>
                <th>FORMAT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {savedReports.map((report, idx) => (
                <tr key={idx}>
                  <td className="report-name">{report.report_name}</td>
                  <td className="report-type">{report.report_type}</td>
                  <td className="report-author">
                    <span className="author-avatar">{report.generated_by?.[0]?.toUpperCase() || 'U'}</span>
                    {report.generated_by}
                  </td>
                  <td className="report-date">{new Date(report.create_at).toLocaleDateString()}</td>
                  <td className="report-format">
                    <span className={`format-badge ${report.format === 'PDF' ? 'blue' : 'green'}`}>{report.format}</span>
                  </td>
                  <td className="report-actions">
                    <button className="action-btn" onClick={() => handleDownload(report.file_path)} title="Download Report">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {isGenerateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content generate-report-modal fade-in">
            <div className="modal-header">
              <h2>Generate New Report</h2>
              <button className="close-btn" onClick={() => setIsGenerateModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleGenerateReport}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Report Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={reportForm.report_name}
                    onChange={(e) => setReportForm({...reportForm, report_name: e.target.value})}
                    placeholder="E.g., Q3 Compliance Overview"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Report Type</label>
                    <select
                      className="form-input"
                      value={reportForm.type}
                      onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                    >
                      <option value="Contract">Contract</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Renewal">Renewal</option>
                      <option value="Obligations">Obligations</option>
                      <option value="Audit">Audit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Time Period (Days)</label>
                    <select
                      className="form-input"
                      value={reportForm.days}
                      onChange={(e) => setReportForm({...reportForm, days: parseInt(e.target.value)})}
                    >
                      <option value={7}>Last 7 Days</option>
                      <option value={30}>Last 30 Days</option>
                      <option value={90}>Last 90 Days</option>
                      <option value={365}>Last 365 Days</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Format</label>
                  <select
                    className="form-input"
                    value={reportForm.format}
                    onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="CSV">CSV Data File</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Custom Message (Optional)</label>
                  <textarea
                    className="form-input"
                    value={reportForm.message}
                    onChange={(e) => setReportForm({...reportForm, message: e.target.value})}
                    placeholder="Add any notes or context to the report header..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="outline" onClick={(e) => { e.preventDefault(); setIsGenerateModalOpen(false); }}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
