import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, User, ChevronRight, Download } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const RegistrationSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const data = state?.registration ?? state;

  useEffect(() => {
    // If no state data, redirect back to events
    if (!data) {
      navigate('/events', { replace: true });
    }
  }, [data, navigate]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10"></div>
      
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
        </div>

        <div className="text-center mt-10 mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Registration Successful! 🎉</h1>
          <p className="text-slate-400">You're all set for the event.</p>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-8">
          <div className="text-center mb-6 pb-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">{data.event?.title ?? data.event ?? 'Your Event'}</h2>
            <div className="flex flex-col gap-2 text-sm text-slate-400 items-center">
              {(data.event?.date || data.date) && (
                <span className="flex items-center"><Calendar size={14} className="mr-2" /> {formatDate(data.event?.date ?? data.date)} at {data.event?.time ?? data.time ?? ''}</span>
              )}
              {(data.event?.venue || data.venue) && (
                <span className="flex items-center"><MapPin size={14} className="mr-2" /> {data.event?.venue ?? data.venue}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm">
              <p className="text-slate-500 mb-1">Attendee</p>
              <p className="text-white font-medium flex items-center"><User size={14} className="mr-2 text-indigo-400" /> {data.student?.name ?? data.studentName ?? 'You'}</p>
            </div>
            <div className="text-sm text-right">
              <p className="text-slate-500 mb-1">Ticket ID</p>
              <p className="text-white font-mono bg-slate-800 px-2 py-1 rounded">{data.registrationId ?? data._id ?? '—'}</p>
            </div>
          </div>

          {data.qrCode && (
            <>
              <div className="flex justify-center mb-2">
                <div className="p-4 bg-white rounded-xl">
                  <img src={data.qrCode} alt="QR Code" className="w-40 h-40" />
                </div>
              </div>
              <p className="text-xs text-center text-slate-500 mt-3">Scan at venue for entry</p>
            </>
          )}
        </div>

        <div className="space-y-3">
          <Link to="/dashboard/registrations" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors">
            View My Registrations <ChevronRight size={18} className="ml-2" />
          </Link>
          <Link to="/events" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
