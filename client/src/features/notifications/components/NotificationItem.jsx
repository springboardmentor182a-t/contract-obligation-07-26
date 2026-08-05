import React from 'react';

const NotificationItem = ({
  notification,
  isExpanded,
  isDarkMode,
  onCardClick,
  onActionClick,
  onMarkRead,
  formatTime,
  getSemanticIcon
}) => {
  const n = notification;
  const semantic = getSemanticIcon(n.type);
  const isUnread = !n.is_read;

  return (
    <div
      onClick={() => onCardClick(n)}
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
                    onClick={() => onMarkRead(n.id)}
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
                  onClick={(e) => onActionClick(e, n.link)}
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
};

export default NotificationItem;
