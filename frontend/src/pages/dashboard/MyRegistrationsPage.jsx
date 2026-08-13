import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, CalendarX2, CheckCircle2, AlertCircle } from 'lucide-react';
import * as registrationService from '../../services/registrationService';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    fetchRegs();
  }, []);

  const fetchRegs = async () => {
    try {
      setLoading(true);
      const res = await registrationService.getMyRegistrations();
      setRegistrations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if(window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        await registrationService.cancelRegistration(id);
        fetchRegs();
      } catch (err) {
        alert('Failed to cancel registration');
      }
    }
  }

  const now = new Date();
  
  const filteredRegs = registrations.filter(r => {
    if (r.status === 'cancelled') return tab === 'cancelled';
    const eventDate = new Date(r.event?.date);
    if (tab === 'upcoming') return eventDate >= now;
    if (tab === 'past') return eventDate < now;
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">My Registrations</h1>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-px overflow-x-auto custom-scrollbar">
        {['upcoming', 'past', 'cancelled'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRegs.length > 0 ? (
        <div className="grid gap-4">
          {filteredRegs.map(reg => (
            <div key={reg._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase tracking-wider ${
                    reg.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 
                    tab === 'past' ? 'bg-slate-800 text-slate-300' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {reg.status || 'Registered'}
                  </span>
                  <span className="text-sm text-slate-500 font-mono">ID: {reg._id.slice(-6)}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-1">{reg.event?.title || 'Unknown Event'}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-4">
                  <span>📅 {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'TBA'}</span>
                  <span>📍 {reg.event?.venue || 'TBA'}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                {tab === 'upcoming' && reg.status !== 'cancelled' && (
                  <button onClick={() => handleCancel(reg._id)} className="flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors">
                    Cancel
                  </button>
                )}
                <Link to={`/events/${reg.event?._id}`} className="flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors text-center border border-slate-700">
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-1">No {tab} registrations</h3>
          <p className="text-slate-500">You don't have any {tab} event registrations yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;
