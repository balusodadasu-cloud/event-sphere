import React from 'react';
import { Users, Zap, Shield, CheckCircle, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            About Campus Connect
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-400">
            Empowering students and organizers to create, discover, and manage college events effortlessly.
          </p>
        </div>
        
        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-100">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
              We aim to bridge the gap between event organizers and students by providing a seamless platform that simplifies event discovery, registration, and management. No more chaotic WhatsApp groups or missed opportunities.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-slate-400">Built with modern tech to ensure your data and registrations are always safe.</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-slate-100">Powered By</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Lucide', 'React Router'].map(tech => (
              <div key={tech} className="p-4 text-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                <span className="font-medium text-slate-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/20 rounded-3xl p-12 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to explore?</h2>
          <Link to="/events" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
            Discover Events <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
