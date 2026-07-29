import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard/activity')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(console.error);
  }, []);

  if (data.length === 0) return <div>Loading activity...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
      
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A] tracking-tight">Contract Activity Overview</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Volume of contracts processed over the last 6 months</p>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm"><div className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A] mr-2"></div> Drafts</span>
          <span className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981] mr-2"></div> Executed</span>
        </div>
      </div>
      
      <div className="w-full h-[280px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey="drafts" stroke="#1E3A8A" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
            <Line type="monotone" dataKey="executed" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
