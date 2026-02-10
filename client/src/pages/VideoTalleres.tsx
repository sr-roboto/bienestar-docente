import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlayCircle, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Workshop {
    id: number;
    title: string;
    duration: string;
    description: string;
    videoId: string;
}

const workshops: Workshop[] = [
    {
        id: 1,
        title: "El motor de la vida (Aprendemos Juntos)",
        duration: "55 min",
        description: "Gabriel Rolón reflexiona sobre el deseo, la falta y la soledad como motores de la vida.",
        videoId: "jW0i9J4L11I"
    },
    {
        id: 2,
        title: "Historias de Diván: La Infidelidad",
        duration: "35 min",
        description: "Episodio completo de la serie. Un caso profundo sobre la confianza y el dolor.",
        videoId: "VsFzYcmNVzE"
    },
    {
        id: 3,
        title: "¿Existe la felicidad?",
        duration: "25 min",
        description: "Debate profundo sobre la felicidad, el goce y el sentido de la vida.",
        videoId: "2tX2-3eP8J0"
    }
];

const VideoTalleres: React.FC = () => {
    const navigate = useNavigate();
    const [completed, setCompleted] = useState<number[]>([]);
    const [activeVideo, setActiveVideo] = useState<Workshop | null>(null);

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
        <div className="space-y-6 relative">
            {/* Video Modal */}
            {activeVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="relative pt-[56.25%] bg-black">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&origin=${window.location.origin}&modestbranding=1&rel=0`}
                                title={activeVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-6 flex justify-between items-start bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{activeVideo.title}</h3>
                                <p className="text-slate-600 mt-1">{activeVideo.description}</p>
                                <a
                                    href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                >
                                    <span>Ver directamente en YouTube</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </a>
                            </div>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={() => setActiveVideo(null)}></div>
                </div>
            )}

            <button
                onClick={() => navigate('/')}
                className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver
            </button>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">Video-Talleres</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Espacio de reflexión y aprendizaje con el Lic. Gabriel Rolón.
                        Herramientas para el bienestar emocional docente.
                    </p>

                    <div className="mt-8 bg-white/10 rounded-xl p-5 backdrop-blur-md border border-white/20">
                        <div className="flex justify-between text-sm mb-3 font-medium text-blue-50">
                            <span>Tu Progreso</span>
                            <span>{progress}% Completado</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-white/90 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {workshops.map((workshop) => (
                    <div
                        key={workshop.id}
                        onClick={() => setActiveVideo(workshop)}
                        className={`
                            bg-white rounded-2xl p-5 shadow-sm border border-slate-100 
                            flex flex-col md:flex-row items-start md:items-center gap-5
                            transition-all duration-300 group cursor-pointer
                            ${completed.includes(workshop.id) ? 'bg-slate-50/80' : 'hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100'}
                        `}
                    >
                        <div className="relative flex-shrink-0 w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-slate-200">
                            <img
                                src={`https://img.youtube.com/vi/${workshop.videoId}/mqdefault.jpg`}
                                alt={workshop.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <PlayCircle size={20} className="text-indigo-600 ml-0.5" />
                                </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                {workshop.duration}
                            </span>
                        </div>

                        <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className={`font-bold text-lg leading-tight mb-2 group-hover:text-indigo-700 transition-colors ${completed.includes(workshop.id) ? 'text-slate-500' : 'text-slate-800'}`}>
                                        {workshop.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{workshop.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`
                                    text-xs font-semibold px-2.5 py-1 rounded-full border
                                    ${completed.includes(workshop.id)
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'}
                                `}>
                                    {completed.includes(workshop.id) ? 'Visto' : 'Pendiente'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(workshop.id);
                            }}
                            className={`
                                self-center md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
                                ${completed.includes(workshop.id)
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 group-hover:bg-white group-hover:shadow-md'}
                            `}
                        >
                            {completed.includes(workshop.id) ? (
                                <CheckCircle size={20} />
                            ) : (
                                <Circle size={20} />
                            )}
                            <span className="hidden md:inline">{completed.includes(workshop.id) ? 'Completado' : 'Marcar visto'}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoTalleres;
