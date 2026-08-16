import React, { useState, useEffect } from 'react';
import { Send, Bell, Loader2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import * as eventService from '../../services/eventService';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    targetAudience: 'All Students',
    type: 'system',
    title: '',
    message: '',
    eventId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifsRes, eventsRes] = await Promise.allSettled([
        api.get('/notifications/all').catch(() => api.get('/notifications')),
        eventService.getEvents({ limit: 100 })
      ]);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value.data?.data || []);
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data?.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      setFeedback({ type: 'error', message: 'Title and message are required' });
      return;
    }
    setSending(true);
    setFeedback({ type: '', message: '' });
    try {
      const payload = {
        targetAudience: formData.targetAudience,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        eventId: formData.targetAudience === 'Specific Event Participants' ? formData.eventId : undefined,
      };
      const res = await api.post('/notifications', payload);
      setFeedback({ type: 'success', message: res.data?.message || 'Notification broadcasted successfully!' });
      setFormData({ targetAudience: 'All Students', type: 'system', title: '', message: '', eventId: '' });
      fetchData();
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to send notification' });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete notification');
    }
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage & Broadcast Notifications</h1>
        <button onClick={fetchData} disabled={loading}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
        </button>
      </div>

      {feedback.message && (
        <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 border ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Send size={20} className="text-indigo-400" /> Broadcast Notification
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Audience</label>
              <select value={formData.targetAudience}
                onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                <option>All Students</option>
                <option>All Faculty</option>
                <option>All Users</option>
                <option>Specific Event Participants</option>
              </select>
            </div>

            {formData.targetAudience === 'Specific Event Participants' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Event *</label>
                <select required value={formData.eventId}
                  onChange={e => setFormData({ ...formData, eventId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Select Event</option>
                  {events.map(ev => (
                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Notification Type</label>
              <select value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                <option value="system">System</option>
                <option value="event">Event Update</option>
                <option value="registration">Registration Notice</option>
                <option value="certificate">Certificate Announcement</option>
                <option value="result">Results Announcement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Title *</label>
              <input required type="text" placeholder="e.g. Hackathon Schedule Update"
                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Message *</label>
              <textarea required rows={4} placeholder="Write the announcement message here..."
                value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <button type="submit" disabled={sending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? 'Sending...' : 'Send Broadcast'}
            </button>
          </form>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <Bell size={20} className="text-violet-400" /> Recent Notifications
            </h2>
            <span className="text-xs text-slate-400">{notifications.length} logged</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No notifications sent yet</div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {notifications.map(n => (
                <div key={n._id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white text-sm">{n.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{n.createdAt?.slice(0, 10) || ''}</span>
                      <button onClick={() => handleDelete(n._id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs mb-3 line-clamp-2">{n.message}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-md uppercase font-semibold text-[10px]">
                      {n.type || 'system'}
                    </span>
                    <span className="text-slate-400">
                      {n.user?.name ? `To: ${n.user.name}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

