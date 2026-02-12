import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, CloudRain, CheckCircle, Loader2 } from 'lucide-react';
import { moodService, type MoodEntry } from '../services/api';

const MoodTracker: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const moods = [
        { id: 'happy', label: 'Feliz / Motivado', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { id: 'calm', label: 'Tranquilo / En paz', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
        { id: 'stressed', label: 'Estresado / Ansioso', icon: Meh, color: 'text-orange-500', bg: 'bg-orange-100' },
        { id: 'exhausted', label: 'Agotado / Quemado', icon: Frown, color: 'text-red-500', bg: 'bg-red-100' },
        { id: 'sad', label: 'Triste / Desanimado', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-100' },
    ];

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await moodService.getHistory();
            if (Array.isArray(data)) {
                setHistory(data.reverse()); // Show newest first
            } else {
                setHistory([]);
                console.warn('Mood history data is not an array:', data);
            }
        } catch (error) {
            console.error('Failed to load mood history', error);
            // Optionally set an error state here to show to user
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedMood) return;
        setIsSaving(true);
        try {
            await moodService.logMood(selectedMood, note);
            setSelectedMood(null);
            setNote('');
            loadHistory(); // Reload history
        } catch (error) {
            console.error('Failed to save mood', error);
            alert('No se pudo guardar el estado de ánimo. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Monitor de Clima Emocional</h2>
                <p className="text-slate-600 mb-6">¿Cómo te sientes hoy, profe? Registrarlo es el primer paso para cuidarte.</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {moods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMood(m.id)}
                            className={`flex flex-col items-center p-4 rounded-xl transition-all border-2
                                ${selectedMood === m.id
                                    ? `border-indigo-600 ${m.bg} ring-2 ring-indigo-200`
                                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            <m.icon size={32} className={`mb-2 ${m.color}`} />
                            <span className="text-sm font-medium text-slate-700 text-center">{m.label}</span>
                        </button>
                    ))}
                </div>

                {selectedMood && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="¿Quieres agregar una nota sobre por qué te sientes así? (Opcional)"
                            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={3}
                        />
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? 'Guardando...' : 'Registrar mi estado'}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Tu Historial Reciente</h3>
                {isLoading ? (
                    <div className="text-center py-8 text-slate-500">
                        <Loader2 className="animate-spin mx-auto mb-2" />
                        Cargando historial...
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic">
                        No hay registros aún. ¡Empieza hoy!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((entry, index) => {
                            const moodConfig = moods.find(m => m.id === entry.mood);
                            const Icon = moodConfig?.icon || Meh;
                            return (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className={`p-2 rounded-full ${moodConfig?.bg || 'bg-gray-100'}`}>
                                        <Icon size={20} className={moodConfig?.color || 'text-gray-500'} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900">{moodConfig?.label || entry.mood}</span>
                                            <span className="text-xs text-slate-500">
                                                {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}
                                            </span>
                                        </div>
                                        {entry.note && <p className="text-slate-600 mt-1 text-sm">{entry.note}</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTracker;
