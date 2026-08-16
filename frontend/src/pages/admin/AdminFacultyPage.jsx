import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Trash2, Loader2, X, CheckCircle, UserCheck } from 'lucide-react';
import * as userService from '../../services/userService';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getFaculty();
      setFaculty(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleChangeRole = async (user, newRole) => {
    setActionLoading(user._id + '-role');
    try {
      const res = await userService.updateUser(user._id, { role: newRole });
      const updated = res.data || { ...user, role: newRole };
      setFaculty(prev => prev.map(f => f._id === user._id ? updated : f));
      setSelectedFaculty(null);
      setSuccess(`Role updated for ${user.name}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id + '-delete');
    try {
      await userService.deleteUser(id);
      setFaculty(prev => prev.filter(f => f._id !== id));
      setDeleteConfirm(null);
      setSuccess('Faculty member removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete faculty member');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = faculty.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.department?.toLowerCase().includes(search.toLowerCase()) ||
    f.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Faculty & Coordinators</h1>
          <p className="text-slate-400 mt-1">{loading ? 'Loading...' : `${faculty.length} faculty members registered`}</p>
        </div>
        <button onClick={fetchFaculty} disabled={loading}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
        </button>
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
            placeholder="Search faculty by name, email, department..." 
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
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">No faculty members found</td></tr>
                ) : filtered.map(f => (
                  <tr key={f._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                          {f.name?.charAt(0).toUpperCase()}
                        </div>
                        {f.name}
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">{f.email}</td>
                    <td className="py-4">{f.department || '—'}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs capitalize font-medium ${f.role === 'coordinator' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-700 text-slate-300'}`}>
                        {f.role}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">{f.phone || '—'}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSelectedFaculty(f)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Change Role">
                          <ShieldAlert size={18} />
                        </button>
                        <button onClick={() => setDeleteConfirm(f)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete">
                          <Trash2 size={18} />
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

      {/* Change Role Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="text-amber-400" size={20} /> Change Role
              </h3>
              <button onClick={() => setSelectedFaculty(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Select new role for <strong className="text-white">{selectedFaculty.name}</strong>:
            </p>
            <div className="space-y-3 mb-6">
              {['faculty', 'coordinator', 'admin'].map(r => (
                <button key={r} onClick={() => handleChangeRole(selectedFaculty, r)}
                  disabled={actionLoading === selectedFaculty._id + '-role'}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors capitalize text-sm flex items-center justify-between ${selectedFaculty.role === r ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-semibold' : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'}`}>
                  <span>{r}</span>
                  {selectedFaculty.role === r && <CheckCircle size={16} className="text-indigo-400" />}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedFaculty(null)} className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-sm text-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Faculty Member?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={actionLoading === deleteConfirm._id + '-delete'}
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

