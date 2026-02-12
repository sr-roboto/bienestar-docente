import React from 'react';
import { ArrowLeft, MessageCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mayraVideo from '../assets/mayra_bienestar.mp4';
import tallerChicosVideo from '../assets/taller_chicos.mp4';

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

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Video 1: Presentación */}
                        <div className="space-y-3">
                            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg group">
                                <video controls className="w-full h-full object-cover">
                                    <source src={mayraVideo} type="video/mp4" />
                                    Tu navegador no soporta el elemento de video.
                                </video>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Presentación General</h3>
                            <p className="text-slate-500 text-sm">Descubre de qué se tratan nuestros talleres y cómo pueden ayudarte.</p>
                        </div>

                        {/* Video 2: Taller con Chicos */}
                        <div className="space-y-3">
                            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg group">
                                <video controls className="w-full h-full object-cover">
                                    <source src={tallerChicosVideo} type="video/mp4" />
                                    Tu navegador no soporta el elemento de video.
                                </video>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Taller para Niños</h3>
                            <p className="text-slate-500 text-sm">Una muestra de nuestras dinámicas y actividades con los más jóvenes.</p>
                        </div>

                        {/* Video 3: Hora de Respirar */}
                        <div className="space-y-3">
                            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg group">
                                <iframe
                                    src="https://drive.google.com/file/d/15KrLlorDX-dtu0kUzxVVhO962oe0na84/preview"
                                    className="w-full h-full border-0"
                                    allow="autoplay"
                                    title="Hora de Respirar"
                                ></iframe>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Hora de Respirar</h3>
                            <p className="text-slate-500 text-sm">Ejercicios guiados para encontrar la calma en tu día.</p>
                        </div>

                        {/* Video 4: Respiración Bástrica */}
                        <div className="space-y-3">
                            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg group">
                                <iframe
                                    src="https://drive.google.com/file/d/15IfuSClbkXgk0dYY6MNScx7buIdI4iV8/preview"
                                    className="w-full h-full border-0"
                                    allow="autoplay"
                                    title="Respiración Bástrica"
                                ></iframe>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Respiración Bástrica</h3>
                            <p className="text-slate-500 text-sm">Técnica de respiración energizante para renovar tu vitalidad.</p>
                        </div>
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
