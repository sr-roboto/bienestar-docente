import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle, Users, Timer, ArrowRight, Quote, Heart, Video, Gamepad2 } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const [quote, setQuote] = React.useState({
        text: "La enseñanza que deja huella no es la que se hace de cabeza a cabeza, sino de corazón a corazón.",
        author: "Howard G. Hendricks"
    });

    const quotes = [
        { text: "Respirar también es parte del trabajo docente.", author: "Bienestar Docente" },
        { text: "No todo se resuelve hoy. Y está bien.", author: "Bienestar Docente" },
        { text: "Cuidarte no te quita compromiso, te da continuidad.", author: "Bienestar Docente" },
        { text: "Un docente en calma enseña mejor.", author: "Bienestar Docente" },
        { text: "El descanso también educa.", author: "Bienestar Docente" },
        { text: "Lo que sembrás hoy, florece cuando menos lo esperás.", author: "Bienestar Docente" },
        { text: "Educar no siempre se nota… hasta que cambia una vida.", author: "Bienestar Docente" },
        { text: "No sos solo lo que explicás, sos lo que inspirás.", author: "Bienestar Docente" },
        { text: "Ser docente es dejar huellas invisibles.", author: "Bienestar Docente" },
        { text: "Tu trabajo importa, incluso cuando nadie lo dice.", author: "Bienestar Docente" },
        { text: "No estás cansado de enseñar, estás cansado de sostener.", author: "Bienestar Docente" },
        { text: "Pedir ayuda también es un acto de valentía docente.", author: "Bienestar Docente" },
        { text: "Seguir enseñando en contextos difíciles es un logro enorme.", author: "Bienestar Docente" },
        { text: "No todo depende de vos, aunque hagas mucho.", author: "Bienestar Docente" },
        { text: "Ser fuerte no es aguantar todo, es saber cuándo parar.", author: "Bienestar Docente" },
        { text: "La educación cambia cuando el docente se siente acompañado.", author: "Bienestar Docente" },
        { text: "Cuidar al que enseña es cuidar el futuro.", author: "Bienestar Docente" },
        { text: "Un docente cuidado transforma aulas.", author: "Bienestar Docente" },
        { text: "No estás solo: educar también es un trabajo colectivo.", author: "Bienestar Docente" },
        { text: "Tu bienestar también educa.", author: "Bienestar Docente" },
    ];

    const changeQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    };

    const features = [
        {
            title: 'Agenda y Planificación',
            description: 'Organiza tus clases y eventos escolares.',
            icon: Calendar,
            path: '/planning',
            color: 'bg-indigo-500',
            lightColor: 'bg-indigo-50',
            textColor: 'text-indigo-600',
        },
        {
            title: 'Seguimiento de Ánimo',
            description: 'Registra y reflexiona sobre tu bienestar emocional.',
            icon: MessageCircle,
            path: '/mood',
            color: 'bg-purple-500',
            lightColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: 'Video-Talleres',
            description: 'Clases grabadas para tu bienestar y desarrollo.',
            icon: Video,
            path: '/workshops',
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Zona de Juegos',
            description: 'Diviértete y descubre más sobre tus emociones.',
            icon: Gamepad2,
            path: '/games',
            color: 'bg-orange-500',
            lightColor: 'bg-orange-50',
            textColor: 'text-orange-600',
        },
        {
            title: 'Talleres con Mayra Cerrotta',
            description: 'Talleres exclusivos para tu bienestar.',
            icon: Video,
            path: '/talleres',
            color: 'bg-orange-500',
            lightColor: 'bg-orange-50',
            textColor: 'text-orange-600',
        },
        {
            title: 'Comunidad',
            description: 'Conecta con otros docentes y comparte experiencias.',
            icon: Users,
            path: '/community',
            color: 'bg-pink-500',
            lightColor: 'bg-pink-50',
            textColor: 'text-pink-600',
        },
        {
            title: 'Recreo Mental',
            description: 'Tómate un descanso con técnicas de Pomodoro.',
            icon: Timer,
            path: '/pomodoro',
            color: 'bg-teal-500',
            lightColor: 'bg-teal-50',
            textColor: 'text-teal-600',
        },
        {
            title: 'Contenido Inclusivo',
            description: 'Aplicaciones y recursos de Proyecto DANE.',
            icon: Heart,
            path: 'https://www.proyectodane.org/aplicaciones/',
            color: 'bg-red-500',
            lightColor: 'bg-red-50',
            textColor: 'text-red-600',
        },
    ];

    const currentTime = new Date();
    const hour = currentTime.getHours();
    let greeting = 'Buenos días';
    if (hour >= 12 && hour < 20) greeting = 'Buenas tardes';
    if (hour >= 20) greeting = 'Buenas noches';

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">{greeting}, docente.</h1>
                <p className="text-indigo-100 text-lg max-w-2xl">
                    Bienvenido a tu espacio personal de bienestar. ¿Cómo te gustaría empezar hoy?
                </p>
            </div>

            {/* Daily Quote/Tip Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600 flex-shrink-0">
                    <Quote size={24} fill="currentColor" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-semibold text-slate-800 mb-1">Frase del día</h3>
                    <p className="text-slate-600 italic transition-opacity duration-300">
                        "{quote.text}"
                    </p>
                    <p className="text-slate-400 text-sm mt-2">— {quote.author}</p>
                </div>
                <button
                    onClick={changeQuote}
                    className="mt-2 md:mt-0 px-4 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                >
                    Nueva Frase
                </button>
            </div>



            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            if (feature.path.startsWith('http')) {
                                window.open(feature.path, '_blank', 'noopener,noreferrer');
                            } else {
                                navigate(feature.path);
                            }
                        }}
                        className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${feature.lightColor} ${feature.textColor}`}>
                                <feature.icon size={28} />
                            </div>
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                text-slate-300 group-hover:bg-slate-50 group-hover:text-slate-600 
                transition-all duration-200
              `}>
                                <ArrowRight size={20} />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-slate-500 mb-4 flex-grow">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer / Helper Text */}
            <div className="text-center text-slate-400 text-sm mt-8">
                Recuerda que también puedes usar el asistente de chat en la esquina inferior para ayuda rápida.
            </div>

        </div>
    );
};

export default Home;
