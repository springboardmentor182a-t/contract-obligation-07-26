import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import { ContractsIcon, ObligationsIcon, ComplianceIcon, DashboardIcon } from '../../components/DashboardIcons';

const LegalDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Active Contracts" 
        metric={stats.activeContracts.metric} 
        trendDirection={stats.activeContracts.trendDirection} 
        trendText={stats.activeContracts.trendText} 
        icon={<ContractsIcon className="w-6 h-6" />} 
        colorTheme="blue" 
      />
      <StatCard 
        title="Upcoming Renewals" 
        metric={stats.upcomingRenewals.metric} 
        trendDirection={stats.upcomingRenewals.trendDirection} 
        trendText={stats.upcomingRenewals.trendText} 
        icon={<ObligationsIcon className="w-6 h-6" />} 
        colorTheme="amber" 
      />
      <StatCard 
        title="Pending Obligations" 
        metric={stats.pendingObligations.metric} 
        trendDirection={stats.pendingObligations.trendDirection} 
        trendText={stats.pendingObligations.trendText} 
        icon={<DashboardIcon className="w-6 h-6" />} 
        colorTheme="purple" 
      />
      <StatCard 
        title="Compliance Status" 
        metric={stats.complianceStatus.metric} 
        trendDirection={stats.complianceStatus.trendDirection} 
        trendText={stats.complianceStatus.trendText} 
        icon={<ComplianceIcon className="w-6 h-6" />} 
        colorTheme="green" 
      />
    </div>
  );
};

export default LegalDashboard;
