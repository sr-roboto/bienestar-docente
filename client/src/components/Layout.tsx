import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Heart,
    Calendar,
    MessageCircle,
    Users,
    Timer,
    Home,
    LogOut,
    UserCircle
} from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Inicio' },
        { path: '/crisis', icon: Heart, label: 'Crisis', color: 'text-red-500' },
        { path: '/planning', icon: Calendar, label: 'Agenda' },
        { path: '/mood', icon: MessageCircle, label: 'Ánimo' },
        { path: '/community', icon: Users, label: 'Comunidad' },
        { path: '/pomodoro', icon: Timer, label: 'Recreo' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-white border-b border-indigo-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                                <Heart size={20} fill="currentColor" />
                            </span>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                                Bienestar Docente
                            </h1>
                        </div>

                        <nav className="hidden md:flex space-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200
                                        ${location.pathname === item.path
                                            ? 'border-indigo-500 text-indigo-700'
                                            : 'border-transparent text-slate-500 hover:text-indigo-600 hover:border-indigo-300'
                                        }`}
                                >
                                    <item.icon size={16} className={`mr-1.5 ${item.color || ''}`} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="text-slate-500 hover:text-indigo-600" title="Perfil">
                                <UserCircle size={24} />
                            </Link>
                            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600" title="Cerrar Sesión">
                                <LogOut size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
                <Outlet />
            </main>

            {/* Mobile Navigation */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-20">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full p-1
                            ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] mt-1">{item.label}</span>
                    </Link>
                ))}
                <Link
                    to="/profile"
                    className={`flex flex-col items-center justify-center w-full p-1
                        ${location.pathname === '/profile' ? 'text-indigo-600' : 'text-slate-400'}`}
                >
                    <UserCircle size={20} />
                    <span className="text-[10px] mt-1">Perfil</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
