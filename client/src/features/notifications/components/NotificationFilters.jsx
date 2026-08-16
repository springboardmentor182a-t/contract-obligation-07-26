import React from 'react';

const NotificationFilters = ({
  filterType,
  setFilterType,
  categoryCounts,
  searchQuery,
  setSearchQuery,
  isDarkMode
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-6 mb-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {/* All Tab */}
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'all'
              ? (isDarkMode ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-[#1E3A8A] text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <i className={`fa-solid fa-layer-group text-xs ${filterType === 'all' ? 'text-white' : (isDarkMode ? 'text-blue-400' : 'text-[#1E3A8A]')}`}></i>
          <span>All ({categoryCounts.all})</span>
        </button>

        {/* Unread Tab */}
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'unread'
              ? (isDarkMode ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-[#1E3A8A] text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filterType === 'unread' ? 'bg-white' : 'bg-blue-500 animate-pulse'}`}></span>
          <span>Unread ({categoryCounts.unread})</span>
        </button>

        {/* Obligations Tab */}
        <button
          onClick={() => setFilterType('obligation')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'obligation'
              ? (isDarkMode ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-blue-600 text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <i className={`fa-solid fa-clipboard-check text-xs ${filterType === 'obligation' ? 'text-white' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')}`}></i>
          <span>Obligations ({categoryCounts.obligation})</span>
        </button>

        {/* Renewals Tab */}
        <button
          onClick={() => setFilterType('renewal')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'renewal'
              ? (isDarkMode ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-amber-600 text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <i className={`fa-solid fa-calendar-days text-xs ${filterType === 'renewal' ? 'text-white' : (isDarkMode ? 'text-amber-400' : 'text-amber-600')}`}></i>
          <span>Renewals ({categoryCounts.renewal})</span>
        </button>

        {/* Approvals Tab */}
        <button
          onClick={() => setFilterType('approval')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'approval'
              ? (isDarkMode ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-emerald-600 text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <i className={`fa-solid fa-circle-check text-xs ${filterType === 'approval' ? 'text-white' : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')}`}></i>
          <span>Approvals ({categoryCounts.approval})</span>
        </button>

        {/* Risk Alerts Tab */}
        <button
          onClick={() => setFilterType('risk')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'risk'
              ? (isDarkMode ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]' : 'bg-rose-600 text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <i className={`fa-solid fa-shield-halved text-xs ${filterType === 'risk' ? 'text-white' : (isDarkMode ? 'text-rose-400' : 'text-rose-600')}`}></i>
          <span>Risk Alerts ({categoryCounts.risk})</span>
        </button>

        {/* System Tab */}
        <button
          onClick={() => setFilterType('system')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filterType === 'system'
              ? (isDarkMode ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]' : 'bg-purple-600 text-white shadow-md')
              : (isDarkMode ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : 'bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 border border-gray-200 shadow-sm')
          }`}
        >
          <i className={`fa-solid fa-bolt text-xs ${filterType === 'system' ? 'text-white' : (isDarkMode ? 'text-purple-400' : 'text-purple-600')}`}></i>
          <span>System ({categoryCounts.system})</span>
        </button>
      </div>

      {/* Search Box */}
      <div className="relative min-w-[240px]">
        <i className={`fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}></i>
        <input
          type="text"
          placeholder="Search by keyword, contract, or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full rounded-xl pl-9 pr-8 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 ${
            isDarkMode
              ? 'bg-[#161f2e] border border-slate-700/70 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500'
              : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:border-[#1E3A8A] focus:ring-[#1E3A8A] shadow-sm'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} cursor-pointer`}
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters;
