import { useState, useEffect, useCallback } from 'react';
import { getEvents } from '../services/eventService';

const useEvents = (initialFilters = {}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEvents(filters);
            setEvents(data.events || data);
            if (data.pagination) setPagination(data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [fetchEvents]);

    return { events, loading, error, pagination, setFilters, refetch: fetchEvents };
};

export default useEvents;
