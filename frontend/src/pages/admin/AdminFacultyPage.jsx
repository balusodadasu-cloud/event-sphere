import React, { useState } from 'react';
import { Search, ShieldAlert, Trash2 } from 'lucide-react';

export default function AdminFacultyPage() {
  const [faculty] = useState([
    { id: 1, name: 'Dr. Alan Turing', email: 'alan@college.edu', dept: 'CSE', role: 'Coordinator', phone: '1112223333' },
    { id: 2, name: 'Prof. Marie Curie', email: 'marie@college.edu', dept: 'Physics', role: 'Faculty', phone: '4445556666' }
  ]);
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Faculty</h1>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search faculty..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

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
              {faculty.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-4 font-medium">{f.name}</td>
                  <td className="py-4 text-slate-400">{f.email}</td>
                  <td className="py-4">{f.dept}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${f.role === 'Coordinator' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-700 text-slate-300'}`}>
                      {f.role}
                    </span>
                  </td>
                  <td className="py-4">{f.phone}</td>
                  <td className="py-4 flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-amber-400 transition-colors tooltip" title="Change Role"><ShieldAlert size={18} /></button>
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
