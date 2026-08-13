import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarSearch, ClipboardList, Bookmark, Award, Trophy, Bell, Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateInitials } from '../../utils/helpers';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
        { name: 'Explore Events', path: '/events', icon: CalendarSearch },
        { name: 'My Registrations', path: '/dashboard/registrations', icon: ClipboardList },
        { name: 'Saved Events', path: '/dashboard/saved', icon: Bookmark },
        { name: 'Certificates', path: '/dashboard/certificates', icon: Award },
        { name: 'Results', path: '/dashboard/results', icon: Trophy },
        { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
        { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
        { name: 'Profile', path: '/dashboard/profile', icon: User },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 w-64 text-slate-300">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {generateInitials(user?.name)}
                    </div>
                    <div>
                        <h3 className="text-white font-semibold truncate w-32">{user?.name}</h3>
                        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>
                {/* Mobile close button inside sidebar */}
                <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                end={item.exact}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                                        isActive 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block h-full fixed z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col h-screen relative overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between px-4 h-16 bg-slate-900 border-b border-slate-800 z-10 sticky top-0">
                    <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                        Campus Connect
                    </div>
                    <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
