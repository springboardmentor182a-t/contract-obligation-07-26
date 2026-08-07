import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageContainer from './components/layout/PageContainer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ContractRepository from './pages/ContractRepository';
import ObligationTracker from './pages/ObligationTracker';
import ComplianceDashboard from './pages/ComplianceDashboard';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Settings from './features/settings/Settings';
import Transactions from './pages/Transactions';
import TaxEstimators from './pages/TaxEstimators';
import UserManagement from './pages/UserManagement';
import Renewals from './pages/Renewals';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import './assets/theme.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        
        {/* Protected layout wraps all internal pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<PageContainer><Dashboard /></PageContainer>} />
          <Route path="/contracts" element={<PageContainer><ContractRepository /></PageContainer>} />
          <Route path="/obligations" element={<PageContainer><ObligationTracker /></PageContainer>} />
          <Route path="/compliance" element={<PageContainer><ComplianceDashboard /></PageContainer>} />
          <Route path="/reports" element={<PageContainer><Reports /></PageContainer>} />
          <Route path="/notifications" element={<PageContainer><Notifications /></PageContainer>} />
          <Route path="/audit-logs" element={<PageContainer><AuditLogs /></PageContainer>} />
          <Route path="/settings" element={<PageContainer><Settings /></PageContainer>} />
          <Route path="/transactions" element={<PageContainer><Transactions /></PageContainer>} />
          <Route path="/tax-estimators" element={<PageContainer><TaxEstimators /></PageContainer>} />
          <Route path="/users" element={<PageContainer><UserManagement /></PageContainer>} />
          <Route path="/renewals" element={<PageContainer><Renewals /></PageContainer>} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
