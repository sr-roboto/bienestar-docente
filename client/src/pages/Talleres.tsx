import React from 'react';
import { ArrowLeft, MessageCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Talleres: React.FC = () => {
    const navigate = useNavigate();

    const handleContact = () => {
        window.open('https://wa.me/558899445798', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                Volver al inicio
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <Video size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">Talleres con Mayra Cerrotta</h1>
                    </div>

                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Explora nuestros talleres exclusivos diseñados para tu bienestar y desarrollo profesional.
                        Mira el video de presentación a continuación y contáctanos para más información.
                    </p>

                    {/* Video Container */}
                    <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg mb-10 group">
                        {/* Placeholder for video - if the user provides the file later, simple src update needed */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                             <Video size={64} className="mb-4 opacity-50" />
                             <p>El video de presentación estará disponible pronto</p>
                        </div>
                        {/* 
                           If video file existed:
                           <video controls className="w-full h-full object-cover">
                               <source src="/path/to/video.mp4" type="video/mp4" />
                               Tu navegador no soporta el elemento de video.
                           </video>
                        */}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                            ¿Te interesan nuestros talleres?
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Comunícate directamente con Mayra para inscripciones, dudas y más detalles.
                        </p>
                        <button
                            onClick={handleContact}
                            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <MessageCircle size={24} className="mr-2" />
                            Contactate con Mayra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Talleres;
