import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Power } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setEvents([
      { id: 1, title: 'Hackathon 2026', category: 'Technical', date: '2026-10-15', club: 'Coding Club', registrations: 120, max: 200, status: 'Published', poster: 'https://via.placeholder.com/50' },
      { id: 2, title: 'Dance Battle', category: 'Cultural', date: '2026-11-05', club: 'Dance Club', registrations: 45, max: 100, status: 'Draft', poster: 'https://via.placeholder.com/50' }
    ]);
  }, []);

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <Link to="/admin/events/create" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Create Event
        </Link>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Filter size={20} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-medium">Poster</th>
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
              {events.filter(e => e.title.toLowerCase().includes(search.toLowerCase())).map(ev => (
                <tr key={ev.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-4"><img src={ev.poster} alt={ev.title} className="w-10 h-10 rounded object-cover" /></td>
                  <td className="py-4 font-medium">{ev.title}</td>
                  <td className="py-4">{ev.category}</td>
                  <td className="py-4">{ev.date}</td>
                  <td className="py-4">{ev.club}</td>
                  <td className="py-4">{ev.registrations} / {ev.max}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${ev.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-4 flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"><Eye size={18} /></button>
                    <Link to={`/admin/events/${ev.id}/edit`} className="p-2 text-slate-400 hover:text-violet-400 transition-colors"><Edit size={18} /></Link>
                    <button className="p-2 text-slate-400 hover:text-amber-400 transition-colors"><Power size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
