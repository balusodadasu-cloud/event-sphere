import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, Calendar, ClipboardCheck, Award, Trophy } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { timeAgo } from '../../utils/helpers';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const list = Array.isArray(notifications) ? notifications : [];
    const recentNotifications = list.slice(0, 5);

    const getIcon = (type) => {
        switch (type) {
            case 'event': return <Calendar className="w-4 h-4 text-blue-500" />;
            case 'registration': return <ClipboardCheck className="w-4 h-4 text-emerald-500" />;
            case 'certificate': return <Award className="w-4 h-4 text-amber-500" />;
            case 'result': return <Trophy className="w-4 h-4 text-violet-500" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    const handleNotificationClick = (id) => {
        if (markRead && id) markRead(id);
        setIsOpen(false);
        navigate('/dashboard/notifications');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl bg-slate-900 border border-slate-800 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                            >
                                <Check className="w-3 h-3 mr-1" /> Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {recentNotifications.length > 0 ? (
                            <div className="divide-y divide-slate-800">
                                {recentNotifications.map((notification) => {
                                    const id = notification._id || notification.id;
                                    const isRead = notification.isRead || notification.read;
                                    return (
                                        <div 
                                            key={id}
                                            onClick={() => handleNotificationClick(id)}
                                            className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors flex items-start ${!isRead ? 'bg-slate-800/20' : ''}`}
                                        >
                                            <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="ml-3 flex-1 min-w-0">
                                                <p className={`text-sm font-medium line-clamp-2 ${!isRead ? 'text-white' : 'text-slate-300'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {timeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                            {!isRead && (
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No new notifications</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-2 border-t border-slate-800">
                        <button 
                            onClick={() => { setIsOpen(false); navigate('/dashboard/notifications'); }}
                            className="w-full block text-center px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors font-medium"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
