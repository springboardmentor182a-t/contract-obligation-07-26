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
