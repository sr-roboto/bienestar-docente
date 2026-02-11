import React, { useState } from 'react';
import { Gift, X, Sparkles, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
    "El amor vive en mí",
    "Agradecer lo que NO fue, puede cambiarte la perspectiva",
    "Estás donde tienes que estar y los demás también",
    "Agradeciendo cada noche, comienzas el siguiente día con predisposición y energía",
    "La comida es medicina",
    "Sos único pero no indispensable. Liberate de los apegos que te condicionan",
    "Hoy elijo pausar antes de reaccionar; mi paz es mi mayor poder.",
    "Habito mi cuerpo con amabilidad; escucho lo que necesita hoy.",
    "Suelto la prisa y confío en el ritmo natural de mis procesos.",
    "Mi bienestar comienza con un respiro profundo y consciente.",
    "Decir 'no' a otros es, a veces, decirme 'sí' a mí mismo/a.",
    "Merezco el descanso tanto como el éxito; hoy me doy permiso para ser.",
    "Nutro mi mente con pensamientos que me expanden, elimino los pensamientos que me limitan.",
    "Hoy establezco un límite amoroso que protege mi energía vital.",
    "Agradezco lo que soy, lo que tengo y lo que está en camino.",
    "Enfoco mi atención en lo que florece, dejando ir el sentimiento de “falta”.",
    "Soy un imán para situaciones que traen serenidad y alegría a mi vida.",
    "Transformo mi cansancio en una oportunidad para rediseñar mis prioridades.",
    "Hoy elijo enseñar y actuar desde mi centro.",
    "Mi bienestar es la semilla de todo lo que creo y comparto con el mundo.",
    "Suelto lo que ya no me habita para hacer espacio a lo que me hace bien.",
    "Agradezco el aprendizaje y dejo ir.",
    "Mi bienestar depende de mi capacidad de fluir con el cambio.",
    "Soy el observador de mis emociones, sin ser el esclavo de mis recuerdos.",
    "Me desapego del resultado para disfrutar plenamente del proceso.",
    "Mi paz interior es un jardín que cultivo yo, está dentro de mí.",
    "Amar sin poseer es la forma más alta de bienestar y libertad.",
    "Soy quien sigue aquí, presente.",
    "Me libero de la necesidad de aprobación; mi validación nace de mi propio cuidado.",
    "El apego a las expectativas es la raíz del estrés; hoy elijo la aceptación.",
    "Hoy suelto el control y abrazo la confianza.",
    "Mi valor está en lo que soy.",
    "Libero el pasado para habitar mi presente con plenitud."
];

interface ManifestationBoxProps {
    isOpen: boolean;
    onClose: () => void;
}

const ManifestationBox: React.FC<ManifestationBoxProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'closed' | 'shaking' | 'open'>('closed');
    const [phrase, setPhrase] = useState<string>('');

    const handleBoxClick = () => {
        if (step !== 'closed') return;

        setStep('shaking');

        // Pick a random phrase
        const randomPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        setPhrase(randomPhrase);

        // Simulate opening delay
        setTimeout(() => {
            setStep('open');
        }, 1500);
    };

    const reset = () => {
        setStep('closed');
        setPhrase('');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                onClick={handleClose}
            >
                <div
                    className="relative w-full max-w-lg bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleClose}
                        className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <div className="flex flex-col items-center justify-center min-h-[400px]">

                        {/* Title/Prompt */}
                        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
                            {step === 'open'
                                ? "¿Qué es lo mejor para mi hoy?"
                                : "¿Qué necesito escuchar hoy?"}
                        </h2>

                        {/* The Box */}
                        <div className="relative cursor-pointer group" onClick={handleBoxClick}>
                            {step !== 'open' && (
                                <motion.div
                                    animate={step === 'shaking' ? {
                                        rotate: [-2, 2, -2, 2, 0],
                                        scale: [1, 1.05, 1, 1.05, 1],
                                        y: [0, -5, 0, -5, 0]
                                    } : {
                                        y: [0, -10, 0]
                                    }}
                                    transition={step === 'shaking' ? {
                                        duration: 0.5,
                                        repeat: 2
                                    } : {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative z-10"
                                >
                                    <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 rounded-3xl shadow-[0_20px_50px_rgba(251,191,36,0.5)] flex items-center justify-center border-4 border-yellow-200">
                                        <Gift size={80} className="text-white drop-shadow-md" />
                                        <div className="absolute inset-0 bg-white/20 rounded-3xl pointer-events-none"></div>

                                        {/* Glow effect */}
                                        <div className="absolute -inset-4 bg-yellow-400/30 rounded-full blur-2xl -z-10 animate-pulse"></div>
                                    </div>

                                    <div className="absolute -bottom-8 left-0 right-0 text-center">
                                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-medium text-sm animate-bounce">
                                            {step === 'shaking' ? "Abriendo..." : "Toca para abrir"}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* The Card (Phrase) */}
                            {step === 'open' && (
                                <motion.div
                                    initial={{ scale: 0, y: 50, opacity: 0, rotateX: 90 }}
                                    animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="relative z-20 w-full max-w-sm"
                                >
                                    <div className="bg-white rounded-2xl p-8 shadow-2xl border border-indigo-50 relative overflow-hidden text-center min-h-[300px] flex flex-col items-center justify-center gap-6">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-purple-500"></div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-2">
                                            <Sparkles size={32} />
                                        </div>

                                        <div className="relative">
                                            <Quote size={24} className="absolute -top-4 -left-4 text-slate-200" />
                                            <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed font-handwriting">
                                                "{phrase}"
                                            </p>
                                            <Quote size={24} className="absolute -bottom-4 -right-4 text-slate-200 rotate-180" />
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 w-full">
                                            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Tómalo o déjalo ir</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={reset}
                                        className="mt-8 w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold backdrop-blur-sm transition-all"
                                    >
                                        Abrir otra vez
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ManifestationBox;
