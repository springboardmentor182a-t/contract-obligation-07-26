import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUI } from "../context/UIContext";

export default function PageContainer({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useUI();

  useEffect(()=>{
    function onResize(){
      if(window.innerWidth < 900){
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileOpen(false);
      }
    }
    onResize();
    window.addEventListener('resize', onResize);
    return ()=> window.removeEventListener('resize', onResize);
  },[])

  function toggleSidebar(){
    if(window.innerWidth < 900){
      setMobileOpen(s => !s);
    } else {
      setSidebarOpen(s => !s);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={!sidebarOpen} mobileOpen={mobileOpen} />
      {mobileOpen && <div className="sidebar-overlay show" onClick={()=>setMobileOpen(false)} />}
      <div className="main-area">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="content">{children}</main>
      </div>
      {toast.visible && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: "var(--surface)", border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)", borderRadius: 12, padding: "12px 18px",
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 13, fontWeight: 600, minWidth: 260,
          animation: "popIn 0.25s ease forwards"
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--info)", display: "inline-block", flexShrink: 0
          }} />
          <span style={{ flex: 1 }}>🚧 {toast.message}</span>
        </div>
      )}
    </div>
  );
}
