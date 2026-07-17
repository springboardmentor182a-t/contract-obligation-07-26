import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageContainer from './components/layout/PageContainer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ContractRepository from './pages/ContractRepository';
import ObligationTracker from './pages/ObligationTracker';
import ComplianceDashboard from './pages/ComplianceDashboard';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import './assets/theme.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Protected layout wraps all internal pages */}
        <Route path="/dashboard" element={<PageContainer><Dashboard /></PageContainer>} />
        <Route path="/contracts" element={<PageContainer><ContractRepository /></PageContainer>} />
        <Route path="/obligations" element={<PageContainer><ObligationTracker /></PageContainer>} />
        <Route path="/compliance" element={<PageContainer><ComplianceDashboard /></PageContainer>} />
        <Route path="/reports" element={<PageContainer><Reports /></PageContainer>} />
        <Route path="/notifications" element={<PageContainer><Notifications /></PageContainer>} />
        <Route path="/audit-logs" element={<PageContainer><AuditLogs /></PageContainer>} />
        <Route path="/settings" element={<PageContainer><Settings /></PageContainer>} />
      </Routes>
    </Router>
  );
}

export default App;
