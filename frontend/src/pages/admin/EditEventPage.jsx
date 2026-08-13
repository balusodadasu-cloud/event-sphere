import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Loading...', description: '', category: 'Technical', department: '', club: '', organizer: '',
    date: '', startTime: '', endTime: '', venue: '', maxParticipants: 0, registrationDeadline: '',
    rules: [''], requirements: [''], contactName: '', contactEmail: '', contactPhone: '', posterUrl: ''
  });

  useEffect(() => {
    // Dummy fetch
    setFormData(prev => ({ ...prev, title: `Event ${id}`, date: '2026-10-15', description: 'Existing description' }));
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/events');
    }, 1000);
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Event Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500">
              <option>Technical</option><option>Cultural</option><option>Sports</option><option>Workshop</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-2">Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" rows={4} />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <button type="button" onClick={() => navigate('/admin/events')} className="px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
