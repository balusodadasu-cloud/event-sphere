import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <Lock className="text-red-500 w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Access Denied</h1>
      <p className="text-xl text-slate-400 mb-10 max-w-md">
        You do not have permission to access this page. Please log in with an appropriate account.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors border border-slate-700"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </button>
        <Link 
          to="/" 
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
