import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, X, Users, CheckCircle } from 'lucide-react';
import * as clubService from '../../services/clubService';
import * as userService from '../../services/userService';

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [currentClub, setCurrentClub] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    coordinator: '',
    logo: '',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [clubRes, facultyRes] = await Promise.allSettled([
        clubService.getClubs(),
        userService.getFaculty()
      ]);
      if (clubRes.status === 'fulfilled') setClubs(clubRes.value.data || []);
      if (facultyRes.status === 'fulfilled') setFaculty(facultyRes.value.data || []);
    } catch (err) {
      setError('Failed to load clubs data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setFormData({ name: '', department: '', coordinator: '', logo: '', description: '' });
    setCurrentClub(null);
    setModalMode('add');
  };

  const openEditModal = (club) => {
    setCurrentClub(club);
    setFormData({
      name: club.name || '',
      department: club.department || '',
      coordinator: club.coordinator?._id || club.coordinator || '',
      logo: club.logo || '',
      description: club.description || '',
    });
    setModalMode('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        const payload = { ...formData };
        if (!payload.coordinator) delete payload.coordinator;
        const res = await clubService.createClub(payload);
        setClubs(prev => [res.data || res, ...prev]);
        setSuccess('Club created successfully');
      } else {
        const payload = { ...formData };
        if (!payload.coordinator) delete payload.coordinator;
        const res = await clubService.updateClub(currentClub._id, payload);
        const updated = res.data || { ...currentClub, ...payload };
        setClubs(prev => prev.map(c => c._id === currentClub._id ? updated : c));
        setSuccess('Club updated successfully');
      }
      setModalMode(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save club');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await clubService.deleteClub(id);
      setClubs(prev => prev.filter(c => c._id !== id));
      setDeleteConfirm(null);
      setSuccess('Club removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete club');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = clubs.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.department?.toLowerCase().includes(search.toLowerCase()) ||
    c.coordinator?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Clubs & Societies</h1>
          <p className="text-slate-400 mt-1">{loading ? 'Loading...' : `${clubs.length} active clubs`}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} disabled={loading}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
          </button>
          <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus size={18} /> Add Club
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
            placeholder="Search clubs by name, dept, coordinator..." 
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
                  <th className="pb-3 font-medium">Logo</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Coordinator</th>
                  <th className="pb-3 font-medium">Members</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-slate-500">No clubs found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-4">
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          {c.name?.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="py-4 font-medium">{c.name}</td>
                    <td className="py-4 text-slate-400">{c.department || '—'}</td>
                    <td className="py-4">{c.coordinator?.name || (typeof c.coordinator === 'string' ? c.coordinator : '—')}</td>
                    <td className="py-4 font-mono text-slate-400">{c.members?.length || c.memberCount || 0}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${c.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                        {c.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditModal(c)}
                          className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                          title="Edit Club">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(c)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Club">
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

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-indigo-400" />
                {modalMode === 'add' ? 'Add New Club' : 'Edit Club'}
              </h2>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Club Name *</label>
                <input required type="text" placeholder="e.g. Coding Club" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
                <input type="text" placeholder="e.g. CSE, Mechanical, etc." value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Faculty Coordinator</label>
                <select value={formData.coordinator}
                  onChange={e => setFormData({ ...formData, coordinator: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Select Coordinator (Optional)</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id}>{f.name} ({f.department || 'Faculty'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Logo URL</label>
                <input type="url" placeholder="https://..." value={formData.logo}
                  onChange={e => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea rows={3} placeholder="Brief description of the club..." value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm">Cancel</button>
                <button type="submit" disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm disabled:opacity-50 flex items-center gap-2">
                  {actionLoading && <Loader2 size={16} className="animate-spin" />}
                  {modalMode === 'add' ? 'Save Club' : 'Update Club'}
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Club?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteConfirm.name}</strong>?
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

