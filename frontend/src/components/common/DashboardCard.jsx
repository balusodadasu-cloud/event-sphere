import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
    const colorClasses = {
        primary: 'from-indigo-500/20 to-indigo-500/0 text-indigo-500 border-indigo-500/20',
        violet: 'from-violet-500/20 to-violet-500/0 text-violet-500 border-violet-500/20',
        green: 'from-emerald-500/20 to-emerald-500/0 text-emerald-500 border-emerald-500/20',
        amber: 'from-amber-500/20 to-amber-500/0 text-amber-500 border-amber-500/20',
        red: 'from-rose-500/20 to-rose-500/0 text-rose-500 border-rose-500/20',
        blue: 'from-blue-500/20 to-blue-500/0 text-blue-500 border-blue-500/20',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-bl-full opacity-50 ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}></div>
            
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-slate-400 font-medium text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                    {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl border ${colorClasses[color].split(' ').slice(2).join(' ')} bg-slate-800/50 backdrop-blur-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
