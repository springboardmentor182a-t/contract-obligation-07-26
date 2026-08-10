import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDashboardData } from '../hooks/useDashboardData';

import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { DashboardStatsGrid } from '../features/dashboard/components/DashboardStatsGrid';
import { LiveNotificationsPanel } from '../features/dashboard/components/LiveNotificationsPanel';
import { ComplianceRiskCharts } from '../features/dashboard/components/ComplianceRiskCharts';
import { PortfolioBreakdownCharts } from '../features/dashboard/components/PortfolioBreakdownCharts';
import { RecentContractsTable } from '../features/dashboard/components/RecentContractsTable';
import { UpcomingDeadlines, RecentActivity } from '../features/dashboard/components/DashboardPanels';

const Dashboard = () => {
  const userName = (typeof window !== 'undefined' && localStorage.getItem('userName')) || 'there';
  const firstName = userName.split(' ')[0];
  const { isDarkMode } = useTheme();

  const { data: stats } = useDashboardData('/api/dashboard/stats', null);
  const { data: complianceTrend } = useDashboardData('/api/dashboard/compliance-trend', []);
  const { data: riskDistribution } = useDashboardData('/api/dashboard/risk-distribution', []);
  const { data: contractStatus } = useDashboardData('/api/dashboard/contract-status', []);
  const { data: renewalTimeline } = useDashboardData('/api/dashboard/renewal-timeline', []);
  const { data: deptPerformance } = useDashboardData('/api/dashboard/department-performance', []);
  const { data: recentContracts } = useDashboardData('/api/dashboard/recent', []);
  const { data: deadlines } = useDashboardData('/api/dashboard/deadlines', []);
  const { data: activity } = useDashboardData('/api/dashboard/recent-activity', []);

  return (
    <div className="space-y-6">
      <DashboardHeader firstName={firstName} isDarkMode={isDarkMode} />
      <DashboardStatsGrid isDarkMode={isDarkMode} stats={stats} />
      <LiveNotificationsPanel isDarkMode={isDarkMode} />
      
      <ComplianceRiskCharts 
        isDarkMode={isDarkMode} 
        complianceTrend={complianceTrend} 
        riskDistribution={riskDistribution} 
      />
      
      <PortfolioBreakdownCharts 
        isDarkMode={isDarkMode} 
        contractStatus={contractStatus} 
        renewalTimeline={renewalTimeline} 
        deptPerformance={deptPerformance} 
      />
      
      <RecentContractsTable 
        isDarkMode={isDarkMode} 
        recentContracts={recentContracts} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UpcomingDeadlines isDarkMode={isDarkMode} deadlines={deadlines} />
        <RecentActivity isDarkMode={isDarkMode} activity={activity} />
      </div>
    </div>
  );
};

export default Dashboard;
