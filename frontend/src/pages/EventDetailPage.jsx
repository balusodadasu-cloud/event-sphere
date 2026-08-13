import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, Info, Building, Shield,
  ChevronLeft, Bookmark, BookmarkCheck, Phone, Mail, UserCircle,
  Ticket, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import * as eventService from '../services/eventService';
import * as bookmarkService from '../services/bookmarkService';
import * as registrationService from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/events/CountdownTimer';
import EventCard from '../components/events/EventCard';
import RegistrationModal from '../components/events/RegistrationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatTime, isRegistrationOpen, isEventPast } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [myRegistration, setMyRegistration] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);

  const isBookmarked = bookmarks.includes(id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const evRes = await eventService.getEvent(id);
        const ev = evRes.data;
        setEvent(ev);

        // Fetch related events
        const relRes = await eventService.getEvents({ category: ev.category, limit: 4 });
        setRelatedEvents((relRes.data || []).filter(e => e._id !== id).slice(0, 3));

        // Check if user is registered
        if (isAuthenticated) {
          try {
            const myRegsRes = await registrationService.getMyRegistrations();
            const myRegs = myRegsRes.data || [];
            const found = myRegs.find(r => r.event?._id === id || r.event === id);
            setMyRegistration(found || null);
          } catch {}

          try {
            const bmRes = await bookmarkService.getBookmarks();
            const bmIds = (bmRes.data || []).map(b => b.event?._id || b.event);
            setBookmarks(bmIds);
          } catch {}
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated]);

  const toggleBookmark = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(id);
        setBookmarks(b => b.filter(x => x !== id));
        toast.success('Removed from saved events');
      } else {
        await bookmarkService.addBookmark(id);
        setBookmarks(b => [...b, id]);
        toast.success('Event saved!');
      }
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const handleRegisterSuccess = (registration) => {
    setShowRegModal(false);
    navigate('/registration-success', { state: { registration } });
  };

  if (loading) return <LoadingSpinner text="Loading event..." />;
  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
        <Link to="/events" className="btn-primary">Browse Events</Link>
      </div>
    </div>
  );

  const seatsLeft = event.maxParticipants - (event.currentRegistrations || 0);
  const regOpen = isRegistrationOpen(event.registrationDeadline) && seatsLeft > 0 && event.status === 'published';
  const past = isEventPast(event.date);
  const fillPct = event.maxParticipants > 0 ? Math.min(((event.currentRegistrations || 0) / event.maxParticipants) * 100, 100) : 0;

  const renderRegButton = () => {
    if (!isAuthenticated) return (
      <Link to="/login" state={{ from: `/events/${id}` }} className="btn-primary btn-lg w-full justify-center">
        <Ticket className="w-5 h-5" /> Login to Register
      </Link>
    );
    if (myRegistration) return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-semibold">Already Registered</span>
        </div>
        <Link to="/dashboard/registrations" className="btn-outline w-full justify-center">
          View Registration
        </Link>
      </div>
    );
    if (seatsLeft <= 0) return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl">
        <XCircle className="w-5 h-5 text-red-400" />
        <span className="text-red-300 font-semibold">Event Full – No Seats Available</span>
      </div>
    );
    if (!isRegistrationOpen(event.registrationDeadline)) return (
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-400" />
        <span className="text-amber-300 font-semibold">Registration Closed</span>
      </div>
    );
    if (past) return (
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 rounded-xl">
        <Info className="w-5 h-5 text-slate-400" />
        <span className="text-slate-400 font-semibold">Event Completed</span>
      </div>
    );
    return (
      <button onClick={() => setShowRegModal(true)} className="btn-primary btn-lg w-full justify-center">
        <Ticket className="w-5 h-5" /> Register Now
      </button>
    );
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {event.poster ? (
          <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-violet-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link to="/events" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="badge badge-primary mb-3">{event.category}</span>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown */}
            {!past && event.date && (
              <CountdownTimer targetDate={event.date} />
            )}

            {/* Info grid */}
            <div className="glass-card p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Calendar, label: 'Date', value: formatDate(event.date) },
                { icon: Clock, label: 'Time', value: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
                { icon: MapPin, label: 'Venue', value: event.venue },
                { icon: Users, label: 'Registrations', value: `${event.currentRegistrations || 0} / ${event.maxParticipants}` },
                { icon: Building, label: 'Department', value: event.department },
                { icon: Shield, label: 'Status', value: event.status },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/20 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-medium text-white capitalize">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seat progress */}
            <div className="glass-card p-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Seats filled</span>
                <span className="text-white font-medium">{event.currentRegistrations || 0}/{event.maxParticipants} ({seatsLeft} left)</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${fillPct >= 90 ? 'bg-red-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-400" /> About This Event
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Rules */}
            {event.rules?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-400" /> Rules & Guidelines
                </h2>
                <ul className="space-y-2">
                  {event.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {event.requirements?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {event.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Related Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedEvents.map(ev => (
                    <EventCard key={ev._id} event={ev} onBookmark={() => {}} isBookmarked={false} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Registration box */}
            <div className="glass-card p-6 sticky top-24 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Registration Deadline</p>
                <p className="text-white font-semibold">{formatDate(event.registrationDeadline)}</p>
              </div>
              <div className="divider" />
              {renderRegButton()}
              <button
                onClick={toggleBookmark}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  isBookmarked
                    ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {isBookmarked ? 'Saved' : 'Save Event'}
              </button>
            </div>

            {/* Contact */}
            {event.contact && (
              <div className="glass-card p-6 space-y-3">
                <h3 className="font-bold text-white text-sm">Contact</h3>
                {event.contact.name && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <UserCircle className="w-4 h-4 text-primary-400" /> {event.contact.name}
                  </div>
                )}
                {event.contact.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="w-4 h-4 text-primary-400" />
                    <a href={`mailto:${event.contact.email}`} className="hover:text-primary-400">{event.contact.email}</a>
                  </div>
                )}
                {event.contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="w-4 h-4 text-primary-400" /> {event.contact.phone}
                  </div>
                )}
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="glass-card p-6">
                <h3 className="font-bold text-white text-sm mb-3">Organizer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center text-primary-300 font-bold">
                    {event.organizer.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{event.organizer.name}</p>
                    <p className="text-slate-500 text-xs">{event.organizer.department}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}
