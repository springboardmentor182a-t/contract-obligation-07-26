import React from 'react';

const StatCard = ({ title, metric, trendDirection, trendText, icon, colorTheme }) => {
  const themeStyles = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
    green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
    red: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30',
    purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30',
  };

  const trendColor = trendDirection === 'up' 
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30' 
    : trendDirection === 'down' 
    ? 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30' 
    : 'text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';

  const trendIcon = trendDirection === 'up' ? 'fa-arrow-up' : 
                    trendDirection === 'down' ? 'fa-arrow-down' : 
                    'fa-minus';

  return (
    <div className="bg-white dark:bg-[#161F2E] rounded-xl border border-slate-200 dark:border-[#2A364F] shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xs font-bold text-[#64748B] dark:text-[#8E9BAE] uppercase tracking-wider mb-1.5">{title}</h3>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{metric}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${themeStyles[colorTheme] || themeStyles.blue}`}>
          {icon}
        </div>
      </div>
      
      {trendText && (
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${trendColor}`}>
            <i className={`fa-solid ${trendIcon} mr-1 text-[10px]`}></i>
            {trendText}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
