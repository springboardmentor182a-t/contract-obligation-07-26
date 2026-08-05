import React from 'react';

const NotificationHeader = ({
  isDarkMode,
  toggleTheme,
  loading,
  unreadCount,
  fetchNotifications,
  markAllAsRead
}) => {
  return (
    <div>
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-[#1E3A8A]'}`}>
          <i className="fa-solid fa-shield-halved"></i>
          <span>Enterprise Activity Hub</span>
          <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>•</span>
          <span className={`inline-flex items-center gap-1.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            PostgreSQL Database Synced
          </span>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-100 shadow-sm'
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? (
              <>
                <i className="fa-solid fa-sun text-amber-400"></i>
                <span>Light</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-moon text-blue-600"></i>
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Sync Feed Button */}
          <button
            onClick={() => fetchNotifications()}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60' 
                : 'text-slate-700 hover:text-[#1E3A8A] bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
            }`}
            title="Sync latest notifications from PostgreSQL database"
          >
            <i className={`fa-solid fa-rotate ${loading ? 'fa-spin text-blue-500' : ''}`}></i>
            <span>Sync Feed</span>
          </button>
        </div>
      </div>

      {/* Main Header with Title & Mark All Read Action */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
        isDarkMode ? 'border-slate-800/80' : 'border-gray-200'
      }`}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight m-0 ${
              isDarkMode ? 'text-white' : 'text-[#1E3A8A]'
            }`}>
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                isDarkMode 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
              }`}>
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className={`text-sm mt-1 m-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Live monitoring for contract renewals, obligations, risk clauses, approvals, and database audits.
          </p>
        </div>

        {/* Mark all as read Button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className={`self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
              isDarkMode
                ? 'text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border-blue-500/30 hover:border-blue-500 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'text-[#1E3A8A] hover:text-white bg-blue-50 hover:bg-[#1E3A8A] border-blue-200 hover:border-[#1E3A8A] shadow-sm'
            }`}
          >
            <i className="fa-solid fa-check-double"></i>
            <span>Mark all as read</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationHeader;
