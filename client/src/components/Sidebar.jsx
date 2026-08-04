import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  RefreshCcw,
  BarChart3,
  Settings,
  Shield,
  ShieldCheck,
  Bell,
  BookOpen,
  Users,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from "lucide-react";

function Sidebar({ isCollapsed, width, onToggle, onResizeStart }) {
  const [isSystemOpen, setIsSystemOpen] = useState(true);

  const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Contract Repository", icon: FileText, path: "/contracts" },
  { name: "Obligation Tracker", icon: ClipboardList, path: "/obligations" },
  { name: "Renewal Dashboard", icon: RefreshCcw, path: "/renewal-dashboard", active: true },
  { name: "Compliance", icon: Shield, path: "/compliance" },
  { name: "Reports & Analytics", icon: BarChart3, path: "/reports" },
  { name: "Notifications", icon: Bell, path: "/notifications", badge: "2" },
  { name: "Audit Logs", icon: BookOpen, path: "/audit" },
  { name: "User Management", icon: Users, path: "/users" },
  { name: "Settings", icon: Settings, path: "/settings" },
 ];

  const systemServices = [
    { name: "API Server", status: "OK" },
    { name: "AI Engine", status: "OK" },
    { name: "Database", status: "OK" },
    { name: "Queue", status: "OK" },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-800 bg-[#08111F] text-white transition-[width] duration-300"
      style={{ width }}
    >
      <div className={`flex items-center px-6 pb-10 pt-6 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-4">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-white/10">
            <ShieldCheck size={21} />
          </div>
          <div className={isCollapsed ? "hidden" : ""}>
            <h1 className="text-xl font-extrabold leading-6 tracking-tight text-white">
              ContractIQ
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              AI-Powered Platform
            </p>
          </div>
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-900 hover:text-white"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <ChevronLeft size={19} />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="mx-4 mt-10 flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111B2A] px-4 py-4 shadow-inner shadow-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-bold leading-5">Acme Corp</p>
              <p className="text-xs text-slate-500">Enterprise Plan</p>
            </div>
          </div>
          <ChevronDown size={16} className="text-slate-500" />
        </div>
      )}

      <nav className={`sidebar-scroll flex-1 overflow-y-auto px-4 pb-5 ${isCollapsed ? "mt-8" : "mt-7"}`}>
        <p className={`mb-4 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 ${isCollapsed ? "sr-only" : ""}`}>
          Main Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              title={isCollapsed ? item.name : undefined}
              className={`relative mb-2 flex min-h-12 cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isCollapsed ? "mx-auto w-14 justify-center px-0" : ""} ${
                item.active
                  ? "border border-blue-800 bg-[#132A4D] text-white shadow-inner shadow-blue-950/30"
                  : "text-slate-500 hover:bg-[#111B2A] hover:text-slate-200"
              }`}
            >
              {item.active && <span className="absolute left-0 h-7 w-1 rounded-r bg-blue-500" />}

              <Icon size={isCollapsed ? 21 : 18} className={item.active ? "text-blue-400" : ""} />

              <span className={isCollapsed ? "hidden" : ""}>{item.name}</span>

              {item.badge && !isCollapsed && (
                <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}

              {item.badge && isCollapsed && (
                <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </div>
          );
        })}
      </nav>

      {!isCollapsed && (
      <div className="space-y-4 border-t border-slate-800 p-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0D1828] shadow-inner shadow-slate-950/20">
          <button
            type="button"
            onClick={() => setIsSystemOpen((current) => !current)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            aria-expanded={isSystemOpen}
          >
            <div className="flex items-center gap-3 text-slate-400">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
              <span className="text-base font-bold text-slate-300">System Operational</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform duration-200 ${isSystemOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isSystemOpen && (
            <div className="space-y-2 border-t border-slate-800 px-5 pb-4 pt-4">
              {systemServices.map((service) => (
                <div key={service.name} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">{service.name}</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-[68px] items-center justify-between rounded-2xl border border-violet-800 bg-violet-950/50 px-5 py-5 text-violet-200 shadow-inner shadow-violet-950/20">
          <div className="flex items-center gap-3 text-base font-bold">
            <Bot size={20} />
            <span>AI Assistant</span>
          </div>
          <span className="h-3 w-3 rounded-full bg-violet-400 shadow-sm shadow-violet-400/40" />
        </div>
      </div>
      )}

      {isCollapsed && (
        <button
          type="button"
          onClick={onToggle}
          className="flex h-[74px] items-center justify-center border-t border-slate-800 text-slate-500 transition hover:text-slate-200"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <ChevronRight size={21} />
        </button>
      )}

      {!isCollapsed && (
        <button
          type="button"
          onMouseDown={onResizeStart}
          className="absolute inset-y-0 -right-2 flex w-4 cursor-col-resize items-center justify-center text-slate-600 transition hover:text-blue-400"
          aria-label="Resize sidebar"
          title="Drag to resize sidebar"
        >
          <span className="flex h-14 w-3 items-center justify-center rounded-full border border-slate-800 bg-slate-950 shadow-lg">
            <GripVertical size={13} />
          </span>
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
