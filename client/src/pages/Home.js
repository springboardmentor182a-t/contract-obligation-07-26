import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import ContractStatusChart from '../components/Charts/ContractStatusChart';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API_BASE_URL } from '../data/constants';
import Navbar from '../layout/Navbar';
import NewContractModal from '../components/Modals/NewContractModal';

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    kpi: { total: 0, active: 0, expiring: 0, overdue: 0 },
    chartData: [],
    deadlines: [],
    contracts: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- NEW: Action Button Handlers ---
  const handleDeleteContract = async (contractId) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchDashboardData(); 
      } else {
        alert("Failed to delete the contract.");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const handleViewDetails = (contractName) => {
    alert(`Loading full details for: ${contractName}`);
  };

  const handleEdit = (contractName) => {
    alert(`Opening edit window for: ${contractName}`);
  };

  const handleDownload = (contractName) => {
    alert(`Downloading document for: ${contractName}`);
  };

  const filteredContracts = dashboardData.contracts.filter(contract => 
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contract.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <PageContainer><div>Loading...</div></PageContainer>;

  return (
    <PageContainer>
      <Navbar 
        onNewContract={() => setIsModalOpen(true)} 
        notifications={dashboardData.deadlines}
        onSearch={setSearchTerm}
      />

      <NewContractModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaveSuccess={fetchDashboardData} 
      />

      <div className="dashboard-grid">
        <div className="kpi-cards">
          <div className="card">Total Contracts: {dashboardData.kpi.total}</div>
          <div className="card">Active Contracts: {dashboardData.kpi.active}</div>
          <div className="card">Expiring Soon: {dashboardData.kpi.expiring}</div>
          <div className="card">Overdue Obligations: {dashboardData.kpi.overdue}</div>
        </div>

        <div className="middle-section">
          <div className="card chart-container">
            <h3>Contract Status Overview</h3>
            {dashboardData.chartData.length > 0 ? (
              <ContractStatusChart data={dashboardData.chartData} />
            ) : (
              <p>No contract status data available.</p>
            )}
          </div>
          
          <div className="card deadlines-container">
            <div className="section-header">
              <h3>Upcoming Deadlines</h3>
              <a href="#all-deadlines">View all</a>
            </div>
            <ul className="deadline-list">
              {dashboardData.deadlines.length > 0 ? dashboardData.deadlines.map((deadline, idx) => (
                <li key={idx}>{deadline.title} - {deadline.date}</li>
              )) : <li>No upcoming deadlines</li>}
            </ul>
          </div>

          <div className="card calendar-container">
            <h3>Calendar</h3>
            <Calendar className="custom-calendar" />
          </div>
        </div>

        <div className="bottom-section">
          <div className="card recent-contracts">
            <div className="section-header">
              <h3>Recent Contracts</h3>
              <a href="#all-contracts">View all</a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Contract Name</th>
                  <th>Party</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.length > 0 ? filteredContracts.map((contract, idx) => (
                  <tr key={idx}>
                    <td>{contract.name}</td>
                    <td>{contract.party}</td>
                    <td><span className={`status-${contract.status.toLowerCase()}`}>{contract.status}</span></td>
                    <td>{contract.startDate}</td>
                    <td>{contract.endDate}</td>
                    <td>{contract.value}</td>
                    {/* --- NEW: Interactive Action Buttons --- */}
                    <td>
                      <div style={{ display: 'flex', gap: '10px', border: 'none' }}>
                        <button onClick={() => handleViewDetails(contract.name)} title="View Details" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                          👁️
                        </button>
                        <button onClick={() => handleEdit(contract.name)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                          ✏️
                        </button>
                        <button onClick={() => handleDownload(contract.name)} title="Download" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                          📥
                        </button>
                        <button onClick={() => handleDeleteContract(contract.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#e74c3c' }}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="7">No matching contracts found</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="card recent-activity">
            <div className="section-header">
              <h3>Recent Activity</h3>
              <a href="#all-activity">View all</a>
            </div>
            <ul className="activity-list">
              {dashboardData.activities.length > 0 ? dashboardData.activities.map((activity, idx) => (
                <li key={idx}>{activity.description} - {activity.time}</li>
              )) : <li>No recent activity</li>}
            </ul>
            <button className="view-all-btn">View All Activity</button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;