import React from "react";
import "./assets/global.css";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { UIProvider } from "./context/UIContext";
import PageContainer from "./layout/PageContainer";

// Authentication pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./pages/Logout";

// Application pages
import Home from "./pages/Home";
import RenewalDashboard from "./pages/RenewalDashboard";
import ContractRepository from "./pages/ContractRepository";
import Obligations from "./pages/Obligations";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import QuickActions from "./pages/QuickActions";
import Calendar from "./pages/Calendar";
import Audit from "./pages/Audit";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

function isAuthenticated() {
  return Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppShell() {
  return (
    <PageContainer>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/renewal-dashboard" element={<RenewalDashboard />} />
        <Route path="/repository" element={<ContractRepository />} />
        <Route path="/contract-repository" element={<Navigate to="/repository" replace />} />
        <Route path="/obligations" element={<Obligations />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/quick-actions" element={<QuickActions />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PageContainer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
