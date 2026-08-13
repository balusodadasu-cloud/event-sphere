import React from 'react';

const LoadingSpinner = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-3 p-4">
            <div className={`rounded-full animate-spin border-slate-700 border-t-indigo-500 ${sizeClasses[size]}`}></div>
            {text && <p className="text-slate-400 text-sm font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
