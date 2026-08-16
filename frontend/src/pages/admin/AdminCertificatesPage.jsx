import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Search, Loader2, X, Award, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import * as certificateService from '../../services/certificateService';
import * as eventService from '../../services/eventService';
import * as userService from '../../services/userService';

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    eventId: '',
    studentId: '',
    certificateType: 'Participation',
    certificateUrl: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [certRes, eventRes, studentRes] = await Promise.allSettled([
        api.get('/certificates/all').catch(() => api.get('/certificates/my')),
        eventService.getEvents({ limit: 100 }),
        userService.getStudents(),
      ]);

      if (certRes.status === 'fulfilled') setCerts(certRes.value.data?.data || []);
      if (eventRes.status === 'fulfilled') setEvents(eventRes.value.data?.data || []);
      if (studentRes.status === 'fulfilled') setStudents(studentRes.value.data?.data || []);
    } catch {
      setError('Failed to load certificates data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!formData.eventId || !formData.studentId) {
      alert('Please select both an event and a student');
      return;
    }
    setActionLoading(true);
    try {
      const res = await certificateService.uploadCertificate(formData);
      setSuccess('Certificate issued successfully');
      setShowModal(false);
      setFormData({ eventId: '', studentId: '', certificateType: 'Participation', certificateUrl: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await certificateService.deleteCertificate(id);
      setCerts(prev => prev.filter(c => c._id !== id));
      setDeleteConfirm(null);
      setSuccess('Certificate removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete certificate');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = certs.filter(c =>
    c.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Certificates</h1>
          <p className="text-slate-400 mt-1">{loading ? 'Loading...' : `${certs.length} certificates issued`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} disabled={loading}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
          </button>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Upload size={18} /> Issue Certificate
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by student, event, type..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Event</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Issue Date</th>
                  <th className="pb-3 font-medium">Certificate Link</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">No certificates found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-4">
                      <div className="font-medium">{c.student?.name || '—'}</div>
                      <div className="text-xs text-slate-500">{c.student?.email || ''}</div>
                    </td>
                    <td className="py-4">{c.event?.title || '—'}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 font-medium rounded-md text-xs">
                        {c.certificateType || c.type || 'Participation'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">{c.createdAt?.slice(0, 10) || c.date || '—'}</td>
                    <td className="py-4">
                      {c.certificateUrl || c.url ? (
                        <a href={c.certificateUrl || c.url} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs">
                          View Certificate <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">Generated System Cert</span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end">
                        <button onClick={() => setDeleteConfirm(c)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Certificate">
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

      {/* Issue Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award size={20} className="text-amber-400" /> Issue Certificate
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleIssue} className="space-y-4">
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
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Student *</label>
                <select required value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Select Student</option>
                  {students.map(st => (
                    <option key={st._id} value={st._id}>{st.name} ({st.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Certificate Type *</label>
                <select value={formData.certificateType}
                  onChange={e => setFormData({ ...formData, certificateType: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="Participation">Participation</option>
                  <option value="Winner">Winner</option>
                  <option value="Runner-up">Runner-up</option>
                  <option value="Merit">Merit</option>
                  <option value="Organizer">Organizer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Certificate Image / PDF URL</label>
                <input type="url" placeholder="https://..." value={formData.certificateUrl}
                  onChange={e => setFormData({ ...formData, certificateUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm">Cancel</button>
                <button type="submit" disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm disabled:opacity-50 flex items-center gap-2">
                  {actionLoading && <Loader2 size={16} className="animate-spin" />} Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Certificate?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Remove certificate for <strong className="text-white">{deleteConfirm.student?.name || 'student'}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

