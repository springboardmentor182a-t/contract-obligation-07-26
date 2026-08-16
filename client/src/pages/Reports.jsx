import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const Reports = () => {
  const [mockData, setMockData] = useState([]);
  const [reportDetails, setReportDetails] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetch('/api/reports/mockData')
      .then(res => res.json())
      .then(data => setMockData(data))
      .catch(console.error);

    fetch('/api/reports/details')
      .then(res => res.json())
      .then(data => setReportDetails(data))
      .catch(console.error);
  }, []);

  const handleDownload = (type) => {
    if (!reportDetails) return;
    if (type === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235);
      doc.text("ContractIQ - Report Analytics", 20, 20);
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text("Financial Exposure & Compliance Data", 20, 30);
      
      doc.setFontSize(12);
      doc.text("This document serves as an overview of your contract lifecycle.", 20, 45);
      doc.text(`1. Total Contract Value: ${reportDetails.totalValue}`, 20, 55);
      doc.text(`2. Upcoming Renewals: ${reportDetails.renewals}`, 20, 65);
      doc.text(`3. Compliance Score: ${reportDetails.compliance}`, 20, 75);
      
      doc.save("contract-report.pdf");
    } else {
      const blob = new Blob([reportDetails.csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract-data.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
          Reports & Analytics
        </h1>
        <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
          Export comprehensive contract analytics, audits, and financial summaries.
        </p>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 m-0">Contract Values (YTD)</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2A364F' : '#E2E8F0'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#8E9BAE' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#8E9BAE' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#161F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A364F' : '#E2E8F0', borderRadius: '8px', color: isDarkMode ? '#FFF' : '#1E293B' }} />
                <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 m-0">Renewals Trend</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2A364F' : '#E2E8F0'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#8E9BAE' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDarkMode ? '#8E9BAE' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#161F2E' : '#FFFFFF', borderColor: isDarkMode ? '#2A364F' : '#E2E8F0', borderRadius: '8px', color: isDarkMode ? '#FFF' : '#1E293B' }} />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports Download Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 m-0">Financial Exposure</h3>
          <p className="text-xs text-[#64748B] dark:text-[#8E9BAE] mb-6">Overview of total contract value and financial exposure risk across all active vendors.</p>
          <button 
            className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => handleDownload('pdf')}
          >
            <i className="fa-solid fa-file-pdf"></i>
            <span>Download PDF</span>
          </button>
        </div>
        
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-calendar-days"></i>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 m-0">Upcoming Renewals</h3>
          <p className="text-xs text-[#64748B] dark:text-[#8E9BAE] mb-6">Detailed schedule of all contracts expiring or requiring renegotiation within the next 90 days.</p>
          <button 
            className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => handleDownload('csv')}
          >
            <i className="fa-solid fa-file-csv"></i>
            <span>Download CSV</span>
          </button>
        </div>
        
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-4">
            <i className="fa-solid fa-clipboard-check"></i>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 m-0">Compliance Report</h3>
          <p className="text-xs text-[#64748B] dark:text-[#8E9BAE] mb-6">Detailed breakdown of obligation fulfillment, regulatory verification, and risk metrics.</p>
          <button 
            className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => handleDownload('pdf')}
          >
            <i className="fa-solid fa-file-pdf"></i>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
