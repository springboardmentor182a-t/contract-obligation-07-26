import React from "react";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import PageContainer from "./layout/PageContainer";
import Home from "./pages/Home";
import "./assets/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "./context/UIContext";
import PageContainer from "./layout/PageContainer";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Dashboard pages
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Reports from "./pages/Reports";
import QuickActions from "./pages/QuickActions";
import Calendar from "./pages/Calendar";
import RenewalDashboard from "./pages/RenewalDashboard";
import Audit from "./pages/Audit";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <PageContainer>
          <Home />
        </PageContainer>
      </div>
    </div>
    <BrowserRouter>
      <UIProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <PageContainer>
                <RenewalDashboard />
              </PageContainer>
            }
          />
          <Route
            path="/renewal-dashboard"
            element={
              <PageContainer>
                <RenewalDashboard />
              </PageContainer>
            }
          />
          <Route
            path="/reports"
            element={
              <PageContainer>
                <Reports />
              </PageContainer>
            }
          />
          <Route
            path="/profile"
            element={
              <PageContainer>
                <Profile />
              </PageContainer>
            }
          />
          <Route
            path="/settings"
            element={
              <PageContainer>
                <Settings />
              </PageContainer>
            }
          />
          <Route
            path="/notifications"
            element={
              <PageContainer>
                <Notifications />
              </PageContainer>
            }
          />
          <Route
            path="/help"
            element={
              <PageContainer>
                <Help />
              </PageContainer>
            }
          />
          <Route
            path="/calendar"
            element={
              <PageContainer>
                <Calendar />
              </PageContainer>
            }
          />
          <Route
            path="/quick-actions"
            element={
              <PageContainer>
                <QuickActions />
              </PageContainer>
            }
          />
          <Route
            path="/audit"
            element={
              <PageContainer>
                <Audit />
              </PageContainer>
            }
          />
        </Routes>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
