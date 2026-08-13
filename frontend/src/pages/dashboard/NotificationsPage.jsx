import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, ClipboardCheck, Award, Trophy } from 'lucide-react';
import * as notificationService from '../../services/notificationService';
import { timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      const list = res.data?.notifications || res.data || res.notifications || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, isRead: true, read: true } : n));
      toast.success('Marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => (n._id !== id && n.id !== id)));
      toast.success('Notification deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter(n => {
    const isRead = n.isRead || n.read;
    if (tab === 'unread') return !isRead;
    if (tab === 'read') return isRead;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'event': return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'registration': return <ClipboardCheck className="w-5 h-5 text-emerald-400" />;
      case 'certificate': return <Award className="w-5 h-5 text-amber-400" />;
      case 'result': return <Trophy className="w-5 h-5 text-violet-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Stay updated with event alerts and announcements</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors w-fit"
          >
            <Check className="w-4 h-4 text-emerald-400" /> Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        {['all', 'unread', 'read'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(item => {
            const id = item._id || item.id;
            const isRead = item.isRead || item.read;
            return (
              <div
                key={id}
                className={`p-4 rounded-2xl border flex items-start gap-4 transition-colors ${
                  isRead
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900 border-indigo-500/30 text-white shadow-md'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-sm ${isRead ? 'text-slate-300' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <span className="text-xs text-slate-500 shrink-0">{timeAgo(item.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.message}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!isRead && (
                    <button
                      onClick={() => markRead(id)}
                      title="Mark read"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(id)}
                    title="Delete"
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">No notifications</h3>
          <p className="text-slate-500 text-sm">You are all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
