import React, { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';

export default function AdminCertificatesPage() {
  const [certs] = useState([
    { id: 1, student: 'Alice Johnson', event: 'Hackathon 2026', type: 'Winner', date: '2026-08-10', url: '#' }
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Certificates</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Upload size={20} /> Issue Certificate
        </button>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="pb-3 font-medium">Student</th>
              <th className="pb-3 font-medium">Event</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Issue Date</th>
              <th className="pb-3 font-medium">Link</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id} className="border-b border-slate-800/50">
                <td className="py-4">{c.student}</td><td className="py-4">{c.event}</td>
                <td className="py-4"><span className="text-violet-400">{c.type}</span></td>
                <td className="py-4">{c.date}</td>
                <td className="py-4"><a href={c.url} className="text-indigo-400 hover:underline">View</a></td>
                <td className="py-4 text-right">
                  <button className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Issue Certificate</h2>
            <div className="space-y-4">
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                <option>Select Event</option><option>Hackathon 2026</option>
              </select>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                <option>Select Student</option><option>Alice Johnson</option>
              </select>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                <option>Participation</option><option>Winner</option><option>Runner-up</option>
              </select>
              <input type="url" placeholder="Certificate Image URL" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-700">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-indigo-600">Issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
