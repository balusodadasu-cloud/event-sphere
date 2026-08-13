import React from 'react';
import { EVENT_CATEGORIES, DEPARTMENTS, EVENT_STATUSES } from '../../utils/constants';

const FilterPanel = ({ filters = {}, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (onChange) {
            onChange({ ...filters, [name]: value });
        }
    };

    return (
        <div className="flex flex-wrap gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select 
                    name="category" 
                    value={filters.category || ''} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value="">All Categories</option>
                    {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
                <select 
                    name="department" 
                    value={filters.department || ''} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                <select 
                    name="status" 
                    value={filters.status || ''} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value="">All Statuses</option>
                    {EVENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>
            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-slate-400 mb-1">Sort By</label>
                <select 
                    name="sort" 
                    value={filters.sort || ''} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="date">Event Date (Asc)</option>
                    <option value="-date">Event Date (Desc)</option>
                </select>
            </div>
        </div>
    );
};

export default FilterPanel;
