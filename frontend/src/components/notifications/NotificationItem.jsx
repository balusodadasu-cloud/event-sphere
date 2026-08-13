import React from 'react';
import { Calendar, ClipboardCheck, Award, Trophy, Bell, Trash2, Clock, CheckCircle } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

const NotificationItem = ({ notification, onRead, onDelete }) => {
    const { _id, title, message, type, isRead, createdAt } = notification;
    const id = _id || notification.id;

    const getIcon = () => {
        switch (type) {
            case 'event': return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'registration': return <ClipboardCheck className="w-5 h-5 text-emerald-500" />;
            case 'certificate': return <Award className="w-5 h-5 text-amber-500" />;
            case 'result': return <Trophy className="w-5 h-5 text-violet-500" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className={`flex items-start p-4 sm:p-5 border border-slate-800 rounded-xl transition-all duration-300 group relative overflow-hidden ${
            isRead 
                ? 'bg-slate-900/50' 
                : 'bg-slate-800/40 border-slate-700 shadow-md shadow-indigo-500/5'
        }`}>
            {!isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            )}
            
            <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                {getIcon()}
            </div>
            
            <div className="ml-4 flex-1 pr-10">
                <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-base font-semibold ${isRead ? 'text-slate-300' : 'text-white'}`}>
                        {title}
                    </h4>
                    <span className="hidden sm:flex items-center text-xs text-slate-500 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {timeAgo(createdAt)}
                    </span>
                </div>
                
                <p className={`text-sm ${isRead ? 'text-slate-500' : 'text-slate-400'}`}>
                    {message}
                </p>
                
                <span className="flex sm:hidden items-center text-xs text-slate-500 mt-3 whitespace-nowrap">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo(createdAt)}
                </span>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {!isRead && onRead && (
                    <button 
                        onClick={() => onRead(id)}
                        className="p-1.5 bg-slate-800 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Mark as read"
                    >
                        <CheckCircle className="w-4 h-4" />
                    </button>
                )}
                {onDelete && (
                    <button 
                        onClick={() => onDelete(id)}
                        className="p-1.5 bg-slate-800 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
