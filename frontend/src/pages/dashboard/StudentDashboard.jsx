import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bookmark, Award, Bell, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import * as registrationService from '../../services/registrationService';
import * as bookmarkService from '../../services/bookmarkService';
import * as certificateService from '../../services/certificateService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ regs: 0, bookmarks: 0, certs: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fallback parallel requests
        const [regRes, bookRes, certRes] = await Promise.allSettled([
          registrationService.getMyRegistrations(),
          bookmarkService.getBookmarks(),
          certificateService.getMyCertificates()
        ]);
        
        const regs = regRes.status === 'fulfilled' ? regRes.value?.data?.length || 0 : 0;
        const bookmarks = bookRes.status === 'fulfilled' ? bookRes.value?.data?.length || 0 : 0;
        const certs = certRes.status === 'fulfilled' ? certRes.value?.data?.length || 0 : 0;
        
        setStats({ regs, bookmarks, certs });

        if (regRes.status === 'fulfilled' && regRes.value?.data) {
          const up = regRes.value.data
            .filter(r => new Date(r.event?.date) > new Date())
            .slice(0, 3);
          setUpcoming(up);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
        <p className="text-slate-400">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          icon={<Calendar className="text-indigo-400" />} 
          title="Registrations" 
          value={stats.regs} 
          link="/dashboard/registrations"
          bg="bg-indigo-500/10"
        />
        <DashboardCard 
          icon={<Bookmark className="text-emerald-400" />} 
          title="Saved Events" 
          value={stats.bookmarks} 
          link="/dashboard/saved"
          bg="bg-emerald-500/10"
        />
        <DashboardCard 
          icon={<Award className="text-amber-400" />} 
          title="Certificates" 
          value={stats.certs} 
          link="/dashboard/certificates"
          bg="bg-amber-500/10"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Upcoming Events
            </h2>
            <Link to="/dashboard/registrations" className="text-sm text-indigo-400 hover:text-indigo-300">View All</Link>
          </div>
          
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.map((reg, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex flex-col items-center justify-center shrink-0 border border-indigo-500/20">
                  <span className="text-xs font-medium text-indigo-400 uppercase">
                    {reg.event?.date ? new Date(reg.event.date).toLocaleString('default', { month: 'short' }) : 'TBA'}
                  </span>
                  <span className="text-lg font-bold text-indigo-300 leading-tight">
                    {reg.event?.date ? new Date(reg.event.date).getDate() : '-'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-200 truncate">{reg.event?.title || 'Unknown Event'}</h3>
                  <p className="text-sm text-slate-500 truncate">{reg.event?.venue || 'Venue TBA'}</p>
                </div>
                <Link to={`/events/${reg.event?._id}`} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
                No upcoming events registered.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Notices */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-violet-400" /> Recent Notices
            </h2>
            <Link to="/dashboard/notifications" className="text-sm text-indigo-400 hover:text-indigo-300">View All</Link>
          </div>
          <div className="text-center py-12 text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
            No new notifications.
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value, link, bg }) => (
  <Link to={link} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group flex items-center gap-6">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
      {React.cloneElement(icon, { className: `w-7 h-7 ${icon.props?.className || ''}` })}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">{value}</h3>
    </div>
  </Link>
);

export default StudentDashboard;
