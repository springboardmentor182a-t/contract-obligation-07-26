import React from 'react';
import { DashboardIcon, ContractsIcon, ObligationsIcon, ComplianceIcon, SettingsIcon } from './DashboardIcons';

const SidebarDemo = () => {
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">ContractIQ UI</h2>
      
      <div className="flex items-center gap-4 cursor-pointer group">
        <div className="p-3 rounded-lg bg-blue-100 text-blue-700 group-hover:scale-105 transition-transform">
          <DashboardIcon />
        </div>
        <span className="font-semibold text-gray-700">Dashboard</span>
      </div>
      
      <div className="flex items-center gap-4 cursor-pointer group">
        <div className="p-3 rounded-lg bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
          <ContractsIcon />
        </div>
        <span className="font-semibold text-gray-700">Contracts</span>
      </div>
      
      <div className="flex items-center gap-4 cursor-pointer group">
        <div className="p-3 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-105 transition-transform">
          <ObligationsIcon />
        </div>
        <span className="font-semibold text-gray-700">Obligations</span>
      </div>
      
      <div className="flex items-center gap-4 cursor-pointer group">
        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-105 transition-transform">
          <ComplianceIcon />
        </div>
        <span className="font-semibold text-gray-700">Compliance</span>
      </div>
      
      <div className="flex items-center gap-4 cursor-pointer group mt-auto">
        <div className="p-3 rounded-lg bg-slate-100 text-slate-600 group-hover:scale-105 transition-transform">
          <SettingsIcon />
        </div>
        <span className="font-semibold text-gray-700">Settings</span>
      </div>
    </div>
  );
};

export default SidebarDemo;
