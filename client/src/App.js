import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import AddUser from "./pages/AddUser";

import ContractRepository from './pages/ContractRepository/ContractRepository';
import ContractDetails from './pages/ContractDetails/ContractDetails';
import AddContract from './pages/AddContract/AddContract';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Home />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/contracts" element={<ContractRepository />} />
          <Route path="/contracts/:contractId" element={<ContractDetails />} />
          <Route path="/contracts/add" element={<AddContract />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/edit-contract/:id" element={<AddContract />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;