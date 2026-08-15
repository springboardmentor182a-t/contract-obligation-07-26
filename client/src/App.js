import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { UIProvider, useUI } from "./context/UIContext";
import PageContainer from "./layout/PageContainer";
import {
  canAccessRoute,
  getCurrentUserRole,
  getDefaultRouteForRole,
  isKnownRole,
} from "./utils/sidebarPermissions";

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
import "./assets/global.css";
import {
  PrivacyPolicy,
  TermsOfService,
} from "./pages/LegalPages";

function ProtectedRoute({ children }) {
  const { authReady, authenticated, user } = useUI();
  const role = getCurrentUserRole(user?.role);

  if (!authReady) return null;

  if (!authenticated || !isKnownRole(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { authReady, authenticated, user } = useUI();
  const role = getCurrentUserRole(user?.role);
  const defaultRoute = getDefaultRouteForRole(role);

  if (!authReady) return null;

  if (authenticated) {
    return defaultRoute
      ? <Navigate to={defaultRoute} replace />
      : children;
  }
  return children;
}

function AuthorizedRoute({ path, children }) {
  const { user } = useUI();
  const role = getCurrentUserRole(user?.role);
  const defaultRoute = getDefaultRouteForRole(role);

  if (!defaultRoute) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRoute(role, path)) {
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
}

function DefaultRoleRoute() {
  const { user } = useUI();
  const role = getCurrentUserRole(user?.role);
  const defaultRoute = getDefaultRouteForRole(role);

  return <Navigate to={defaultRoute || "/login"} replace />;
}

function HelpRoute() {
  const { authReady, authenticated } = useUI();

  if (!authReady) return null;

  if (authenticated) {
    return (
      <ProtectedRoute>
        <PageContainer>
          <Help />
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <main className="content" style={{ minHeight: "100vh" }}>
      <Help />
    </main>
  );
}

function AppShell() {
  return (
    <PageContainer>
      <Routes>
        <Route path="/" element={<DefaultRoleRoute />} />
        <Route path="/dashboard" element={<AuthorizedRoute path="/dashboard"><Home /></AuthorizedRoute>} />
        <Route path="/renewal-dashboard" element={<AuthorizedRoute path="/renewal-dashboard"><RenewalDashboard /></AuthorizedRoute>} />
        <Route path="/repository" element={<AuthorizedRoute path="/repository"><ContractRepository /></AuthorizedRoute>} />
        <Route path="/contract-repository" element={<AuthorizedRoute path="/contract-repository"><Navigate to="/repository" replace /></AuthorizedRoute>} />
        <Route path="/obligations" element={<AuthorizedRoute path="/obligations"><Obligations /></AuthorizedRoute>} />
        <Route path="/compliance" element={<AuthorizedRoute path="/compliance"><Compliance /></AuthorizedRoute>} />
        <Route path="/reports" element={<AuthorizedRoute path="/reports"><Reports /></AuthorizedRoute>} />
        <Route path="/notifications" element={<AuthorizedRoute path="/notifications"><Notifications /></AuthorizedRoute>} />
        <Route path="/quick-actions" element={<AuthorizedRoute path="/quick-actions"><QuickActions /></AuthorizedRoute>} />
        <Route path="/calendar" element={<AuthorizedRoute path="/calendar"><Calendar /></AuthorizedRoute>} />
        <Route path="/audit" element={<AuthorizedRoute path="/audit"><Audit /></AuthorizedRoute>} />
        <Route path="/user-management" element={<AuthorizedRoute path="/user-management"><UserManagement /></AuthorizedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<AuthorizedRoute path="/settings"><Settings /></AuthorizedRoute>} />
        <Route path="*" element={<DefaultRoleRoute />} />
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/help" element={<HelpRoute />} />
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
