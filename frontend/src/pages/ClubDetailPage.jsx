import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, Calendar } from 'lucide-react';
import api from '../services/api';
import EventGrid from '../components/events/EventGrid';

const ClubDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        setLoading(true);
        const clubRes = await api.get(`/clubs/${id}`);
        setClub(clubRes.data?.data || clubRes.data);
        
        const eventsRes = await api.get(`/events?club=${id}`);
        const eventsData = eventsRes.data?.data || eventsRes.data?.events || [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        setError('Failed to load club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClubDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <p className="text-xl mb-4 text-red-400">{error || 'Club not found'}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          {club.coverImage && <img src={club.coverImage} alt="Cover" className="w-full h-full object-cover opacity-40" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        <div className="absolute bottom-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex items-end gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-800 border-4 border-slate-950 flex-shrink-0 overflow-hidden">
            {club.logo ? (
              <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-full h-full p-6 text-slate-400" />
            )}
          </div>
          <div className="pb-2">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{club.name}</h1>
            <p className="text-indigo-400 font-medium">{club.category || 'Student Club'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-white">About Us</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{club.description || 'No description available.'}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-400" /> Club Events
              </h2>
              {events.length > 0 ? (
                <EventGrid events={events} />
              ) : (
                <p className="text-slate-500 bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">No upcoming events found for this club.</p>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-white">Coordinator Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{club.coordinatorName || 'Coordinator'}</p>
                    <p className="text-sm text-slate-400">Head Coordinator</p>
                  </div>
                </div>
                {club.email && (
                  <a href={`mailto:${club.email}`} className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-800/50">
                    <Mail className="w-5 h-5" />
                    <span>{club.email}</span>
                  </a>
                )}
                {club.phone && (
                  <a href={`tel:${club.phone}`} className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-800/50">
                    <Phone className="w-5 h-5" />
                    <span>{club.phone}</span>
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;
