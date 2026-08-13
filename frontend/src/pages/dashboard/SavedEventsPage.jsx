import React, { useState, useEffect } from 'react';
import { BookmarkMinus } from 'lucide-react';
import * as bookmarkService from '../../services/bookmarkService';
import EventGrid from '../../components/events/EventGrid';

const SavedEventsPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await bookmarkService.getBookmarks();
      // Assuming res.data is array of bookmark objects { _id, event: {...} }
      const events = (res.data || []).map(b => b.event).filter(Boolean);
      setBookmarks(events);
    } catch (err) {
      console.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Saved Events</h1>
        <span className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          {bookmarks.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookmarks.length > 0 ? (
        <EventGrid events={bookmarks} />
      ) : (
        <div className="text-center py-24 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
          <BookmarkMinus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No saved events</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Events you bookmark will appear here. Start exploring and save events you're interested in.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedEventsPage;
