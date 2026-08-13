import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, Shield, Zap, Search, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';
import * as eventService from '../services/eventService';
import * as clubService from '../services/clubService';
import EventCard from '../components/events/EventCard';
import Footer from '../components/layout/Footer';
import { EVENT_CATEGORIES } from '../utils/constants';

const LandingPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [popularClubs, setPopularClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [eventsRes, clubsRes] = await Promise.all([
          eventService.getEvents({ limit: 6 }),
          clubService.getClubs()
        ]);
        setUpcomingEvents(eventsRes.data || []);
        setPopularClubs(clubsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="z-10 max-w-4xl text-center space-y-8 mt-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 animate-gradient-x">
            Campus Connect
          </h1>
          <p className="text-2xl md:text-3xl font-light text-slate-300">
            One Campus. Every Event. Stay Connected.
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover, register, and manage your college events seamlessly. Join clubs, participate in workshops, and build your digital portfolio all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/events" className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 w-full sm:w-auto justify-center">
              Explore Events <Search size={20} />
            </Link>
            <Link to="/register" className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all border border-slate-700 w-full sm:w-auto text-center">
              Get Started
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="w-full max-w-6xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/50">
          {[
            { label: 'Events Hosted', value: '250+', icon: Calendar },
            { label: 'Registered Students', value: '5000+', icon: Users },
            { label: 'Active Clubs', value: '40+', icon: Shield },
            { label: 'Certificates Issued', value: '1200+', icon: Award },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
              <stat.icon className="text-indigo-400 mb-2" size={32} />
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-slate-400">Don't miss out on these exciting opportunities.</p>
          </div>
          <Link to="/events" className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
            View All <ChevronRight size={20} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex space-x-6 overflow-x-auto pb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[320px] h-[400px] bg-slate-900 rounded-2xl animate-pulse flex-shrink-0"></div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="flex overflow-x-auto pb-12 -mx-6 px-6 gap-6 snap-x snap-mandatory hide-scrollbar">
            {upcomingEvents.map(event => (
              <div key={event._id || event.id} className="min-w-[320px] md:min-w-[380px] snap-center flex-shrink-0">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800/50">
            <Calendar className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No upcoming events</h3>
            <p className="text-slate-500">Check back later for new events.</p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {EVENT_CATEGORIES.map((cat, i) => (
              <Link 
                key={i} 
                to={`/events?category=${encodeURIComponent(cat)}`}
                className="group p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col items-center text-center gap-4"
              >
                <div className="p-4 rounded-2xl bg-slate-950 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-indigo-400" size={32} />
                </div>
                <span className="font-medium text-slate-300 group-hover:text-white">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Campus Connect */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Why Campus Connect?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Centralized Platform', desc: 'All campus events, clubs, and registrations in one accessible place.', icon: Search },
            { title: 'Instant Registration', desc: 'Register for events with a single click. No more long Google forms.', icon: Zap },
            { title: 'Smart Notifications', desc: 'Get timely updates about upcoming events and registration deadlines.', icon: Award },
            { title: 'Easy Access', desc: 'View your tickets, certificates, and event history anytime, anywhere.', icon: Shield },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
              <feature.icon className="text-indigo-400 mb-6" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-20">How It Works</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 -translate-y-1/2"></div>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: '01', title: 'Register Account', desc: 'Create your student profile with your department and interests.' },
                { step: '02', title: 'Browse Events', desc: 'Explore upcoming workshops, cultural fests, and club activities.' },
                { step: '03', title: 'Join & Participate', desc: 'Register instantly, attend events, and earn verified certificates.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full bg-slate-950 border-4 border-slate-800 group-hover:border-indigo-500 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 transition-colors shadow-xl">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-slate-400 max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Clubs */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold text-white">Popular Clubs</h2>
          <Link to="/clubs" className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
            View All Clubs <ChevronRight size={20} />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-900 animate-pulse rounded-3xl"></div>)}
          </div>
        ) : popularClubs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularClubs.map(club => {
              const clubId = club._id || club.id;
              return (
                <Link key={clubId} to={`/clubs/${clubId}`} className="group p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all text-center flex flex-col items-center">
                  <img src={club.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(club.name)}&background=1e1b4b&color=818cf8`} alt={club.name} className="w-24 h-24 rounded-full mb-6 border-4 border-slate-950 shadow-lg group-hover:scale-105 transition-transform object-cover" />
                  <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{club.description}</p>
                  <div className="mt-auto flex items-center gap-2 text-sm text-indigo-400 font-medium">
                    View Club <ExternalLink size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">No popular clubs found.</div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-16">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', dept: 'Computer Science', quote: 'Campus Connect made it so easy to find hackathons. I joined the Coding Club and attended 5 events this semester!' },
              { name: 'Rahul Patel', dept: 'Mechanical Engg.', quote: 'Getting certificates automatically after events is a game changer. No more chasing organizers.' },
              { name: 'Emily Chen', dept: 'Business Admin', quote: 'As a club coordinator, managing registrations used to be a nightmare. Now it\'s completely automated.' },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative">
                <div className="text-4xl text-indigo-500/20 absolute top-4 left-6 font-serif">"</div>
                <p className="text-slate-300 italic mb-8 relative z-10">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="text-white font-medium">{t.name}</h4>
                    <p className="text-sm text-slate-500">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20 -z-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-black text-white">Ready to Connect?</h2>
          <p className="text-xl text-slate-300">Join thousands of students already discovering amazing campus events.</p>
          <Link to="/register" className="inline-block px-10 py-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-all shadow-lg shadow-indigo-600/25 mt-4">
            Register Now - It's Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
