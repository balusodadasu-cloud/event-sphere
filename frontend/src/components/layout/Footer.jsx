import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, MessageSquare, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div>
                        <Link to="/" className="flex items-center mb-4">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                                Campus Connect
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            The ultimate platform for college events, clubs, and student engagement. 
                            Discover, register, and manage your campus life seamlessly.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/events" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Explore Events</Link></li>
                            <li><Link to="/clubs" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Browse Clubs</Link></li>
                            <li><Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Student Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">For Students</h4>
                        <ul className="space-y-2">
                            <li><Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Student Dashboard</Link></li>
                            <li><Link to="/dashboard/registrations" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">My Registrations</Link></li>
                            <li><Link to="/dashboard/certificates" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Certificates</Link></li>
                            <li><Link to="/dashboard/results" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Event Results</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-400 text-sm">123 University Avenue, Tech Block, City, State 12345</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-400 text-sm">+1 (234) 567-8900</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-400 text-sm">support@campusconnect.edu</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
