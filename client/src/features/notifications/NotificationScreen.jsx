import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

const NotificationScreen = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'obligation', 'renewal', 'approval', 'risk', 'system'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Helper for semantic icons, colors, and human-readable badges
  const getSemanticIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('obligation')) {
      return {
        icon: 'fa-solid fa-clipboard-check',
        badgeColor: isDarkMode
          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
          : 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
        iconContainer: isDarkMode
          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
          : 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm',
        label: 'Obligation Milestone'
      };
    }
    if (t.includes('renewal')) {
      return {
        icon: 'fa-solid fa-calendar-days',
        badgeColor: isDarkMode 
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
          : 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
        iconContainer: isDarkMode
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
          : 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm',
        label: 'Renewal Notice'
      };
    }
    if (t.includes('approval') || t.includes('compliance')) {
      return {
        icon: 'fa-solid fa-circle-check',
        badgeColor: isDarkMode
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
        iconContainer: isDarkMode
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
          : 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm',
        label: 'Legal Approval'
      };
    }
    if (t.includes('risk') || t.includes('danger') || t.includes('warning')) {
      return {
        icon: 'fa-solid fa-shield-halved',
        badgeColor: isDarkMode
          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          : 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
        iconContainer: isDarkMode
          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
          : 'bg-rose-100 text-rose-700 border border-rose-200 shadow-sm',
        label: 'Risk Alert'
      };
    }
    return {
      icon: 'fa-solid fa-bolt',
      badgeColor: isDarkMode
        ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
        : 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
      iconContainer: isDarkMode
        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
        : 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm',
      label: 'System Notification'
    };
  };

  // Format relative timestamp
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      if (diffDay === 1) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts = {
      all: notifications.length,
      unread: notifications.filter(n => !n.is_read).length,
      obligation: 0,
      renewal: 0,
      approval: 0,
      risk: 0,
      system: 0
    };

    notifications.forEach(n => {
      const t = (n.type || '').toLowerCase();
      if (t.includes('obligation')) counts.obligation++;
      else if (t.includes('renewal')) counts.renewal++;
      else if (t.includes('approval') || t.includes('compliance')) counts.approval++;
      else if (t.includes('risk')) counts.risk++;
      else counts.system++;
    });

    return counts;
  }, [notifications]);

  // Filter notifications based on active tab and search input
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Type / Read filter
      if (filterType === 'unread' && n.is_read) return false;
      if (['obligation', 'renewal', 'approval', 'risk', 'system'].includes(filterType)) {
        const t = (n.type || '').toLowerCase();
        if (filterType === 'obligation' && !t.includes('obligation')) return false;
        if (filterType === 'renewal' && !t.includes('renewal')) return false;
        if (filterType === 'approval' && !t.includes('approval') && !t.includes('compliance')) return false;
        if (filterType === 'risk' && !t.includes('risk')) return false;
        if (filterType === 'system' && (t.includes('obligation') || t.includes('renewal') || t.includes('approval') || t.includes('compliance') || t.includes('risk'))) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title?.toLowerCase().includes(q);
        const matchesMsg = n.message?.toLowerCase().includes(q);
        const matchesDetails = n.details?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesDetails) return false;
      }

      return true;
    });
  }, [notifications, filterType, searchQuery]);

  // Group explicitly by "New" and "Earlier"
  const groupedNotifications = useMemo(() => {
    const groups = {
      New: [],
      Earlier: []
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    filteredNotifications.forEach(n => {
      const notifTime = n.created_at ? new Date(n.created_at).getTime() : startOfToday;
      // Item is "New" if it is unread or created today
      if (!n.is_read || notifTime >= startOfToday) {
        groups.New.push(n);
      } else {
        groups.Earlier.push(n);
      }
    });

    return groups;
  }, [filteredNotifications]);

  const handleCardClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setExpandedId(prev => (prev === notification.id ? null : notification.id));
  };

  const handleActionClick = (e, link) => {
    e.stopPropagation();
    if (link) {
      navigate(link);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={`transition-colors duration-300 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
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

      {/* Filter Tabs & Search Control Bar */}
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

      {/* Notifications List Grouped by "New" and "Earlier" */}
      {filteredNotifications.length === 0 ? (
        /* Empty State */
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
              onClick={() => { setFilterType('all'); setSearchQuery(''); }}
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
      ) : (
        <div className="space-y-8 max-w-5xl">
          {['New', 'Earlier'].map((groupKey) => {
            const list = groupedNotifications[groupKey];
            if (!list || list.length === 0) return null;

            return (
              <section key={groupKey} className="space-y-3">
                {/* Group Header */}
                <div className="flex items-center gap-3 px-1">
                  <div className="flex items-center gap-2">
                    {groupKey === 'New' && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {groupKey === 'New' ? 'New Notifications' : 'Earlier'}
                    </span>
                  </div>
                  <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-200'}`}></div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isDarkMode 
                      ? 'text-slate-400 bg-slate-800/80 border-slate-700/50' 
                      : 'text-slate-600 bg-gray-100 border-gray-200'
                  }`}>
                    {list.length}
                  </span>
                </div>

                {/* Cards in Group */}
                <div className="space-y-3">
                  {list.map((n) => {
                    const semantic = getSemanticIcon(n.type);
                    const isUnread = !n.is_read;
                    const isExpanded = expandedId === n.id;

                    return (
                      <div
                        key={n.id || n.notification_id}
                        onClick={() => handleCardClick(n)}
                        className={`group relative rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                          isDarkMode
                            ? (isUnread
                                ? 'bg-slate-800 border-l-4 border-l-blue-500 border-slate-700/80 shadow-[0_4px_20px_rgba(15,23,42,0.6)] hover:border-slate-600 hover:bg-slate-800/90'
                                : 'bg-[#161f2e] border-l-4 border-l-slate-700/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#1a2536]')
                            : (isUnread
                                ? 'bg-white border-l-4 border-l-blue-600 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                                : 'bg-white/80 border-l-4 border-l-slate-300 border-gray-200 shadow-sm hover:shadow-md hover:bg-white hover:border-gray-300')
                        }`}
                      >
                        <div className="p-4 sm:p-5 flex items-start gap-4">
                          {/* Semantic Icon with High Contrast */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-transform group-hover:scale-105 ${semantic.iconContainer}`}
                          >
                            <i className={semantic.icon}></i>
                          </div>

                          {/* Content Body */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {/* Category Badge */}
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${semantic.badgeColor}`}
                              >
                                {semantic.label}
                              </span>

                              {/* Unread Glowing Dot and Badge */}
                              {isUnread && (
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isDarkMode 
                                    ? 'text-blue-400 bg-blue-500/15 border-blue-500/30' 
                                    : 'text-blue-700 bg-blue-50 border-blue-200'
                                }`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)] animate-pulse"></span>
                                  Unread
                                </span>
                              )}

                              {/* Time */}
                              <span className={`text-xs ml-auto flex items-center gap-1 whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                                <i className="fa-regular fa-clock text-[10px]"></i>
                                {formatTime(n.created_at)}
                              </span>
                            </div>

                            {/* Title */}
                            <h3
                              className={`text-sm sm:text-base tracking-tight transition-colors ${
                                isDarkMode
                                  ? (isUnread ? 'text-white font-bold' : 'text-slate-200 font-medium')
                                  : (isUnread ? 'text-slate-900 font-bold' : 'text-slate-800 font-semibold')
                              }`}
                            >
                              {n.title}
                            </h3>

                            {/* Short Message */}
                            <p className={`text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed m-0 ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {n.message}
                            </p>
                          </div>

                          {/* Expand/Collapse Chevron */}
                          <div className={`pt-1 transition-colors ${isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-gray-400 group-hover:text-gray-600'}`}>
                            <i
                              className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-xs transition-transform duration-200`}
                            ></i>
                          </div>
                        </div>

                        {/* Expanded Details Drawer */}
                        {isExpanded && (
                          <div
                            className={`px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t animate-fadeIn ${
                              isDarkMode ? 'border-slate-700/80 bg-slate-900/60' : 'border-gray-100 bg-slate-50/80'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-3 ${
                              isDarkMode 
                                ? 'bg-[#161f2e] border-slate-700/80 text-slate-200' 
                                : 'bg-white border-gray-200 text-slate-700 shadow-sm'
                            }`}>
                              {n.details && (
                                <div>
                                  <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                  }`}>
                                    Action & Audit Details
                                  </span>
                                  <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{n.details}</p>
                                </div>
                              )}

                              <div className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t ${
                                isDarkMode ? 'border-slate-800' : 'border-gray-100'
                              }`}>
                                <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  <span>Database Record ID: </span>
                                  <code className={`px-1.5 py-0.5 rounded text-[10px] ${
                                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-slate-700'
                                  }`}>
                                    {n.notification_id || `NOTIF-${n.id}`}
                                  </code>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isUnread && (
                                    <button
                                      onClick={() => markAsRead(n.id)}
                                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
                                        isDarkMode 
                                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700' 
                                          : 'bg-white hover:bg-gray-100 text-slate-700 border-gray-200 shadow-sm'
                                      }`}
                                    >
                                      Mark Read
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={(e) => handleActionClick(e, n.link)}
                                    className={`px-3.5 py-1.5 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isDarkMode 
                                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' 
                                        : 'bg-[#1E3A8A] hover:bg-[#152a6b] shadow-md'
                                    }`}
                                  >
                                    <span>Take Action</span>
                                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationScreen;
