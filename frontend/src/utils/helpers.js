import { CATEGORY_COLORS } from './constants';

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(`1970-01-01T${timeStr}`);
    if (isNaN(date.getTime())) {
        const d2 = new Date(timeStr);
        if(!isNaN(d2.getTime())) return d2.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        return timeStr;
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
};

export const truncate = (str, len) => {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
};

export const getCategoryColor = (category) => {
    const color = CATEGORY_COLORS[category] || 'slate';
    return `bg-${color}-500/10 text-${color}-500 border-${color}-500/20`;
};

export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'draft': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        case 'published': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        case 'ongoing': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
};

export const generateInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
};

export const isEventPast = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
};

export const isRegistrationOpen = (deadline) => {
    if (!deadline) return true;
    return new Date(deadline) > new Date();
};

export const getCountdown = (dateStr) => {
    if (!dateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const difference = new Date(dateStr) - new Date();
    
    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    
    return { days, hours, minutes, seconds };
};
