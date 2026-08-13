import React from 'react';
import useCountdown from '../../hooks/useCountdown';

const CountdownTimer = ({ targetDate, label = 'Event starts in' }) => {
    const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

    if (isExpired) {
        return (
            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-6 py-3 rounded-xl font-medium text-center">
                Event has started or ended
            </div>
        );
    }

    const timeUnits = [
        { label: 'Days', value: days },
        { label: 'Hours', value: hours },
        { label: 'Minutes', value: minutes },
        { label: 'Seconds', value: seconds }
    ];

    return (
        <div className="flex flex-col items-center">
            <p className="text-slate-400 text-sm font-medium mb-3">{label}</p>
            <div className="flex space-x-3 sm:space-x-4">
                {timeUnits.map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center shadow-inner text-xl sm:text-2xl font-bold text-white mb-1">
                            {unit.value.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-semibold tracking-wider">
                            {unit.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountdownTimer;
