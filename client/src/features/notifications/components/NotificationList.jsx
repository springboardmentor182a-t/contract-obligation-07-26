import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({
  groupedNotifications,
  expandedId,
  isDarkMode,
  onCardClick,
  onActionClick,
  onMarkRead,
  formatTime,
  getSemanticIcon
}) => {
  return (
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
              {list.map((n) => (
                <NotificationItem
                  key={n.id || n.notification_id}
                  notification={n}
                  isExpanded={expandedId === n.id}
                  isDarkMode={isDarkMode}
                  onCardClick={onCardClick}
                  onActionClick={onActionClick}
                  onMarkRead={onMarkRead}
                  formatTime={formatTime}
                  getSemanticIcon={getSemanticIcon}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default NotificationList;
