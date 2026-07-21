import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import PageContainer from "./layout/PageContainer";

import Home from "./pages/Home";
import ContractDetails from "./pages/ContractDetails";
import ComplianceDashboard from "./pages/ComplianceDashboard";

import "./assets/global.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <PageContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contract-details" element={<ContractDetails />} />
              <Route path="/compliance" element={<ComplianceDashboard />} />
            </Routes>
          </PageContainer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;