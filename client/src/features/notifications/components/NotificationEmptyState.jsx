import React from 'react';

const NotificationEmptyState = ({
  searchQuery,
  filterType,
  onResetFilters,
  isDarkMode
}) => {
  return (
    <div className={`border rounded-2xl p-12 text-center max-w-lg mx-auto my-12 ${
      isDarkMode 
        ? 'bg-[#161f2e] border-slate-800 shadow-xl' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border ${
        isDarkMode 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
          : 'bg-blue-50 text-[#1E3A8A] border-blue-200 shadow-sm'
      }`}>
        <i className="fa-solid fa-bell-slash"></i>
      </div>
      <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        No notifications in this view
      </h3>
      <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {searchQuery
          ? `No notifications found matching "${searchQuery}".`
          : filterType === 'unread'
          ? "You're all caught up! There are no unread notifications in the database."
          : `No notifications found for the "${filterType}" category.`}
      </p>
      {(filterType !== 'all' || searchQuery) && (
        <button
          onClick={onResetFilters}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
              : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border-gray-200'
          }`}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default NotificationEmptyState;
