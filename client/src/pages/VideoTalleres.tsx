import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlayCircle, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Workshop {
    id: number;
    title: string;
    duration: string;
    description: string;
}

const workshops: Workshop[] = [
    {
        id: 1,
        title: "Introducción al Mindfulness",
        duration: "15 min",
        description: "Aprende las bases de la atención plena para reducir el estrés en el aula."
    },
    {
        id: 2,
        title: "Gestión de Emociones Difíciles",
        duration: "20 min",
        description: "Técnicas para manejar la frustración y el enojo propio y de los alumnos."
    },
    {
        id: 3,
        title: "Comunicación Asertiva",
        duration: "18 min",
        description: "Cómo poner límites y expresar necesidades de forma clara y respetuosa."
    },
    {
        id: 4,
        title: "Autocuidado para Docentes",
        duration: "12 min",
        description: "Pequeñas rutinas diarias para evitar el agotamiento o burnout."
    },
    {
        id: 5,
        title: "Resiliencia en la Educación",
        duration: "25 min",
        description: "Fortaleciendo nuestra capacidad de adaptación ante los cambios."
    }
];

const VideoTalleres: React.FC = () => {
    const navigate = useNavigate();
    const [completed, setCompleted] = useState<number[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('completedWorkshops');
        if (saved) {
            setCompleted(JSON.parse(saved));
        }
    }, []);

    const toggleComplete = (id: number) => {
        const newCompleted = completed.includes(id)
            ? completed.filter(c => c !== id)
            : [...completed, id];

        setCompleted(newCompleted);
        localStorage.setItem('completedWorkshops', JSON.stringify(newCompleted));
    };

    const progress = Math.round((completed.length / workshops.length) * 100);

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Volver
            </button>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Video-Talleres</h1>
                <p className="text-blue-100 text-lg">Capacítate a tu ritmo y cultiva tu bienestar profesional.</p>

                <div className="mt-6 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span>Tu Progreso</span>
                        <span>{progress}% Completado</span>
                    </div>
                    <div className="w-full bg-blue-900/40 rounded-full h-3">
                        <div
                            className="bg-white h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {workshops.map((workshop) => (
                    <div
                        key={workshop.id}
                        className={`
                            bg-white rounded-xl p-5 shadow-sm border border-slate-100 
                            flex flex-col md:flex-row items-start md:items-center gap-4 
                            transition-all duration-200
                            ${completed.includes(workshop.id) ? 'bg-slate-50 opacity-90' : 'hover:shadow-md'}
                        `}
                    >
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
                            <PlayCircle size={32} />
                        </div>

                        <div className="flex-grow">
                            <h3 className={`font-bold text-lg ${completed.includes(workshop.id) ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                {workshop.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-1">{workshop.description}</p>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                {workshop.duration}
                            </span>
                        </div>

                        <button
                            onClick={() => toggleComplete(workshop.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                                ${completed.includes(workshop.id)
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                            `}
                        >
                            {completed.includes(workshop.id) ? (
                                <>
                                    <CheckCircle size={18} />
                                    Completado
                                </>
                            ) : (
                                <>
                                    <Circle size={18} />
                                    Marcar como visto
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoTalleres;
