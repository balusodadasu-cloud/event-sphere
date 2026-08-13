import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative z-10">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-800 mb-6 drop-shadow-2xl">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
          Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium items-center justify-center transition-all shadow-lg shadow-indigo-600/25"
        >
          <Home size={20} className="mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
