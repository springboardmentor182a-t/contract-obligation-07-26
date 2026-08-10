import React from 'react';
import { StatBox } from './DashboardShared';

export const DashboardStatsGrid = ({ isDarkMode, stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatBox isDarkMode={isDarkMode} label="Active Contracts" value={stats?.activeContracts?.metric ?? '—'} trend={stats?.activeContracts?.trendText} dir={stats?.activeContracts?.trendDirection} />
      <StatBox isDarkMode={isDarkMode} label="Pending Obligations" value={stats?.pendingObligations?.metric ?? '—'} trend={stats?.pendingObligations?.trendText} dir={stats?.pendingObligations?.trendDirection} />
      <StatBox isDarkMode={isDarkMode} label="Upcoming Renewals" value={stats?.upcomingRenewals?.metric ?? '—'} trend={stats?.upcomingRenewals?.trendText} dir={stats?.upcomingRenewals?.trendDirection} />
      <StatBox isDarkMode={isDarkMode} label="Compliance Rate" value={stats?.complianceRate?.metric ?? '—'} trend={stats?.complianceRate?.trendText} dir={stats?.complianceRate?.trendDirection} />
      <StatBox isDarkMode={isDarkMode} label="High Risk" value={stats?.highRisk?.metric ?? '—'} trend={stats?.highRisk?.trendText} dir={stats?.highRisk?.trendDirection} />
      <StatBox isDarkMode={isDarkMode} label="Expired" value={stats?.expired?.metric ?? '—'} trend={stats?.expired?.trendText} dir={stats?.expired?.trendDirection} />
    </div>
  );
};
