import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Technical', department: '', club: '', organizer: 'Admin',
    date: '', startTime: '', endTime: '', venue: '', maxParticipants: 0, registrationDeadline: '',
    rules: [''], requirements: [''], contactName: '', contactEmail: '', contactPhone: '', posterUrl: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (index, field, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field) => setFormData({ ...formData, [field]: [...formData[field], ''] });

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
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
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
          <div>
            <label className="block text-sm text-slate-400 mb-2">Date *</label>
            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-2">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-2">End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Venue</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Max Participants</label>
            <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Poster URL</label>
            <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500" />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <button type="button" onClick={() => navigate('/admin/events')} className="px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
