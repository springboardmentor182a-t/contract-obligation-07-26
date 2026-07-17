import React from 'react';
import StatCard from '../../components/StatCard';
import { ContractsIcon, ObligationsIcon, ComplianceIcon, DashboardIcon } from '../../components/DashboardIcons';

const LegalDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Active Contracts" 
        metric="1,248" 
        trendDirection="up" 
        trendText="+12% this month" 
        icon={<ContractsIcon className="w-6 h-6" />} 
        colorTheme="blue" 
      />
      <StatCard 
        title="Upcoming Renewals" 
        metric="34" 
        trendDirection="up" 
        trendText="+4 this week" 
        icon={<ObligationsIcon className="w-6 h-6" />} 
        colorTheme="amber" 
      />
      <StatCard 
        title="Pending Obligations" 
        metric="156" 
        trendDirection="down" 
        trendText="-2% from last week" 
        icon={<DashboardIcon className="w-6 h-6" />} 
        colorTheme="purple" 
      />
      <StatCard 
        title="Compliance Status" 
        metric="98.5%" 
        trendDirection="up" 
        trendText="Consistent" 
        icon={<ComplianceIcon className="w-6 h-6" />} 
        colorTheme="green" 
      />
    </div>
  );
};

export default LegalDashboard;
