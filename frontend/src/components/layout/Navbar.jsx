import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { generateInitials } from '../../utils/helpers';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Clubs', path: '/clubs' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                            Campus Connect
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right side items */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <NotificationBell />
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                                    >
                                        {generateInitials(user?.name)}
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-slate-900 border border-slate-800 ring-1 ring-black ring-opacity-5 py-1 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-slate-800">
                                                <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                            </div>
                                            <Link 
                                                to={user?.role === 'admin' ? '/admin' : '/dashboard'} 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                                Dashboard
                                            </Link>
                                            <Link 
                                                to={user?.role === 'admin' ? '/admin/settings' : '/dashboard/profile'} 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                            >
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/login"
                                    className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center space-x-4">
                        {isAuthenticated && <NotificationBell />}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-400 hover:text-white focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <>
                                <div className="border-t border-slate-800 pt-4 pb-1">
                                    <div className="flex items-center px-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                                                {generateInitials(user?.name)}
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-white">{user?.name}</div>
                                            <div className="text-sm font-medium text-slate-400">{user?.email}</div>
                                        </div>
                                    </div>
                                    <Link
                                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        <LayoutDashboard className="w-5 h-5 mr-3" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to={user?.role === 'admin' ? '/admin/settings' : '/dashboard/profile'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        <User className="w-5 h-5 mr-3" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-slate-800 pt-4 pb-2 space-y-2 px-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
