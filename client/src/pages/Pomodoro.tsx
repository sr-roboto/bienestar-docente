import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

const Pomodoro: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null; // Correct type for interval

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
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const setTimerMode = (newMode: 'focus' | 'break') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
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

            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl text-left">
                <h3 className="font-semibold text-indigo-900 mb-2">Tips para tu Recreo:</h3>
                <ul className="list-disc list-inside text-sm text-indigo-800 space-y-2">
                    <li>Aléjate de las pantallas durante el descanso (5 min).</li>
                    <li>Bebe un vaso de agua.</li>
                    <li>Estira el cuello y los hombros.</li>
                    <li>No revises el celular, ¡deja descansar tus ojos!</li>
                </ul>
            </div>
        </div>
    );
};

export default Pomodoro;
