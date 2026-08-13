import React, { useState } from 'react';
import { Trophy, Plus, Trash2 } from 'lucide-react';

export default function AdminResultsPage() {
  const [results, setResults] = useState([{ student: '', position: '', score: '', remarks: '' }]);

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Publish Results</h1>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 mb-8">
        <label className="block text-sm text-slate-400 mb-2">Select Completed Event</label>
        <select className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500">
          <option>Select Event...</option>
          <option>Hackathon 2026</option>
        </select>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Trophy size={20} className="text-amber-400" /> Enter Results</h2>
          <button onClick={() => setResults([...results, { student: '', position: '', score: '', remarks: '' }])} className="text-sm bg-slate-800 px-3 py-1 rounded flex items-center gap-1 hover:bg-slate-700">
            <Plus size={16} /> Add Row
          </button>
        </div>

        <div className="space-y-4">
          {results.map((res, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <input type="text" placeholder="Student Name / ID" className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <input type="text" placeholder="Position (e.g. 1st)" className="w-32 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <input type="text" placeholder="Score" className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <input type="text" placeholder="Remarks" className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              <button className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">Publish Results</button>
        </div>
      </div>
    </div>
  );
}
