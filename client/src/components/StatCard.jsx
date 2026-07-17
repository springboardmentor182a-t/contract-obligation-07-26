import React from 'react';

const StatCard = ({ title, metric, trendDirection, trendText, icon, colorTheme }) => {
  const themeStyles = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-700',
  };

  const trendColor = trendDirection === 'up' ? 'text-emerald-600 bg-emerald-50' : 
                     trendDirection === 'down' ? 'text-red-600 bg-red-50' : 
                     'text-slate-600 bg-slate-50';

  const trendIcon = trendDirection === 'up' ? 'fa-arrow-up' : 
                    trendDirection === 'down' ? 'fa-arrow-down' : 
                    'fa-minus';

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 hover:scale-[1.02] duration-200 p-6 flex flex-col justify-between h-full cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
          <div className="text-3xl font-bold text-[#1E3A8A]">{metric}</div>
        </div>
        <div className={`p-3 rounded-lg ${themeStyles[colorTheme] || themeStyles.blue}`}>
          {icon}
        </div>
      </div>
      
      {trendText && (
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${trendColor}`}>
            <i className={`fa-solid ${trendIcon} mr-1 text-[10px]`}></i>
            {trendText}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
