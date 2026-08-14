import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, ClipboardList, Award, UsersRound } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0, totalEvents: 0, activeEvents: 0,
    totalRegistrations: 0, activeClubs: 0, certificatesIssued: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [studentsRes, eventsRes, regsRes, clubsRes, certsRes] = await Promise.allSettled([
          api.get('/users/students'),
          api.get('/events?limit=100'),
          api.get('/registrations/all'),
          api.get('/clubs'),
          api.get('/certificates?limit=1'),
        ]);

        const students = studentsRes.status === 'fulfilled' ? studentsRes.value.data?.data || [] : [];
        const events = eventsRes.status === 'fulfilled' ? eventsRes.value.data?.data || [] : [];
        const regs = regsRes.status === 'fulfilled' ? regsRes.value.data?.data || [] : [];
        const clubs = clubsRes.status === 'fulfilled' ? clubsRes.value.data?.data || [] : [];
        const certsTotal = certsRes.status === 'fulfilled' ? certsRes.value.data?.total || 0 : 0;

        setStats({
          totalStudents: students.length,
          totalEvents: events.length,
          activeEvents: events.filter(e => e.status === 'published').length,
          totalRegistrations: regs.length,
          activeClubs: clubs.filter(c => c.isActive !== false).length,
          certificatesIssued: certsTotal,
        });

        setRecentEvents(events.slice(0, 5).map(e => ({
          id: e._id, title: e.title,
          date: e.date?.slice(0, 10) || '—',
          registrations: e.currentRegistrations || 0,
          status: e.status,
        })));

        setRecentRegistrations(regs.slice(0, 5).map(r => ({
          id: r._id,
          student: r.student?.name || '—',
          event: r.event?.title || '—',
          date: r.createdAt?.slice(0, 10) || '—',
          status: r.status,
        })));
      } catch (err) {
        console.error('Admin dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const barData = [
    { name: 'Mar', registrations: 400 }, { name: 'Apr', registrations: 300 },
    { name: 'May', registrations: 550 }, { name: 'Jun', registrations: 450 },
    { name: 'Jul', registrations: 700 }, { name: 'Aug', registrations: 600 }
  ];

  const pieData = [
    { name: 'Technical', value: 400 }, { name: 'Cultural', value: 300 },
    { name: 'Sports', value: 300 }, { name: 'Workshop', value: 200 }
  ];
  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'];

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome Admin!</h1>
        <p className="text-slate-400">{new Date().toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-indigo-400' },
          { title: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-violet-400' },
          { title: 'Active Events', value: stats.activeEvents, icon: Activity, color: 'text-green-400' },
          { title: 'Total Registrations', value: stats.totalRegistrations, icon: ClipboardList, color: 'text-pink-400' },
          { title: 'Active Clubs', value: stats.activeClubs, icon: UsersRound, color: 'text-amber-400' },
          { title: 'Certificates', value: stats.certificatesIssued, icon: Award, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className={`p-4 rounded-lg bg-slate-800 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-96">
          <h3 className="text-lg font-semibold mb-4">Monthly Registrations</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              <Bar dataKey="registrations" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-96">
          <h3 className="text-lg font-semibold mb-4">Events by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr><th className="pb-3">Title</th><th className="pb-3">Date</th><th className="pb-3">Reg.</th><th className="pb-3">Status</th></tr>
              </thead>
              <tbody>
                {recentEvents.map(ev => (
                  <tr key={ev.id} className="border-b border-slate-800/50">
                    <td className="py-3">{ev.title}</td><td className="py-3">{ev.date}</td>
                    <td className="py-3">{ev.registrations}</td>
                    <td className="py-3"><span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-md text-xs">{ev.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Recent Registrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr><th className="pb-3">Student</th><th className="pb-3">Event</th><th className="pb-3">Date</th><th className="pb-3">Status</th></tr>
              </thead>
              <tbody>
                {recentRegistrations.map(reg => (
                  <tr key={reg.id} className="border-b border-slate-800/50">
                    <td className="py-3">{reg.student}</td><td className="py-3">{reg.event}</td>
                    <td className="py-3">{reg.date}</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">{reg.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
