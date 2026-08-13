import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search as SearchIcon } from 'lucide-react';
import * as eventService from '../services/eventService';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import Pagination from '../components/common/Pagination';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await eventService.getEvents(params);
        const eventsList = Array.isArray(res.data) ? res.data : (res.data?.events || []);
        setEvents(eventsList);
        setTotalCount(res.count || eventsList.length);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchParams]);

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set('search', query);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const totalPages = Math.ceil(totalCount / 12) || 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Discover Events</h1>
            <p className="text-slate-400">Showing {totalCount} events based on your criteria</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-80">
              <SearchBar initialValue={searchQuery} onSearch={handleSearch} placeholder="Search events..." />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white flex items-center justify-center"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72 flex-shrink-0 space-y-6`}>
            <div className="sticky top-24 bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Filters</h3>
                {Array.from(searchParams.keys()).length > 0 && (
                  <button onClick={clearFilters} className="text-sm text-indigo-400 hover:text-indigo-300">
                    Clear All
                  </button>
                )}
              </div>
              <FilterPanel 
                currentFilters={Object.fromEntries(searchParams.entries())}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Event Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-slate-900 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(p) => handleFilterChange({ page: p })} 
                />
              </>
            ) : (
              <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800/50">
                <SearchIcon className="mx-auto h-16 w-16 text-slate-600 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
