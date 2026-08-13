import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, User, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDateShort, formatTime, getCategoryColor, isRegistrationOpen } from '../../utils/helpers';

const EventCard = ({ event, onBookmark, isBookmarked }) => {
    if (!event) return null;

    const id = event._id || event.id;
    const { title, category, date, venue, organizer, poster, registrationDeadline } = event;
    const time = event.startTime || event.time || '';
    const registeredCount = event.currentRegistrations ?? event.registeredCount ?? 0;
    const totalSeats = event.maxParticipants ?? event.totalSeats ?? 0;

    const isFull = totalSeats > 0 && registeredCount >= totalSeats;
    const isRegOpen = isRegistrationOpen(registrationDeadline) && !isFull;
    const fillPercentage = totalSeats > 0 ? Math.min((registeredCount / totalSeats) * 100, 100) : 0;

    const renderPoster = () => {
        if (poster) {
            return <img src={poster} alt={title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />;
        }
        return (
            <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl"></div>
                <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-violet-500/20 blur-xl"></div>
                <span className="font-bold text-2xl text-slate-400 z-10">{title?.charAt(0) || 'E'}</span>
            </div>
        );
    };

    return (
        <div className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative h-full">
            <div className="relative h-48 overflow-hidden shrink-0">
                {renderPoster()}
                <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border backdrop-blur-md ${getCategoryColor(category)}`}>
                        {category}
                    </span>
                </div>
                {isFull && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-500 text-white font-bold tracking-widest rounded-lg transform -rotate-12">
                            HOUSE FULL
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-slate-400">
                        <div className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                            <span>{formatDateShort(date)}</span>
                            {time && (
                                <>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                                    <span>{formatTime(time)}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{venue}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                            <span className="line-clamp-1">{organizer?.name || 'College Admin'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    {totalSeats > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Seats Fill</span>
                                <span className="text-white font-medium">{registeredCount} / {totalSeats}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${fillPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Registration</span>
                            <span className={`text-xs font-medium ${isRegOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isRegOpen ? 'Open' : 'Closed'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {onBookmark && id && (
                                <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookmark(id); }}
                                    className={`p-2 rounded-lg border transition-colors ${
                                        isBookmarked 
                                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20' 
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                                    }`}
                                >
                                    {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                </button>
                            )}
                            {id && (
                                <Link 
                                    to={`/events/${id}`}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors inline-block"
                                >
                                    View Details
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
