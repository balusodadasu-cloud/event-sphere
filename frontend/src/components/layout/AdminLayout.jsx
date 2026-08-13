import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, GraduationCap, UserCog, Users, ClipboardList, Award, Trophy, Bell, Image as ImageIcon, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateInitials } from '../../utils/helpers';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Events', path: '/admin/events', icon: CalendarDays },
        { name: 'Students', path: '/admin/students', icon: GraduationCap },
        { name: 'Faculty', path: '/admin/faculty', icon: UserCog },
        { name: 'Clubs', path: '/admin/clubs', icon: Users },
        { name: 'Registrations', path: '/admin/registrations', icon: ClipboardList },
        { name: 'Certificates', path: '/admin/certificates', icon: Award },
        { name: 'Results', path: '/admin/results', icon: Trophy },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 w-64 text-slate-300">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">Admin Panel</h2>
                    <div className="flex items-center space-x-2 mt-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {generateInitials(user?.name)}
                        </div>
                        <p className="text-sm text-slate-300 font-medium truncate">{user?.name}</p>
                    </div>
                </div>
                <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
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
            <aside className="hidden md:block h-full fixed z-20">
                <SidebarContent />
            </aside>

            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden" onClick={toggleSidebar}></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            <main className="flex-1 md:ml-64 flex flex-col h-screen relative overflow-hidden">
                <header className="md:hidden flex items-center justify-between px-4 h-16 bg-slate-900 border-b border-slate-800 z-10 sticky top-0">
                    <div className="font-bold text-lg text-white">Admin Panel</div>
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

export default AdminLayout;
