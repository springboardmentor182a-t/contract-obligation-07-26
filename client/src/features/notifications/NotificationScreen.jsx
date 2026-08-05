import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

import NotificationHeader from './components/NotificationHeader';
import NotificationFilters from './components/NotificationFilters';
import NotificationList from './components/NotificationList';
import NotificationEmptyState from './components/NotificationEmptyState';

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

  const handleResetFilters = () => {
    setFilterType('all');
    setSearchQuery('');
  };

  return (
    <div className={`transition-colors duration-300 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* 1. Header & Status Bar */}
      <NotificationHeader
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        loading={loading}
        unreadCount={unreadCount}
        fetchNotifications={fetchNotifications}
        markAllAsRead={markAllAsRead}
      />

      {/* 2. Filter Tabs & Search Controls */}
      <NotificationFilters
        filterType={filterType}
        setFilterType={setFilterType}
        categoryCounts={categoryCounts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
      />

      {/* 3. Notifications List or Empty State */}
      {filteredNotifications.length === 0 ? (
        <NotificationEmptyState
          searchQuery={searchQuery}
          filterType={filterType}
          onResetFilters={handleResetFilters}
          isDarkMode={isDarkMode}
        />
      ) : (
        <NotificationList
          groupedNotifications={groupedNotifications}
          expandedId={expandedId}
          isDarkMode={isDarkMode}
          onCardClick={handleCardClick}
          onActionClick={handleActionClick}
          onMarkRead={markAsRead}
          formatTime={formatTime}
          getSemanticIcon={getSemanticIcon}
        />
      )}
    </div>
  );
};

export default NotificationScreen;
