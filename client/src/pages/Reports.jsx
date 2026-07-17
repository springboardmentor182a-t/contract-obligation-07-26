import React from 'react';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockData = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 3800 },
  { name: 'Mar', value: 5100 },
  { name: 'Apr', value: 4700 },
  { name: 'May', value: 6300 },
  { name: 'Jun', value: 5900 },
];

const Reports = () => {
  const handleDownload = (type) => {
    if (type === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(139, 92, 246); // Vibrant Purple
      doc.text("ContractIQ - Report Analytics", 20, 20);
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text("Financial Exposure & Compliance Data", 20, 30);
      
      doc.setFontSize(12);
      doc.text("This document serves as an overview of your contract lifecycle.", 20, 45);
      doc.text("1. Total Contract Value: $30,000", 20, 55);
      doc.text("2. Upcoming Renewals: 34", 20, 65);
      doc.text("3. Compliance Score: 98.5%", 20, 75);
      
      doc.save("contract-report.pdf");
    } else {
      const content = 'id,name,value\n1,Contract A,4200\n2,Contract B,3800\n3,Contract C,5100';
      const blob = new Blob([content], { type: 'text/csv' });
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
    <div>
      <h1 style={{ margin: '0 0 32px 0', fontSize: '28px', color: 'var(--primary-color)' }}>Reports & Analytics</h1>
      
      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="stat-card" style={{ padding: '24px', height: '350px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Contract Values (YTD)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-white)', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="var(--secondary-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card" style={{ padding: '24px', height: '350px' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Renewals Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--background-white)', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="var(--success-color)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div className="stat-icon primary"><i className="fa-solid fa-chart-line"></i></div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>Financial Exposure</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Overview of total contract value and financial risk.</p>
          <button className="premium-button" style={{ width: '100%' }} onClick={() => handleDownload('pdf')}><i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Download PDF</button>
        </div>
        
        <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div className="stat-icon warning"><i className="fa-solid fa-calendar-days"></i></div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>Upcoming Renewals</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>All contracts expiring within the next 90 days.</p>
          <button className="premium-button" style={{ width: '100%' }} onClick={() => handleDownload('csv')}><i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Download CSV</button>
        </div>
        
        <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div className="stat-icon success"><i className="fa-solid fa-clipboard-check"></i></div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>Compliance Report</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Detailed breakdown of obligation fulfillment.</p>
          <button className="premium-button" style={{ width: '100%' }} onClick={() => handleDownload('pdf')}><i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
