import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ExternalLink, Calendar } from 'lucide-react';
import * as clubService from '../services/clubService';
import SearchBar from '../components/common/SearchBar';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await clubService.getClubs({ search: searchQuery });
        setClubs(Array.isArray(res.data) ? res.data : (res.data?.clubs || []));
      } catch (err) {
        console.error('Failed to fetch clubs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden mb-12 p-10 md:p-16 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-900 z-0"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Explore Campus Clubs</h1>
            <p className="text-lg text-slate-400 mb-8">
              Join communities that share your passion. Discover clubs, participate in their events, and expand your network.
            </p>
            <div className="w-full max-w-md mx-auto">
              <SearchBar 
                initialValue={searchQuery} 
                onSearch={setSearchQuery} 
                placeholder="Search clubs by name or department..." 
              />
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-slate-900 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : clubs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club) => {
              const clubId = club._id || club.id;
              const coordName = club.coordinator?.name || club.coordinatorName || 'Faculty Advisor';
              return (
                <div key={clubId} className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300">
                  <div>
                    <div className="flex items-center gap-6 mb-6">
                      <img 
                        src={club.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(club.name)}&background=1e1b4b&color=818cf8`} 
                        alt={club.name} 
                        className="w-16 h-16 rounded-2xl border border-slate-800 shadow-md group-hover:scale-105 transition-transform object-cover"
                      />
                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{club.name}</h2>
                        <span className="inline-block mt-1 px-3 py-1 bg-slate-800 text-xs font-semibold text-indigo-400 rounded-full">{club.department}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {club.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-800">
                      <div className="flex items-center gap-1.5"><Users size={16} /> {club.members?.length || 0} Members</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Coord: <span className="text-slate-300 font-medium">{coordName}</span></span>
                      <Link 
                        to={`/clubs/${clubId}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors"
                      >
                        View Profile <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800/50">
            <Users className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No clubs found</h3>
            <p className="text-slate-400">We couldn't find any clubs matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
