import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import Navbar from '../layout/Navbar';
import { API_BASE_URL } from '../data/constants';
import IssueBreakdownChart from '../components/Charts/IssueBreakdownChart';
import ComplianceScoreChart from '../components/Charts/ComplianceScoreChart';
import NewComplianceModal from '../components/Modals/NewComplianceModal';

const Compliance = () => {
  const [complianceData, setComplianceData] = useState({
    items: [], issueBreakdown: [], upcomingReviews: [],
    kpi: { score: 0, compliant: 0, atRisk: 0, nonCompliant: 0, pending: 0 }
  });
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');

  const fetchComplianceData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compliance`);
      if (response.ok) {
        const data = await response.json();
        setComplianceData(data);
      }
    } catch (error) {
      console.error("Failed to fetch compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this compliance review?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/compliance/${itemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchComplianceData();
      } else {
        alert("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // --- NEW: Generate and download CSV report ---
  const handleExport = () => {
    if (filteredItems.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Item Name", "Description", "Contract Ref", "Obligation", "Status", "Risk Level", "Next Review"];
    
    const rows = filteredItems.map(item => [
      `"${item.itemName}"`,
      `"${item.description}"`,
      `"${item.contractRef}"`,
      `"${item.obligation}"`,
      `"${item.status}"`,
      `"${item.riskLevel}"`,
      `"${item.nextReview}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ContractIQ_Compliance_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = complianceData.items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.contractRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesRisk = riskFilter === 'All Risk Levels' || item.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  if (loading) return <PageContainer><div>Loading compliance data...</div></PageContainer>;

  return (
    <PageContainer>
      <Navbar />
      
      <NewComplianceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaveSuccess={fetchComplianceData} 
      />

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Compliance Tracking</h2>
          <p>Monitor contract compliance and manage risks proactively.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* --- NEW: Attached handleExport to the button --- */}
          <button onClick={handleExport} style={{ padding: '8px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>
            Export Report
          </button>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: '8px 16px', background: '#5f27cd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            + Add Compliance Review
          </button>
        </div>
      </div>

      <div className="kpi-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h4>Overall Score</h4>
          <h2 style={{ color: '#5f27cd', fontSize: '2rem' }}>{complianceData.kpi.score}%</h2>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h4>Compliant</h4>
          <h2 style={{ color: '#2ecc71' }}>{complianceData.kpi.compliant}</h2>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h4>At Risk</h4>
          <h2 style={{ color: '#f39c12' }}>{complianceData.kpi.atRisk}</h2>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h4>Non-Compliant</h4>
          <h2 style={{ color: '#e74c3c' }}>{complianceData.kpi.nonCompliant}</h2>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h4>Pending Review</h4>
          <h2 style={{ color: '#9b59b6' }}>{complianceData.kpi.pending}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '2.5', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card filters" style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Search compliance items..." 
              style={{ padding: '8px', flex: 1 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select style={{ padding: '8px' }} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All Status">All Status</option>
              <option value="Compliant">Compliant</option>
              <option value="At Risk">At Risk</option>
              <option value="Non-Compliant">Non-Compliant</option>
              <option value="Pending Review">Pending Review</option>
            </select>
            <select style={{ padding: '8px' }} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All Risk Levels">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div className="card table-container">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '10px 0' }}>Compliance Item</th>
                  <th>Contract</th>
                  <th>Status</th>
                  <th>Risk Level</th>
                  <th>Next Review</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '15px 0' }}>
                      <strong>{item.itemName}</strong><br/>
                      <span style={{ fontSize: '12px', color: '#888' }}>{item.description}</span>
                    </td>
                    <td>{item.contractRef}</td>
                    <td><span className={`status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></td>
                    <td>{item.riskLevel}</td>
                    <td>{item.nextReview}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '16px' }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No matching records found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h4 style={{ marginBottom: '15px' }}>Compliance Score Trend</h4>
            <ComplianceScoreChart />
          </div>
          
          <div className="card">
            <h4 style={{ marginBottom: '15px' }}>Issue Breakdown</h4>
            {complianceData.issueBreakdown.length > 0 ? (
              <IssueBreakdownChart data={complianceData.issueBreakdown} />
            ) : (
              <p style={{ textAlign: 'center', color: '#888' }}>No data to display</p>
            )}
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '15px' }}>Upcoming Reviews</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {complianceData.upcomingReviews.length > 0 ? complianceData.upcomingReviews.map((review, idx) => (
                <li key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <strong>{review.itemName}</strong> ({review.contractRef})<br/>
                  <span style={{ fontSize: '12px', color: review.daysLeft < 10 ? '#e74c3c' : '#f39c12' }}>
                    {review.date} ({review.daysLeft} days left)
                  </span>
                </li>
              )) : <li>No upcoming reviews.</li>}
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Compliance;