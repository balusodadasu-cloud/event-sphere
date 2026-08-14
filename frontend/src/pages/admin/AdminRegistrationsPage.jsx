import React, { useState, useEffect } from 'react';
import { Search, Download, Loader2, X, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function AdminRegistrationsPage() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      // Admin can fetch all registrations via events, or use a general query
      // We use the getMyRegistrations endpoint scoped to all since admin role passes auth
      const res = await api.get('/registrations/all');
      setRegs(res.data?.data || []);
    } catch (err) {
      // Fallback: try fetching via /registrations with admin token
      try {
        const res2 = await api.get('/registrations');
        setRegs(res2.data?.data || []);
      } catch {
        setError(err?.response?.data?.message || 'Failed to load registrations');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    setActionLoading(id);
    try {
      await api.put(`/registrations/${id}/cancel`);
      setRegs(prev => prev.map(r => r._id === id ? { ...r, status: 'cancelled' } : r));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Reg ID,Student,Email,Event,Date,Status'];
    const rows = filtered.map(r =>
      `${r.registrationId || r._id},${r.student?.name || '—'},${r.student?.email || '—'},${r.event?.title || '—'},${r.createdAt?.slice(0, 10) || '—'},${r.status}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'registrations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = regs.filter(r =>
    r.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.registrationId?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    registered: 'bg-green-500/20 text-green-400',
    confirmed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    pending: 'bg-amber-500/20 text-amber-400',
    attended: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">All Registrations</h1>
          <p className="text-slate-400 mt-1">{loading ? 'Loading...' : `${regs.length} total registrations`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchRegistrations} disabled={loading}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
          </button>
          <button onClick={handleExportCSV}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Search by student, event or reg ID..."
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
                  <th className="pb-3 font-medium">Reg ID</th>
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Event</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">No registrations found</td></tr>
                ) : filtered.map(r => (
                  <tr key={r._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-4 font-mono text-slate-400 text-xs">{r.registrationId || r._id?.slice(-8)}</td>
                    <td className="py-4">
                      <div className="font-medium">{r.student?.name || '—'}</div>
                      <div className="text-xs text-slate-500">{r.student?.email || ''}</div>
                    </td>
                    <td className="py-4">{r.event?.title || '—'}</td>
                    <td className="py-4 text-slate-400">{r.createdAt?.slice(0, 10) || '—'}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.status] || 'bg-slate-700 text-slate-300'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-1">
                        {r.status !== 'cancelled' && (
                          <button onClick={() => handleCancel(r._id)}
                            disabled={actionLoading === r._id}
                            title="Cancel Registration"
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50">
                            {actionLoading === r._id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                          </button>
                        )}
                        {r.status === 'registered' && (
                          <button title="Mark Attended"
                            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors">
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
}
