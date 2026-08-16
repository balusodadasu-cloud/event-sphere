import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import * as eventService from '../../services/eventService';
import * as resultService from '../../services/resultService';
import * as userService from '../../services/userService';

export default function AdminResultsPage() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [results, setResults] = useState([
    { student: '', position: '1st', score: '', remarks: '' }
  ]);
  const [loading, setLoading] = useState(true);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchInit = async () => {
      setLoading(true);
      try {
        const [evRes, stRes] = await Promise.allSettled([
          eventService.getEvents({ limit: 100 }),
          userService.getStudents()
        ]);
        if (evRes.status === 'fulfilled') setEvents(evRes.value.data || []);
        if (stRes.status === 'fulfilled') setStudents(stRes.value.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, []);

  const handleEventChange = async (eventId) => {
    setSelectedEventId(eventId);
    setFeedback({ type: '', message: '' });
    if (!eventId) {
      setResults([{ student: '', position: '1st', score: '', remarks: '' }]);
      return;
    }

    setFetchingResults(true);
    try {
      const res = await resultService.getResults(eventId);
      if (res.data?.results && res.data.results.length > 0) {
        setResults(res.data.results.map(r => ({
          student: r.student?._id || r.student || '',
          position: r.position || '',
          score: r.score?.toString() || '',
          remarks: r.remarks || '',
        })));
        setFeedback({ type: 'success', message: 'Loaded existing results for this event' });
      } else {
        setResults([{ student: '', position: '1st', score: '', remarks: '' }]);
      }
    } catch {
      setResults([{ student: '', position: '1st', score: '', remarks: '' }]);
    } finally {
      setFetchingResults(false);
    }
  };

  const updateRow = (idx, field, val) => {
    setResults(prev => prev.map((row, i) => i === idx ? { ...row, [field]: val } : row));
  };

  const addRow = () => {
    const nextPos = results.length === 0 ? '1st' : results.length === 1 ? '2nd' : results.length === 2 ? '3rd' : 'Special Mention';
    setResults(prev => [...prev, { student: '', position: nextPos, score: '', remarks: '' }]);
  };

  const removeRow = (idx) => {
    setResults(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    if (!selectedEventId) {
      setFeedback({ type: 'error', message: 'Please select an event first' });
      return;
    }

    const validResults = results.filter(r => r.student && r.position);
    if (validResults.length === 0) {
      setFeedback({ type: 'error', message: 'Please add at least one valid result with student and position' });
      return;
    }

    setPublishing(true);
    setFeedback({ type: '', message: '' });
    try {
      await resultService.publishResults({
        eventId: selectedEventId,
        results: validResults.map(r => ({
          student: r.student,
          position: r.position,
          score: r.score ? Number(r.score) : undefined,
          remarks: r.remarks || undefined,
        }))
      });
      setFeedback({ type: 'success', message: 'Results published successfully! Notifications sent to winners.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
    } catch (err) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to publish results' });
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteResults = async () => {
    if (!selectedEventId) return;
    if (!window.confirm('Are you sure you want to delete results for this event?')) return;
    setPublishing(true);
    try {
      await resultService.deleteResults(selectedEventId);
      setResults([{ student: '', position: '1st', score: '', remarks: '' }]);
      setFeedback({ type: 'success', message: 'Results deleted for this event' });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to delete results' });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Publish & Manage Event Results</h1>

      {feedback.message && (
        <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 border ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {feedback.message}
        </div>
      )}

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 mb-8">
        <label className="block text-xs font-medium text-slate-400 mb-2">Select Event *</label>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={16} className="animate-spin text-indigo-400" /> Loading events...
          </div>
        ) : (
          <select value={selectedEventId}
            onChange={e => handleEventChange(e.target.value)}
            className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
            <option value="">Select Event...</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>
                {ev.title} ({ev.category}) {ev.date ? `· ${ev.date.slice(0, 10)}` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Trophy size={20} className="text-amber-400" /> Leaderboard & Results
          </h2>
          <button onClick={addRow}
            className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 text-slate-200 transition-colors">
            <Plus size={16} /> Add Position Row
          </button>
        </div>

        {fetchingResults ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
        ) : (
          <div className="space-y-3">
            {results.map((res, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <select value={res.student} onChange={e => updateRow(idx, 'student', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                  <option value="">Select Student...</option>
                  {students.map(st => (
                    <option key={st._id} value={st._id}>{st.name} ({st.studentId || st.email})</option>
                  ))}
                </select>

                <input type="text" placeholder="Position (e.g. 1st, Winner)"
                  value={res.position} onChange={e => updateRow(idx, 'position', e.target.value)}
                  className="w-full sm:w-36 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />

                <input type="number" placeholder="Score"
                  value={res.score} onChange={e => updateRow(idx, 'score', e.target.value)}
                  className="w-full sm:w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />

                <input type="text" placeholder="Remarks (optional)"
                  value={res.remarks} onChange={e => updateRow(idx, 'remarks', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />

                <button onClick={() => removeRow(idx)}
                  className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-center" title="Remove Row">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between items-center border-t border-slate-800 pt-6">
          <button onClick={handleDeleteResults} disabled={!selectedEventId || publishing}
            className="text-red-400 hover:text-red-300 text-sm disabled:opacity-30">
            Delete Event Results
          </button>
          <button onClick={handlePublish} disabled={publishing || !selectedEventId}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50">
            {publishing && <Loader2 size={16} className="animate-spin" />}
            Publish Results
          </button>
        </div>
      </div>
    </div>
  );
}

