import React from 'react';
import EventCard from './EventCard';
import EmptyState from '../common/EmptyState';
import { CalendarSearch } from 'lucide-react';

const EventGrid = ({ events, loading, bookmarks = [], onBookmark }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[420px] animate-pulse">
                        <div className="h-48 bg-slate-800"></div>
                        <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                            <div className="h-6 bg-slate-800 rounded-md w-3/4 mb-4"></div>
                            <div className="space-y-3 mb-4">
                                <div className="h-4 bg-slate-800 rounded-md w-full"></div>
                                <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
                                <div className="h-4 bg-slate-800 rounded-md w-2/3"></div>
                            </div>
                            <div className="mt-auto h-10 bg-slate-800 rounded-lg w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <EmptyState 
                icon={CalendarSearch}
                title="No Events Found"
                description="Try adjusting your search filters or check back later for new events."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
                const id = event._id || event.id;
                const isBookmarked = bookmarks.includes(id);
                return (
                    <EventCard 
                        key={id} 
                        event={event} 
                        isBookmarked={isBookmarked}
                        onBookmark={onBookmark}
                    />
                );
            })}
        </div>
    );
};

export default EventGrid;
