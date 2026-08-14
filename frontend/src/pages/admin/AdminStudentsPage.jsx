import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, User, Phone, BookOpen, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as userService from '../../services/userService';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getStudents();
      setStudents(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleToggleStatus = async (student) => {
    setActionLoading(student._id + '-status');
    try {
      const res = await userService.updateUser(student._id, { isActive: !student.isActive });
      const updated = res.data || { ...student, isActive: !student.isActive };
      setStudents(prev => prev.map(s => s._id === student._id ? updated : s));
      if (selectedStudent?._id === student._id) setSelectedStudent(updated);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id + '-delete');
    try {
      await userService.deleteUser(id);
      setStudents(prev => prev.filter(s => s._id !== id));
      setDeleteConfirm(null);
      setSelectedStudent(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete student');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Students</h1>
          <p className="text-slate-400 mt-1">
            {loading ? 'Loading...' : `${students.length} students registered`}
          </p>
        </div>
        <button onClick={fetchStudents} disabled={loading}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : '↻'} Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Search by name, email, ID or dept..."
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
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Student ID</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Dept / Year</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">No students found</td></tr>
                ) : filtered.map(st => (
                  <tr key={st._id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                          {st.name?.charAt(0).toUpperCase()}
                        </div>
                        {st.name}
                      </div>
                    </td>
                    <td className="py-4 font-mono text-slate-400 text-xs">{st.studentId || '—'}</td>
                    <td className="py-4 text-slate-400">{st.email}</td>
                    <td className="py-4">{st.department || '—'}{st.year ? ` · ${st.year}Y` : ''}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${st.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {st.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSelectedStudent(st)} title="View"
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"><Eye size={16} /></button>
                        <button onClick={() => handleToggleStatus(st)} title={st.isActive !== false ? 'Deactivate' : 'Activate'}
                          disabled={actionLoading === st._id + '-status'}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors disabled:opacity-50">
                          {actionLoading === st._id + '-status' ? <Loader2 size={16} className="animate-spin" /> : st.isActive !== false ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button onClick={() => setDeleteConfirm(st)} title="Delete"
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Student Details</h2>
              <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-bold">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                  <p className="text-slate-400 text-sm">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'Student ID', value: selectedStudent.studentId || '—' },
                  { icon: Phone, label: 'Phone', value: selectedStudent.phone || '—' },
                  { icon: BookOpen, label: 'Department', value: selectedStudent.department || '—' },
                  { icon: Calendar, label: 'Year', value: selectedStudent.year ? `${selectedStudent.year} Year` : '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1"><Icon size={11} /> {label}</div>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {selectedStudent.bio && (
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">Bio</p>
                  <p className="text-slate-300 text-sm">{selectedStudent.bio}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleToggleStatus(selectedStudent)} disabled={actionLoading === selectedStudent._id + '-status'}
                  className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  {selectedStudent.isActive !== false ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  {selectedStudent.isActive !== false ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => { setDeleteConfirm(selectedStudent); setSelectedStudent(null); }}
                  className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 text-red-400 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Student?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <strong className="text-white">{deleteConfirm.name}</strong>? This cannot be undone.
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

