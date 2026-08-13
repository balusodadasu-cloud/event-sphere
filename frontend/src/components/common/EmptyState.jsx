import React from 'react';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm">
            {Icon && (
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-indigo-500" />
                </div>
            )}
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-slate-400 mb-6 max-w-sm">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
