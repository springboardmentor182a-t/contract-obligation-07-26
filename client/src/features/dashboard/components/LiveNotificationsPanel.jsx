import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';

export const LiveNotificationsPanel = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, loading: notifLoading } = useNotifications();
  const dashboardFeed = notifications.slice(0, 4);

  const getSemanticIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('renewal')) {
      return { icon: 'fa-solid fa-calendar-days', color: isDarkMode ? 'text-amber-400' : 'text-amber-700', bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50', border: isDarkMode ? 'border-amber-500/30' : 'border-amber-200' };
    }
    if (t.includes('approval') || t.includes('compliance')) {
      return { icon: 'fa-solid fa-circle-check', color: isDarkMode ? 'text-emerald-400' : 'text-emerald-700', bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200' };
    }
    if (t.includes('risk') || t.includes('danger') || t.includes('warning')) {
      return { icon: 'fa-solid fa-shield-halved', color: isDarkMode ? 'text-rose-400' : 'text-rose-700', bg: isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50', border: isDarkMode ? 'border-rose-500/30' : 'border-rose-200' };
    }
    if (t.includes('obligation')) {
      return { icon: 'fa-solid fa-clipboard-check', color: isDarkMode ? 'text-blue-400' : 'text-blue-700', bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50', border: isDarkMode ? 'border-blue-500/30' : 'border-blue-200' };
    }
    return { icon: 'fa-solid fa-bolt', color: isDarkMode ? 'text-purple-400' : 'text-purple-700', bg: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50', border: isDarkMode ? 'border-purple-500/30' : 'border-purple-200' };
  };

  const formatShortTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const diffSec = Math.floor((new Date() - date) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className={`rounded-xl border p-5 sm:p-6 transition-all ${isDarkMode ? 'bg-[#161F2E] border-[#2A364F] shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className={`flex items-center justify-between pb-4 mb-4 border-b ${isDarkMode ? 'border-[#2A364F]' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isDarkMode ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <i className="fa-solid fa-bell"></i>
          </div>
          <div>
            <h2 className={`text-sm sm:text-base font-bold m-0 ${isDarkMode ? 'text-white' : 'text-[#1E293B]'}`}>Live Database Notifications & Alerts</h2>
            <span className={`text-[11px] ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-500'}`}>Directly queried from PostgreSQL <code className={`text-[10px] px-1 py-0.5 rounded ${isDarkMode ? 'bg-[#0B1121] text-slate-300' : 'bg-slate-100 text-slate-700'}`}>notifications</code> table</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{unreadCount} Unread</span>}
          <button onClick={() => navigate('/notifications')} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${isDarkMode ? 'bg-[#0B1121] hover:bg-slate-800 text-blue-400 border-[#2A364F]' : 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-200 shadow-sm'}`}>
            <span>View All Feed</span><i className="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
          </button>
        </div>
      </div>
      {dashboardFeed.length === 0 ? (
        <div className={`py-6 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{notifLoading ? 'Fetching notifications from database...' : 'No notifications in database.'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {dashboardFeed.map((item) => {
            const iconStyle = getSemanticIcon(item.type);
            const isUnread = !item.is_read;
            return (
              <div key={item.id || item.notification_id} onClick={() => { if (isUnread) markAsRead(item.id); if (item.link) navigate(item.link); else navigate('/notifications'); }} className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${isDarkMode ? (isUnread ? 'bg-[#0B1121] border-blue-500/40 hover:border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[#0B1121]/60 border-[#2A364F] hover:bg-[#0B1121] text-slate-300') : (isUnread ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/70 shadow-sm' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-700')}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border ${iconStyle.bg} ${iconStyle.color} ${iconStyle.border}`}><i className={iconStyle.icon}></i></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className={`text-xs truncate font-bold ${isDarkMode ? (isUnread ? 'text-white' : 'text-slate-200') : (isUnread ? 'text-[#1E293B]' : 'text-slate-700')}`}>{item.title}</h3>
                    <span className={`text-[10px] whitespace-nowrap ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatShortTime(item.created_at)}</span>
                  </div>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed m-0 ${isDarkMode ? 'text-[#8E9BAE]' : 'text-[#64748B]'}`}>{item.message}</p>
                </div>
                {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
