import "./assets/global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UIProvider } from "./context/UIContext";
import PageContainer from "./layout/PageContainer";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Dashboard pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Reports from "./pages/Reports";
import QuickActions from "./pages/QuickActions";
import Calendar from "./pages/Calendar";
import RenewalDashboard from "./pages/RenewalDashboard";
import UserManagement from "./pages/UserManagement";
import Audit from "./pages/Audit";
import Compliance from "./pages/Compliance";

function AppShell() {
  return (
    <PageContainer>
      <Routes>
        {/* Default → Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Home />} />

        {/* Core pages */}
        <Route path="/renewal-dashboard" element={<RenewalDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/quick-actions" element={<QuickActions />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />

        {/* Catch-all → Dashboard */}
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/*" element={<AppShell />} />
        </Routes>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;