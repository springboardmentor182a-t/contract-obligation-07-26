import React from 'react';

const ActivityChart = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      {/* Decorative background glow */}
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
      
      {/* SVG Chart Area */}
      <div className="w-full h-[280px] relative ml-4">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400 font-medium pb-6">
          <div className="flex items-center border-b border-slate-100/80 w-full h-0 relative"><span className="absolute -left-8 bg-white px-1">100</span></div>
          <div className="flex items-center border-b border-slate-100/80 w-full h-0 relative"><span className="absolute -left-8 bg-white px-1">75</span></div>
          <div className="flex items-center border-b border-slate-100/80 w-full h-0 relative"><span className="absolute -left-8 bg-white px-1">50</span></div>
          <div className="flex items-center border-b border-slate-100/80 w-full h-0 relative"><span className="absolute -left-8 bg-white px-1">25</span></div>
          <div className="flex items-center border-b border-slate-100/80 w-full h-0 relative"><span className="absolute -left-8 bg-white px-1 text-slate-300">0</span></div>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-slate-400 font-medium px-2">
          <span className="hover:text-[#1E3A8A] transition-colors cursor-default">Jan</span>
          <span className="hover:text-[#1E3A8A] transition-colors cursor-default">Feb</span>
          <span className="hover:text-[#1E3A8A] transition-colors cursor-default">Mar</span>
          <span className="hover:text-[#1E3A8A] transition-colors cursor-default flex flex-col items-center"><span className="w-1 h-1 bg-[#1E3A8A] rounded-full mb-1"></span>Apr</span>
          <span className="hover:text-[#1E3A8A] transition-colors cursor-default">May</span>
          <span className="hover:text-[#1E3A8A] transition-colors cursor-default">Jun</span>
        </div>

        {/* SVG Data Lines */}
        <svg className="w-full h-full absolute inset-0 pb-8 px-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
            </linearGradient>
            <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Drafts (Blue) Line & Area */}
          <g style={{ animation: 'fadeIn 1s ease-out' }}>
            <path d="M 0,80 C 20,65 35,85 60,50 C 75,30 85,35 100,10 L 100,100 L 0,100 Z" fill="url(#blueGradient)" />
            <path d="M 0,80 C 20,65 35,85 60,50 C 75,30 85,35 100,10" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowLine)" />
            
            {/* Data Points - Blue */}
            <circle cx="60" cy="50" r="2" fill="#fff" stroke="#1E3A8A" strokeWidth="1.5" className="hover:r-[4px] transition-all cursor-pointer" />
            <circle cx="100" cy="10" r="2" fill="#fff" stroke="#1E3A8A" strokeWidth="1.5" className="hover:r-[4px] transition-all cursor-pointer" />
          </g>

          {/* Executed (Green) Line & Area */}
          <g style={{ animation: 'fadeIn 1.5s ease-out' }}>
            <path d="M 0,95 C 25,90 40,80 60,75 C 80,70 90,55 100,45 L 100,100 L 0,100 Z" fill="url(#greenGradient)" />
            <path d="M 0,95 C 25,90 40,80 60,75 C 80,70 90,55 100,45" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowLine)" />
            
            {/* Data Points - Green */}
            <circle cx="60" cy="75" r="2" fill="#fff" stroke="#10B981" strokeWidth="1.5" className="hover:r-[4px] transition-all cursor-pointer" />
            <circle cx="100" cy="45" r="2" fill="#fff" stroke="#10B981" strokeWidth="1.5" className="hover:r-[4px] transition-all cursor-pointer" />
          </g>
          
          {/* Tooltip Simulation on hover over April (60%) */}
          <g className="opacity-0 hover:opacity-100 transition-opacity duration-300">
             <line x1="60" y1="0" x2="60" y2="100" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" />
             <rect x="45" y="20" width="30" height="15" rx="2" fill="#1E3A8A" />
             <text x="60" y="30" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">128</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ActivityChart;
