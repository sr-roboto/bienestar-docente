import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Calendar,
    MessageCircle,
    Users,
    Timer,
    Home,
    LogOut,
    UserCircle,
    X,
    Maximize2,
    Minimize2,
    Video
} from 'lucide-react';
import ChatInterface from './ChatInterface';
import Footer from './Footer';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems: { path: string; icon: React.ElementType; label: string; color?: string }[] = [
        { path: '/', icon: Home, label: 'Inicio' },
        { path: '/planning', icon: Calendar, label: 'Agenda' },
        { path: '/mood', icon: MessageCircle, label: 'Ánimo' },
        { path: '/community', icon: Users, label: 'Comunidad' },
        { path: '/pomodoro', icon: Timer, label: 'Recreo' },
        { path: '/talleres', icon: Video, label: 'Talleres' },
    ];

    // Determine chat context based on current route
    const isAgenda = location.pathname === '/planning';
    const chatContext = isAgenda ? 'planning' : 'general';
    const chatTitle = isAgenda ? 'Asistente de Agenda' : 'Asistente de Bienestar';
    const chatDescription = isAgenda
        ? 'Puedo ayudarte a agendar reuniones y organizar tu tiempo.'
        : 'Estoy aquí para escucharte y apoyarte en lo que necesites.';

    // Auto-open chat if user navigates to agenda explicitly? Maybe not, keep it user controlled.
    // But we can check if it's the first time and maybe show a badge.

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-white border-b border-indigo-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                                <Home size={20} fill="currentColor" />
                            </span>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                                Bienestar Docente
                            </h1>
                        </Link>

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

            {/* Global Footer */}
            <Footer />

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
            </nav>

            {/* Floating Chat Widget */}
            <div className={`fixed bottom-20 md:bottom-8 right-4 z-50 flex flex-col items-end transition-all duration-300 ${isChatOpen ? 'w-full md:w-auto' : ''}`}>

                {isChatOpen && (
                    <div className={`
                        bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden mb-4
                        transition-all duration-300
                        ${isMaximized
                            ? 'fixed top-4 bottom-20 left-4 right-4 md:top-20 md:bottom-24 md:left-auto md:w-[600px]'
                            : 'w-[90vw] md:w-96 h-[500px]'}
                    `}>
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                            >
                                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <ChatInterface
                            key={chatContext} // Force re-render when context changes
                            context={chatContext as any}
                            title={chatTitle}
                            description={chatDescription}
                            initialMessage={isAgenda
                                ? "Hola, soy tu asistente de agenda. ¿Qué reunión o evento te gustaría programar?"
                                : "Hola! Soy tu compañero virtual. ¿Cómo te sientes hoy? Estoy aquí para escucharte."}
                        />
                    </div>
                )}

                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`
                        flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-300
                        ${isChatOpen ? 'bg-indigo-500 rotate-90 scale-0 opacity-0 absolute' : 'bg-indigo-600 hover:bg-indigo-700 text-white scale-100 opacity-100'}
                    `}
                >
                    <MessageCircle size={28} fill="currentColor" />
                </button>

                {/* Close button when open (alternative to the one inside) or cleaner just to have the FAB transform? 
                    Let's just keep the FAB visible if closed, and maybe a different trigger if open.
                    Actually, common pattern is FAB becomes close button or disappears. 
                */}
                {isChatOpen && (
                    <button
                        onClick={() => setIsChatOpen(false)}
                        className="bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-900 transition-all duration-200"
                    >
                        <X size={28} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Layout;
