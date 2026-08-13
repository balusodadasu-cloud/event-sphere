import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import * as eventService from '../../services/eventService';
import { formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../utils/constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const getCatDot = (cat) => {
  const colors = { Technical:'bg-blue-500', Hackathon:'bg-violet-500', Workshop:'bg-green-500', Seminar:'bg-yellow-500', Cultural:'bg-pink-500', Sports:'bg-orange-500', Fest:'bg-red-500', 'Coding Contest':'bg-cyan-500', 'Club Activity':'bg-purple-500', Placement:'bg-teal-500', Awareness:'bg-indigo-500', Other:'bg-slate-500' };
  return colors[cat] || 'bg-primary-500';
};

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0).toISOString();

    setLoading(true);
    eventService.getEvents({ limit: 100 })
      .then(res => {
        const all = res.data || [];
        const filtered = all.filter(ev => {
          const d = new Date(ev.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });
        setEvents(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day) => events.filter(ev => new Date(ev.date).getDate() === day);

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Event Calendar</h1>
        <p className="text-slate-400 mt-1">Browse events by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{MONTHS[month]} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  className={`relative p-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[52px] flex flex-col items-center gap-1
                    ${isSelected ? 'bg-primary-600 text-white' : isToday ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <span>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full ${getCatDot(ev.category)}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events panel */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-400" />
            {selectedDay ? `Events on ${MONTHS[month]} ${selectedDay}` : 'Select a day'}
          </h3>

          {!selectedDay && (
            <p className="text-slate-500 text-sm">Click on a date to see events for that day.</p>
          )}

          {selectedDay && selectedEvents.length === 0 && (
            <p className="text-slate-500 text-sm">No events on this day.</p>
          )}

          <div className="space-y-3">
            {selectedEvents.map(ev => (
              <a
                key={ev._id}
                href={`/events/${ev._id}`}
                className="block p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getCatDot(ev.category)}`} />
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">{ev.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.startTime} · {ev.venue}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {loading && <p className="text-slate-500 text-sm mt-3">Loading events...</p>}
        </div>
      </div>
    </div>
  );
}
