import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const [regs] = useState([
    { id: 'REG-1001', student: 'Alice Johnson', event: 'Hackathon 2026', date: '2026-08-01', status: 'Confirmed', attendance: 'Present' },
    { id: 'REG-1002', student: 'Bob Smith', event: 'Dance Battle', date: '2026-08-02', status: 'Pending', attendance: 'N/A' },
  ]);
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Registrations</h1>
        <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Download size={20} /> Export CSV
        </button>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by ID or Student..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-medium">Reg ID</th>
                <th className="pb-3 font-medium">Student Name</th>
                <th className="pb-3 font-medium">Event Title</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {regs.filter(r => r.student.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())).map(r => (
                <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-4 font-mono text-slate-400">{r.id}</td>
                  <td className="py-4 font-medium">{r.student}</td>
                  <td className="py-4">{r.event}</td>
                  <td className="py-4">{r.date}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${r.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4">{r.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
