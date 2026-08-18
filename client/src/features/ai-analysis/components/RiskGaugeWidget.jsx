import React from 'react';

const RiskGaugeWidget = ({ riskData }) => {
  if (!riskData) return null;
  const { risk_score = 0, risk_tier = 'Low', category = 'Safe', confidence = 0.9, drivers = [] } = riskData;

  const getStrokeColor = (score) => {
    if (score < 30) return '#10B981'; // Emerald
    if (score < 60) return '#F59E0B'; // Amber
    if (score < 80) return '#F43F5E'; // Rose
    return '#EF4444'; // Red
  };

  const strokeColor = getStrokeColor(risk_score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, risk_score)) / 100) * circumference;

  return (
    <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-brain-circuit text-blue-500"></i>
            KNN Risk Score
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#8E9BAE]">scikit-learn k-NN Regressor (k=5)</p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {(confidence * 100).toFixed(0)}% Conf
        </span>
      </div>

      <div className="flex items-center justify-center my-3 relative">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="text-slate-100 dark:text-slate-800" strokeWidth="10" stroke="currentColor" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{risk_score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: `${strokeColor}20`, color: strokeColor }}>
          {risk_tier} • {category}
        </div>
        {drivers.length > 0 && (
          <div className="text-left space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Primary Drivers:</span>
            {drivers.slice(0, 2).map((d, i) => (
              <div key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <i className="fa-solid fa-circle-exclamation text-[10px] text-amber-500 mt-0.5"></i>
                <span className="truncate">{d}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskGaugeWidget;
