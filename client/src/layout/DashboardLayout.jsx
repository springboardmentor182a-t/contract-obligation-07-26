import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const COLLAPSED_SIDEBAR_WIDTH = 104;
const DEFAULT_SIDEBAR_WIDTH = 356;
const MIN_SIDEBAR_WIDTH = 320;
const MAX_SIDEBAR_WIDTH = 390;
const DASHBOARD_GUTTER = 24;

function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  const activeSidebarWidth = isSidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : sidebarWidth;

  function handleSidebarResizeStart(event) {
    event.preventDefault();

    function handleMouseMove(moveEvent) {
      const nextWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, moveEvent.clientX)
      );

      setSidebarWidth(nextWidth);
    }

    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        width={activeSidebarWidth}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
        onResizeStart={handleSidebarResizeStart}
      />

      <div
        className="min-h-screen transition-[padding-left,padding-right] duration-300"
        style={{
          paddingLeft: activeSidebarWidth + DASHBOARD_GUTTER,
          paddingRight: DASHBOARD_GUTTER,
        }}
      >

        <TopNavbar />

        <main className="w-full max-w-[1400px] mx-auto px-8 py-7 max-xl:px-6 max-md:px-4">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
