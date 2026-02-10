import React, { useState } from 'react';
import { ArrowLeft, Brain, Sparkles, X, RotateCcw, Gamepad2, Dices, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Game Data Types
type Question = {
    text: string;
    options: string[];
    correctIndex: number;
};

type BaseGame = {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
};

type QuizGame = BaseGame & {
    type: 'quiz';
    questions: Question[];
};

type ExternalGame = BaseGame & {
    type: 'external';
    url: string;
};

type Game = QuizGame | ExternalGame;

const GAMES: Game[] = [
    {
        id: 'encuentro',
        title: 'El Gran Encuentro',
        description: 'Juego de cartas para fomentar el diálogo y el conocimiento personal.',
        icon: Gamepad2,
        color: 'bg-violet-500',
        type: 'external',
        url: 'https://elgranencuentro.netlify.app/'
    },
    {
        id: 'dados',
        title: 'Dados 3D',
        description: 'Dados virtuales para dinámicas de grupo y juegos de azar.',
        icon: Dices,
        color: 'bg-emerald-500',
        type: 'external',
        url: 'https://dados3d.netlify.app/'
    },
    {
        id: 'emociones',
        title: 'Cuánto Sabés de Tus Emociones',
        description: 'Pon a prueba tu inteligencia emocional con este pequeño desafío.',
        icon: Brain,
        color: 'bg-rose-500',
        type: 'quiz',
        questions: [
            {
                text: "¿Cuál es la función principal del miedo?",
                options: ["Paralizarnos", "Protegernos de una amenaza", "Hacernos débiles", "Enojarnos"],
                correctIndex: 1
            },
            {
                text: "¿Qué significa 'validar' una emoción?",
                options: ["Estar de acuerdo con ella", "Aceptarla sin juzgar", "Ignorarla", "Analizarla lógicamente"],
                correctIndex: 1
            },
            {
                text: "El 'burnout' se caracteriza principalmente por:",
                options: ["Tener mucho sueño", "Agotamiento emocional, despersonalización y baja realización", "Estar aburrido", "Querer vacaciones"],
                correctIndex: 1
            },
            {
                text: "¿Cuál es una técnica efectiva de regulación emocional inmediata?",
                options: ["Respiración profunda", "Gritar fuerte", "Comer rápido", "Mirar el celular"],
                correctIndex: 0
            }
        ]
    },
    {
        id: 'poder',
        title: 'Cuánto Sabés de Tu Poder Personal',
        description: 'Descubre herramientas para fortalecer tu autoestima y liderazgo.',
        icon: Sparkles,
        color: 'bg-amber-500',
        type: 'quiz',
        questions: [
            {
                text: "¿Qué es el locus de control interno?",
                options: ["Creer que todo es suerte", "Creer que tenemos control sobre nuestras acciones y resultados", "Controlar a los demás", "Dejar que otros decidan"],
                correctIndex: 1
            },
            {
                text: "La asertividad es:",
                options: ["Decir siempre que sí", "Imponer mi opinión", "Expresar mis necesidades respetando las de otros", "No decir nada para evitar conflictos"],
                correctIndex: 2
            },
            {
                text: "¿Cómo se construye la autoconfianza?",
                options: ["Con pequeños logros y cumpliendo promesas a uno mismo", "Esperando que otros nos elogien", "Siendo perfecto", "No fallando nunca"],
                correctIndex: 0
            },
            {
                text: "El autodiálogo positivo ayuda a:",
                options: ["Engañarnos", "Reducir el estrés y mejorar el rendimiento", "Ser vanidoso", "Nada en particular"],
                correctIndex: 1
            }
        ]
    }
];

const Juegos: React.FC = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const startGame = (game: Game) => {
        setSelectedGame(game);
        if (game.type === 'quiz') {
            setCurrentQuestionIdx(0);
            setScore(0);
            setShowResults(false);
        }
    };

    const handleAnswer = (optionIdx: number) => {
        if (!selectedGame || selectedGame.type !== 'quiz') return;

        if (optionIdx === selectedGame.questions[currentQuestionIdx].correctIndex) {
            setScore(prev => prev + 1);
        }

        if (currentQuestionIdx < selectedGame.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        if (selectedGame) startGame(selectedGame);
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMES.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => startGame(game)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className={`${game.color} w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                <game.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{game.title}</h3>
                            <p className="text-slate-600 mb-4 flex-grow">{game.description}</p>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-sm font-medium">
                                <span className={`
                                    px-2 py-1 rounded-md 
                                    ${game.type === 'external' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}
                                `}>
                                    {game.type === 'external' ? 'App Externa' : 'Quiz Interactivo'}
                                </span>
                                <div className="text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                                    Jugar <ArrowLeft className="rotate-180 ml-1" size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // External Game View (Iframe)
    if (selectedGame.type === 'external') {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full h-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
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
                    <div className="flex-grow bg-slate-100 relative">
                        <iframe
                            src={selectedGame.url}
                            className="w-full h-full absolute inset-0"
                            title={selectedGame.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Active Quiz View
    const question = selectedGame.questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + (showResults ? 1 : 0)) / selectedGame.questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={closeGame}
                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4"
            >
                <X size={20} className="mr-1" />
                Salir del juego
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className={`${selectedGame.color} p-6 text-white`}>
                    <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                    {!showResults && (
                        <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
                            <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {showResults ? (
                        <div className="text-center py-8">
                            <div className="inline-block p-4 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                                <Sparkles size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Juego Completado!</h3>
                            <p className="text-slate-600 text-lg mb-6">
                                Tu puntaje: <span className="font-bold text-indigo-600 text-2xl">{score}</span> / {selectedGame.questions.length}
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={closeGame}
                                    className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Volver al Menú
                                </button>
                                <button
                                    onClick={resetQuiz}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <RotateCcw size={18} className="mr-2" />
                                    Jugar de nuevo
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                                Pregunta {currentQuestionIdx + 1} de {selectedGame.questions.length}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                                {question.text}
                            </h3>

                            <div className="space-y-3">
                                {question.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 font-medium transition-all duration-200"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Juegos;
