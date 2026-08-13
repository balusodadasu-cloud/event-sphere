import React, { useState } from 'react';
import { Search, Eye, Trash2 } from 'lucide-react';

export default function AdminStudentsPage() {
  const [students] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@student.edu', studentId: 'S1001', dept: 'CSE', year: '3', phone: '1234567890', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@student.edu', studentId: 'S1002', dept: 'ECE', year: '2', phone: '0987654321', status: 'Active' },
  ]);
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Students</h1>
          <p className="text-slate-400">Total Students: {students.length}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

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
              {students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())).map(st => (
                <tr key={st.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-4 font-medium">{st.name}</td>
                  <td className="py-4">{st.studentId}</td>
                  <td className="py-4 text-slate-400">{st.email}</td>
                  <td className="py-4">{st.dept} - {st.year} Year</td>
                  <td className="py-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">{st.status}</span></td>
                  <td className="py-4 flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"><Eye size={18} /></button>
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
