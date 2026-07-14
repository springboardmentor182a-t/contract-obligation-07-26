import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageContainer from './layout/PageContainer';
import AuthLayout from './layout/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import DashboardRouter from './pages/dashboards/DashboardRouter';
import UserManagement from './pages/users/UserManagement';
import ContractRepository from './pages/contracts/ContractRepository';
import ContractDetails from './pages/contracts/ContractDetails';
import ArchivedContracts from './pages/contracts/ArchivedContracts';
import Notifications from './pages/notifications/Notifications';
import Reports from './pages/reports/Reports';
import Obligations from './pages/obligations/Obligations';
import Compliance from './pages/compliance/Compliance';
import Renewals from './pages/renewals/Renewals';
import RenewalDetail from './pages/renewals/RenewalDetail';
import AuditLogs from './pages/auditLogs/AuditLogs';
import Settings from './pages/settings/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleProtectedRoute = ({ module, children }) => {
  const { role, loading } = useAuth();
  
  if (loading) return null;

  const normalizedRole = role ? role.toLowerCase().trim() : '';
  
  const checkAccess = (roleName, moduleName) => {
    const admin = ['admin', 'administrator'];
    const legal = ['legal manager', 'legal'];
    const compliance = ['compliance officer', 'compliance'];
    const contract = ['contract manager', 'contract'];
    
    const accessMatrix = {
      'Dashboard': { admin: true, legal: true, compliance: true, contract: true, default: true },
      'Contract Repository': { admin: false, legal: true, compliance: true, contract: true, default: true },
      'Obligation Tracker': { admin: false, legal: true, compliance: true, contract: true, default: true },
      'Renewal Dashboard': { admin: false, legal: true, compliance: true, contract: true, default: false },
      'Compliance': { admin: false, legal: true, compliance: true, contract: false, default: false },
      'Reports & Analytics': { admin: false, legal: true, compliance: false, contract: false, default: false },
      'Notifications': { admin: true, legal: true, compliance: true, contract: true, default: true },
      'Audit Logs': { admin: true, legal: false, compliance: false, contract: false, default: false },
      'User Management': { admin: true, legal: true, compliance: false, contract: false, default: false },
      'Settings': { admin: true, legal: true, compliance: true, contract: true, default: true }
    };

    let roleCategory = 'default';
    if (admin.includes(roleName)) roleCategory = 'admin';
    else if (legal.includes(roleName)) roleCategory = 'legal';
    else if (compliance.includes(roleName)) roleCategory = 'compliance';
    else if (contract.includes(roleName)) roleCategory = 'contract';

    const moduleAccess = accessMatrix[moduleName];
    if (!moduleAccess) return true;

    return moduleAccess[roleCategory];
  };

  const hasAccess = checkAccess(normalizedRole, module);

  if (!hasAccess) {
    if (['admin', 'administrator'].includes(normalizedRole)) {
      return <Navigate to="/notifications" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Placeholder components for newly added routes in sidebar
const PlaceholderPage = ({ title }) => (
  <div className="dashboard-container fade-in">
    <div className="dashboard-header mb-2">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted mt-1">This page is under construction.</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          
          {/* Protected Routes (Main App) */}
          <Route element={<ProtectedRoute><PageContainer /></ProtectedRoute>}>
            <Route path="dashboard" element={<RoleProtectedRoute module="Dashboard"><DashboardRouter /></RoleProtectedRoute>} />
              
            {/* Contracts Module */}
            <Route path="contracts" element={<RoleProtectedRoute module="Contract Repository"><ContractRepository /></RoleProtectedRoute>} />
            <Route path="contracts/:id" element={<RoleProtectedRoute module="Contract Repository"><ContractDetails /></RoleProtectedRoute>} />
            <Route path="archived" element={<RoleProtectedRoute module="Contract Repository"><ArchivedContracts /></RoleProtectedRoute>} />
            <Route path="notifications" element={<RoleProtectedRoute module="Notifications"><Notifications /></RoleProtectedRoute>} />
            <Route path="reports" element={<RoleProtectedRoute module="Reports & Analytics"><Reports /></RoleProtectedRoute>} />
            
            {/* Obligations & Renewals */}
            <Route path="obligations" element={<RoleProtectedRoute module="Obligation Tracker"><Obligations /></RoleProtectedRoute>} />
            <Route path="renewals" element={<RoleProtectedRoute module="Renewal Dashboard"><Renewals /></RoleProtectedRoute>} />
            <Route path="renewals/:id" element={<RoleProtectedRoute module="Renewal Dashboard"><RenewalDetail /></RoleProtectedRoute>} />
            <Route path="compliance" element={<RoleProtectedRoute module="Compliance"><Compliance /></RoleProtectedRoute>} />
            
            {/* Settings */}
            <Route path="settings" element={<RoleProtectedRoute module="Settings"><Settings /></RoleProtectedRoute>} />

            {/* Role-Specific New Routes (Placeholders except users) */}
            <Route path="users" element={<RoleProtectedRoute module="User Management"><UserManagement /></RoleProtectedRoute>} />
            <Route path="audit-logs" element={<RoleProtectedRoute module="Audit Logs"><AuditLogs /></RoleProtectedRoute>} />
            <Route path="approvals" element={<PlaceholderPage title="Contract Approvals" />} />
            <Route path="my-contracts" element={<PlaceholderPage title="My Contracts" />} />
            <Route path="my-obligations" element={<PlaceholderPage title="My Obligations" />} />
            <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
