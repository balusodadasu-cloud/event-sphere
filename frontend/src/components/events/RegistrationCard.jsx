import React from 'react';
import { CalendarDays, MapPin, Download } from 'lucide-react';
import { formatDateShort } from '../../utils/helpers';

const RegistrationCard = ({ registration }) => {
    const { _id, event, status, qrCode, registrationId } = registration;

    const getStatusBadge = () => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'attended': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const handleDownload = () => {
        if (!qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `Ticket_${registrationId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!event) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row relative group">
            {/* Ticket Left Side (Event Info) */}
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10 border-b md:border-b-0 md:border-r border-slate-800 border-dashed">
                <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border capitalize ${getStatusBadge()}`}>
                        {status}
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">
                        #{registrationId}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {event.title}
                </h3>
                
                <div className="space-y-2 mt-4 text-sm text-slate-400">
                    <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-3 text-indigo-400" />
                        <span>{formatDateShort(event.date)} at {event.time}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-indigo-400" />
                        <span>{event.venue}</span>
                    </div>
                </div>
            </div>

            {/* Ticket Right Side (QR Code) */}
            <div className="p-6 bg-slate-800/20 flex flex-col items-center justify-center min-w-[200px] relative z-10">
                {/* Decorative cutouts */}
                <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950 border-r border-slate-800"></div>
                <div className="md:hidden absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-b border-slate-800"></div>

                {qrCode ? (
                    <div className="bg-white p-2 rounded-xl shadow-sm mb-4">
                        <img src={qrCode} alt="QR Code" className="w-32 h-32 object-contain" />
                    </div>
                ) : (
                    <div className="w-32 h-32 bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-500 border border-slate-700">
                        No QR
                    </div>
                )}
                
                <button 
                    onClick={handleDownload}
                    disabled={!qrCode}
                    className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download Pass
                </button>
            </div>
        </div>
    );
};

export default RegistrationCard;
