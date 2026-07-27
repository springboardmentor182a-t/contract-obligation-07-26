import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUI } from "../context/UIContext";

export default function PageContainer({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useUI();

  useEffect(() => {
    function onResize() {
      if (window.innerWidth < 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileOpen(false);
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={!sidebarOpen}
        mobileOpen={mobileOpen}
      />
      <div className={`main-layout ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
        <Navbar
          onToggleSidebar={() => {
            if (window.innerWidth < 900) {
              setMobileOpen((m) => !m);
            } else {
              setSidebarOpen((s) => !s);
            }
          }}
        />
        <main className="content-body">
          {children}
        </main>
      </div>
      {toast && (
        <div className={`toast-notification ${toast.type || "info"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
