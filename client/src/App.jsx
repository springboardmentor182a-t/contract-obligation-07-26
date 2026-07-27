import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageContainer from './components/layout/PageContainer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ContractRepository from './pages/ContractRepository';
import ObligationTracker from './pages/ObligationTracker';
import ComplianceDashboard from './pages/ComplianceDashboard';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import './assets/theme.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Protected layout wraps all internal pages */}
          <Route path="/dashboard" element={<ProtectedRoute><PageContainer><Dashboard /></PageContainer></ProtectedRoute>} />
          <Route path="/contracts" element={<ProtectedRoute><PageContainer><ContractRepository /></PageContainer></ProtectedRoute>} />
          <Route path="/obligations" element={<ProtectedRoute><PageContainer><ObligationTracker /></PageContainer></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><PageContainer><ComplianceDashboard /></PageContainer></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><PageContainer><Reports /></PageContainer></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><PageContainer><Notifications /></PageContainer></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><PageContainer><AuditLogs /></PageContainer></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PageContainer><Settings /></PageContainer></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
