import React, { useState } from 'react';
import { ArrowLeft, Brain, Sparkles, X, ExternalLink, Minimize2, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Game Data Types
type ExternalGame = {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    type: 'external';
    url: string;
    secondaryUrl?: string; // For the dice app
    secondaryTitle?: string;
    image?: string; // Optional cover image
};

type Game = ExternalGame;

const GAMES: Game[] = [
    {
        id: 'poder-personal',
        title: 'Cuánto Sabés de Tu Poder Personal',
        description: 'Juego de cartas para fomentar el diálogo y el autoconocimiento. Incluye dados virtuales.',
        icon: Sparkles,
        color: 'bg-amber-500',
        type: 'external',
        url: 'https://elgranencuentro.netlify.app/',
        secondaryUrl: 'https://dados3d.netlify.app/',
        secondaryTitle: 'Dados Virtuales',
        image: '/images/gran_encuentro.jpg'
    },
    {
        id: 'emociones-game',
        title: 'Cuánto Sabés de Tus Emociones',
        description: 'Juego de recorrido para explorar y validar tus emociones. Incluye dados virtuales.',
        icon: Brain,
        color: 'bg-rose-500',
        type: 'external',
        url: 'https://emociones-boardgame.netlify.app',
        secondaryUrl: 'https://dados3d.netlify.app/',
        secondaryTitle: 'Dados Virtuales',
        image: '/images/emociones.jpg'
    }
];

const Juegos: React.FC = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    // State for the secondary floating window
    const [isSecondaryOpen, setIsSecondaryOpen] = useState(true);

    const startGame = (game: Game) => {
        setSelectedGame(game);
        setIsSecondaryOpen(true);
    };

    const closeGame = () => {
        setSelectedGame(null);
    };

    // Main Game Hub View
    if (!selectedGame) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Volver
                </button>

                <div className="bg-gradient-to-r from-orange-400 to-rose-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <h1 className="text-3xl font-bold mb-2 relative z-10">Zona de Juegos Digitales</h1>
                    <p className="text-orange-50 text-lg relative z-10">Aprende jugando. Herramientas lúdicas para ti y tus alumnos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {GAMES.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => startGame(game)}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full overflow-hidden"
                        >
                            {/* Image Header if available */}
                            {game.image && (
                                <div className="h-48 w-full overflow-hidden relative">
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className={`${game.color} w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 shadow-md`}>
                                            <game.icon size={20} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 flex flex-col flex-grow">
                                {!game.image && (
                                    <div className={`${game.color} w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                        <game.icon size={28} />
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-slate-800 mb-2">{game.title}</h3>
                                <p className="text-slate-600 mb-4 flex-grow">{game.description}</p>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-sm font-medium">
                                    <span className={`
                                        px-2 py-1 rounded-md 
                                        bg-slate-100 text-slate-700
                                    `}>
                                        Juego + Herramientas
                                    </span>
                                    <div className="text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                                        Jugar <ArrowLeft className="rotate-180 ml-1" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // External Game View (Iframe)
    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full h-full max-w-7xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className={`${selectedGame.color} p-4 flex items-center justify-between text-white shadow-md z-10`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <selectedGame.icon size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{selectedGame.title}</h2>
                            <span className="text-xs opacity-90 flex items-center gap-1">
                                <ExternalLink size={12} /> Aplicación externa
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={closeGame}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow bg-slate-100 relative overflow-hidden">
                    {/* Main Game Iframe */}
                    <iframe
                        src={selectedGame.url}
                        className="w-full h-full absolute inset-0"
                        title={selectedGame.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* Secondary Floating Widget (Dice) */}
                    {selectedGame.secondaryUrl && (
                        <div className={`
                            absolute bottom-4 right-4 bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden transition-all duration-300
                            ${isSecondaryOpen ? 'w-80 h-96' : 'w-48 h-12'}
                        `}>
                            <div
                                className="bg-slate-800 text-white p-2 px-3 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors"
                                onClick={() => setIsSecondaryOpen(!isSecondaryOpen)}
                            >
                                <span className="font-bold text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    {selectedGame.secondaryTitle || 'Herramientas'}
                                </span>
                                {isSecondaryOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </div>

                            {isSecondaryOpen && (
                                <div className="w-full h-[calc(100%-2.5rem)] bg-slate-50">
                                    <iframe
                                        src={selectedGame.secondaryUrl}
                                        className="w-full h-full"
                                        title={selectedGame.secondaryTitle}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Juegos;
