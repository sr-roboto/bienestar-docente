import React from 'react';
import { ArrowLeft, MessageCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import marcelaImg from '../assets/marcela.jpg';
import pabloImg from '../assets/pablo.jpg';
import miriamVideo from '../assets/miriam_alvarez.mp4';

const Teatro: React.FC = () => {
    const navigate = useNavigate();

    const handleWhatsApp = () => {
        // WhatsApp format: https://wa.me/number
        window.open('https://wa.me/595961335196', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
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
                    <h1 className="text-3xl font-bold mb-2">Técnicas Teatrales y Bienestar Corporal</h1>
                    <p className="text-rose-100 text-lg">
                        Herramientas expresivas y de salud para el docente.
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
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Nuestros Facilitadores</h2>

                        {/* Photos Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mx-auto">
                            {/* Marcela */}
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white">
                                    <img
                                        src={marcelaImg}
                                        alt="Marcela Gilabert"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Marcela Gilabert</h3>
                                <p className="text-slate-500">Teatro</p>
                            </div>

                            {/* Pablo */}
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white">
                                    <img
                                        src={pabloImg}
                                        alt="Pablo Di Genova"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Pablo Di Genova</h3>
                                <p className="text-slate-500">Teatro</p>
                            </div>

                            {/* Miriam */}
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white bg-black">
                                    <video
                                        src={miriamVideo}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Lic. Miriam Alvarez</h3>
                                <p className="text-slate-500">Nutrición</p>
                            </div>
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
