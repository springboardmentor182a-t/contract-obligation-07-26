import React from "react";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import "./assets/global.css";

function App() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#EEF2FF"
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "20px"
        }}
      >
        <Navbar />
        <Home />
      </div>
    </div>
  );
}

export default App;