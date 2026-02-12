import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Gift, Sparkles } from 'lucide-react';
import ManifestationBox from '../components/ManifestationBox';

const Pomodoro: React.FC = () => {
    const FOCUS_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [isManifestationOpen, setIsManifestationOpen] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound here
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const setTimerMode = (newMode: 'focus' | 'break') => {
        setMode(newMode);
        setIsActive(false);
        // Explicitly set the time based on the new mode immediately
        if (newMode === 'focus') {
            setTimeLeft(FOCUS_TIME);
        } else {
            setTimeLeft(BREAK_TIME);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Recreo Mental</h2>
                <p className="text-slate-500 mb-8">
                    Alterna bloques de corrección/planificación con descansos reales. Tu cerebro te lo agradecerá.
                </p>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setTimerMode('focus')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all
                        ${mode === 'focus'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <BookOpen size={18} />
                        Foco (25m)
                    </button>
                    <button
                        onClick={() => setTimerMode('break')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all
                        ${mode === 'break'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Coffee size={18} />
                        Descanso (5m)
                    </button>
                </div>

                <div className="text-8xl font-black text-slate-800 tracking-tighter mb-8 font-mono">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={toggleTimer}
                        className={`p-6 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all
                        ${isActive ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    >
                        {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-6 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all hover:rotate-180"
                    >
                        <RotateCcw size={32} />
                    </button>
                </div>
            </div>



            {/* Manifestation Box Banner */}
            <div
                onClick={() => setIsManifestationOpen(true)}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white shadow-lg cursor-pointer group transform transition-all hover:scale-[1.01] hover:shadow-xl text-left"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none group-hover:bg-white/30 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-2">
                            <Sparkles size={14} />
                            <span>Mensaje del Universo</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">Caja de la Abundancia</h3>
                        <p className="text-orange-50 text-sm max-w-md">
                            Tómate un descanso y recibe un mensaje para sintonizar con la gratitud.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Gift size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl text-left">
                <h3 className="font-semibold text-indigo-900 mb-2">Tips para tu Recreo:</h3>
                <ul className="list-disc list-inside text-sm text-indigo-800 space-y-2">
                    <li>Aléjate de las pantallas durante el descanso (5 min).</li>
                    <li>Bebe un vaso de agua.</li>
                    <li>Estira el cuello y los hombros.</li>
                    <li>No revises el celular, ¡deja descansar tus ojos!</li>
                </ul>
            </div>

            <ManifestationBox
                isOpen={isManifestationOpen}
                onClose={() => setIsManifestationOpen(false)}
            />
        </div >
    );
};

export default Pomodoro;
