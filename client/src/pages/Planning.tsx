import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Planning: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-indigo-800">
                            Asistente de Organización Inteligente
                        </h3>
                        <div className="mt-2 text-sm text-indigo-700">
                            <p>
                                Organiza tu semana para recuperar tu tiempo libre. Prioricemos juntos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ChatInterface
                context="planning"
                title="Planificación Docente"
                description="Ayudante para gestión de tiempo, priorización de tareas y evitar el burnout."
                initialMessage="Hola profe. ¿Qué tareas tienes pendientes para esta semana? Vamos a organizarlas para que no te lleves trabajo a casa."
                placeholder="Ej: Tengo 30 pruebas por corregir y una reunión..."
            />
        </div>
    );
};

export default Planning;
