import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, variant = 'danger' }) => {
    if (!isOpen) return null;

    const buttonClass = variant === 'danger' 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-indigo-600 hover:bg-indigo-700';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${buttonClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
