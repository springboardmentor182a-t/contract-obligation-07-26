import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import AddUser from "./pages/AddUser";
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';
import Obligations from "./pages/Obligations";
import Tasks from "./pages/Tasks";

import ContractRepository from './pages/ContractRepository/ContractRepository';
import ContractDetails from './pages/ContractDetails/ContractDetails';
import AddContract from './pages/AddContract/AddContract';
import UserManagement from './pages/UserManagement';
import Calendar from './pages/Calendar';
import Renewals from './pages/Renewals';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Home />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/calendar" element={<Calendar />} />
          
          {/* Core Dashboards */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/obligations" element={<Obligations />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/documents" element={<Documents />} /> 
          <Route path="/notifications" element={<Notifications />} />

          {/* Contracts Management */}
          <Route path="/contracts" element={<ContractRepository />} />
          <Route path="/contracts/:contractId" element={<ContractDetails />} />
          <Route path="/contracts/add" element={<AddContract />} />
          <Route path="/edit-contract/:id" element={<AddContract />} />

          {/* User Management */}
          <Route path="/users" element={<UserManagement />} />
          <Route path="/add-user" element={<AddUser />} />

          <Route path="/documents" element={<Documents />} />

          
          {/* Authentication & Settings */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;