import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-slate-600 font-medium">
                        Una iniciativa de <span className="font-bold text-indigo-600">La Clase Digital</span>
                    </p>
                    <a
                        href="https://www.instagram.com/laclasedigital"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors"
                    >
                        <div className="p-2 bg-slate-100 rounded-full hover:bg-pink-50 transition-colors">
                            <Instagram size={24} />
                        </div>
                        <span className="text-sm font-medium">@laclasedigital</span>
                    </a>
                    <p className="text-xs text-slate-400 mt-4">
                        © {new Date().getFullYear()} Bienestar Docente. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
