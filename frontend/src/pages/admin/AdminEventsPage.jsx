import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, Power, Loader2 } from 'lucide-react';
import * as eventService from '../../services/eventService';
import { formatDate } from '../../utils/helpers';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await eventService.getEvents({ limit: 100 });
      setEvents(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleTogglePublish = async (ev) => {
    setActionLoading(ev._id + '-publish');
    const newStatus = ev.status === 'published' ? 'draft' : 'published';
    try {
      const res = await eventService.updateEvent(ev._id, { status: newStatus });
      const updated = res.data || { ...ev, status: newStatus };
      setEvents(prev => prev.map(e => e._id === ev._id ? updated : e));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update event status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id + '-delete');
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete event');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase()) ||
    e.club?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    published: 'bg-green-500/20 text-green-400',
    draft: 'bg-slate-700 text-slate-300',
    cancelled: 'bg-red-500/20 text-red-400',
    completed: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <p className="text-slate-400 mt-1">{loading ? 'Loading...' : `${events.length} events`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchEvents} disabled={loading}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
          </button>
          <Link to="/admin/events/create" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus size={18} /> Create Event
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Search events..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Club</th>
                  <th className="pb-3 font-medium">Reg / Max</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-slate-500">No events found</td></tr>
                ) : filtered.map(ev => (
                  <tr key={ev._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-4 font-medium max-w-[200px]">
                      <div className="flex items-center gap-3">
                        {ev.poster && <img src={ev.poster} alt={ev.title} className="w-8 h-8 rounded object-cover shrink-0" />}
                        <span className="truncate">{ev.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">{ev.category}</td>
                    <td className="py-4 text-slate-400">{ev.date ? formatDate(ev.date) : '—'}</td>
                    <td className="py-4">{ev.club?.name || '—'}</td>
                    <td className="py-4">{ev.currentRegistrations || 0} / {ev.maxParticipants || '∞'}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[ev.status] || 'bg-slate-700 text-slate-300'}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-1">
                        <Link to={`/events/${ev._id}`} title="View"
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/admin/events/${ev._id}/edit`} title="Edit"
                          className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleTogglePublish(ev)}
                          disabled={actionLoading === ev._id + '-publish'}
                          title={ev.status === 'published' ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${ev.status === 'published' ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-slate-400 hover:text-green-400 hover:bg-green-500/10'}`}>
                          {actionLoading === ev._id + '-publish' ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                        </button>
                        <button onClick={() => setDeleteConfirm(ev)} title="Delete"
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Event?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Delete <strong className="text-white">"{deleteConfirm.title}"</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)}
                disabled={actionLoading === deleteConfirm._id + '-delete'}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading === deleteConfirm._id + '-delete' ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
