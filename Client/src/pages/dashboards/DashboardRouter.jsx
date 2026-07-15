import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import LegalManagerDashboard from './LegalManagerDashboard';
import ComplianceOfficerDashboard from './ComplianceOfficerDashboard';
import ContractManagerDashboard from './ContractManagerDashboard';

const DashboardRouter = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div className="dashboard-container fade-in"><p>Loading Dashboard...</p></div>;
  }

  const normalizedRole = role ? role.toLowerCase().trim() : '';

  if (normalizedRole === 'admin') {
    return <AdminDashboard />;
  } else if (normalizedRole === 'legal manager') {
    return <LegalManagerDashboard />;
  } else if (normalizedRole === 'compliance officer') {
    return <ComplianceOfficerDashboard />;
  } else if (normalizedRole === 'contract manager') {
    return <ContractManagerDashboard />;
  } else {
    return <div className="dashboard-container fade-in"><p>No Dashboard available for this role.</p></div>;
  }
};

export default DashboardRouter;
