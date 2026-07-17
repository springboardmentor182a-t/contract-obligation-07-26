import React from "react";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import PageContainer from "./layout/PageContainer";
import Home from "./pages/Home";
import "./assets/global.css";

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
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ContractDetails from "./pages/ContractDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contract-details" element={<ContractDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
