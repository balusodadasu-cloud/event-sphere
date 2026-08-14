import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as registrationService from '../../services/registrationService';

export default function RegistrationModal({ event, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registrationService.register(event._id, { teamName });
      const registration = res.data;
      onClose();
      const successData = {
        event: { title: event.title, date: event.date, time: event.time, venue: event.venue },
        registrationId: registration.registrationId || registration._id,
        qrCode: registration.qrCode || null,
      };
      if (onSuccess) onSuccess(successData);
      else navigate('/registration-success', { state: { registration: successData } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-1 rounded-full z-10"><X size={20} /></button>
        
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-2">Register for Event</h2>
          <h3 className="text-indigo-400 font-medium text-lg">{event.title}</h3>
        </div>

        <div className="p-6 bg-slate-800/30">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-slate-300"><Calendar size={18} className="text-slate-500" /> <span className="text-sm">{event.date}</span></div>
            <div className="flex items-center gap-2 text-slate-300"><MapPin size={18} className="text-slate-500" /> <span className="text-sm">{event.venue || 'TBA'}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {event.maxParticipants > 1 && (
              <div>
                <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2"><Users size={16} /> Team Name (Optional)</label>
                <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Enter team name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none" />
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-sm text-red-400">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg text-sm text-indigo-300 mb-4">
              By confirming, you agree to abide by the rules and regulations of this event.
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2">
                {loading ? 'Processing...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
