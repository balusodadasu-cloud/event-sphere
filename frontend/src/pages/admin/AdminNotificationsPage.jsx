import React, { useState } from 'react';
import { Send, Bell } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [recent] = useState([
    { id: 1, title: 'System Maintenance', type: 'system', recipient: 'All Users', date: '2026-08-07' },
    { id: 2, title: 'Hackathon Rescheduled', type: 'event', recipient: 'Hackathon Participants', date: '2026-08-06' }
  ]);

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Send size={20} className="text-indigo-400" /> Send Notification</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Target Audience</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                <option>All Students</option><option>All Faculty</option><option>Specific Event Participants</option><option>Specific User ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Notification Type</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                <option>System</option><option>Event Update</option><option>Reminder</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Title</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Message</label>
              <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-medium">Send Notification</button>
          </form>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell size={20} className="text-violet-400" /> Recent Notifications</h2>
          <div className="space-y-4">
            {recent.map(n => (
              <div key={n.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{n.title}</h3>
                  <span className="text-xs text-slate-400">{n.date}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded">{n.type}</span>
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded">To: {n.recipient}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
