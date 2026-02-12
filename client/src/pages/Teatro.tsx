import React from 'react';
import { ArrowLeft, MessageCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Teatro: React.FC = () => {
    const navigate = useNavigate();

    const handleWhatsApp = () => {
        // WhatsApp format: https://wa.me/number
        window.open('https://wa.me/595961335196', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                Volver al inicio
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Técnicas Teatrales para Docentes</h1>
                    <p className="text-rose-100 text-lg">
                        Herramientas expresivas para el aula y la vida.
                    </p>
                </div>

                <div className="p-8">
                    {/* Video Section */}
                    <div className="mb-10">
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-4">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/_fvW7-nid2Q?start=1278"
                                title="Técnicas Teatrales para Docentes"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                                <p className="text-blue-700 text-sm">
                                    Este video incluye una presentación especial que comienza en el minuto 21:18.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trainers Section */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Con Pablo Di Genova y Marcela Gilabert</h2>

                        {/* Placeholder for Photo */}
                        <div className="max-w-md mx-auto aspect-[4/3] bg-slate-200 rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-300">
                            <div className="text-center text-slate-500 p-6">
                                <p className="font-medium">Foto de Pablo Di Genova y Marcela Gilabert</p>
                                <p className="text-xs mt-2">(Imagen pendiente de carga)</p>
                            </div>
                            {/* 
                                TODO: Replace the div above with the actual image once provided.
                                Example: <img src={photoUrl} alt="Pablo y Marcela" className="w-full h-full object-cover rounded-xl" />
                            */}
                        </div>

                        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Descubre cómo las técnicas teatrales pueden potenciar tu comunicación,
                            mejorar el clima en el aula y brindarte nuevos recursos pedagógicos.
                        </p>
                    </div>

                    {/* CTA Section */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-700 hover:scale-105 transition-all active:scale-95"
                        >
                            <MessageCircle size={28} />
                            <span>Contactar por WhatsApp</span>
                        </button>
                    </div>
                    <p className="text-center text-slate-400 text-sm mt-4">
                        +595 961 335196
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Teatro;
