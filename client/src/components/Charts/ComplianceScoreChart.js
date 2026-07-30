import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ComplianceScoreChart = () => {
  
  const trendData = [
    { month: 'Mar', score: 65 },
    { month: 'Apr', score: 72 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 74 },
    { month: 'Jul', score: 78 },
  ];

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="score" stroke="#5f27cd" strokeWidth={3} dot={{ r: 4 }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplianceScoreChart;