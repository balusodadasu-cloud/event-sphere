import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminClubsPage() {
  const [clubs] = useState([
    { id: 1, name: 'Coding Club', dept: 'CSE', coordinator: 'Dr. Alan', members: 120, events: 15, status: 'Active', logo: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Robotics Society', dept: 'ECE', coordinator: 'Prof. Sarah', members: 85, events: 8, status: 'Active', logo: 'https://via.placeholder.com/40' }
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Clubs</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Club
        </button>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
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
              {clubs.map(c => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-4"><img src={c.logo} alt={c.name} className="w-8 h-8 rounded-full" /></td>
                  <td className="py-4 font-medium">{c.name}</td>
                  <td className="py-4">{c.dept}</td>
                  <td className="py-4">{c.coordinator}</td>
                  <td className="py-4">{c.members}</td>
                  <td className="py-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">{c.status}</span></td>
                  <td className="py-4 flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-violet-400 transition-colors"><Edit size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Club</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Club Name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <input type="text" placeholder="Department" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <input type="text" placeholder="Coordinator Name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <input type="url" placeholder="Logo URL" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700">Save Club</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
