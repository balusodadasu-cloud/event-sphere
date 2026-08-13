import React, { useState, useEffect } from 'react';
import { Trophy, Medal, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Fetch student's registrations
        const regsRes = await api.get('/registrations/me');
        const registrations = regsRes.data?.data || regsRes.data || [];

        // For each registered event, try to fetch results
        const promises = registrations.map(async (reg) => {
          const eventId = reg.event?._id || reg.event;
          if (!eventId) return null;
          try {
            const res = await api.get(`/results/${eventId}`);
            const resultDoc = res.data?.data;
            if (!resultDoc) return null;

            // Find student in results list
            const myRes = resultDoc.results?.find(r => 
              (r.student?._id === user?._id) || (r.student === user?._id) || (r.student === user?.id)
            );
            if (myRes) {
              return { ...myRes, event: reg.event };
            }
            return null;
          } catch {
            return null;
          }
        });

        const found = (await Promise.all(promises)).filter(Boolean);
        setResults(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const getPositionColor = (pos) => {
    if (pos === 1) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (pos === 2) return 'text-slate-300 bg-slate-300/10 border-slate-300/20';
    if (pos === 3) return 'text-amber-600 bg-amber-600/10 border-amber-600/20';
    return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Event Results & Rankings</h1>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((res, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${getPositionColor(res.position)}`}>
                <span className="text-xs font-semibold uppercase mb-0.5">Rank</span>
                <span className="text-2xl font-black leading-none">#{res.position}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-100 mb-1">{res.event?.title || 'Event Result'}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-slate-500" /> Score: <span className="font-medium text-slate-300">{res.score || 'N/A'}</span>
                  </span>
                  {res.remarks && (
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700 text-xs">
                      {res.remarks}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
          <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No results yet</h3>
          <p className="text-slate-500 text-sm">Your competitive event results will appear here once published.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
