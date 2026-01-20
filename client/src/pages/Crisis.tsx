import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Crisis: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Modo de Emergencia Emocional
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>
                                Respira. Estoy aquí para acompañarte. Si necesitas ayuda profesional urgente, por favor contacta a los servicios de salud de tu localidad.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ChatInterface
                context="crisis"
                title="Apoyo en Crisis"
                description="Espacio seguro y confidencial. Cuéntame qué está pasando (brevemente) o pide un ejercicio de calma."
                initialMessage="Hola. Siento que estás pasando un momento difícil. Estoy aquí. ¿Quieres que hagamos un ejercicio de respiración o prefieres contarme qué sucedió?"
                placeholder="Ej: Me siento desbordado/a..."
            />
        </div>
    );
};

export default Crisis;
