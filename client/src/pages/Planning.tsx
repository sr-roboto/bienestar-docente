import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { calendarService } from '../services/api';
import ChatInterface from '../components/ChatInterface';

const localizer = momentLocalizer(moment);

const Planning: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);

    const fetchEvents = async () => {
        try {
            const data = await calendarService.getEvents();
            console.log("Fetched events:", data); // Debug log
            const formattedEvents = data.map(e => ({
                title: e.summary,
                start: new Date(e.start),
                end: new Date(e.end),
                resource: e
            }));
            // @ts-ignore
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold text-slate-800">Planificación y Agenda</h1>
            <div className="bg-white p-4 rounded-xl shadow-lg h-[600px]">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día"
                    }}
                />
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">¿Cómo usar?</h3>
                <p className="text-blue-700">Puedes pedirle al Chatbot que agende reuniones por ti. Por ejemplo: "Agenda una reunión mañana a las 10am para revisar calificaciones".</p>
                <p className="text-sm text-blue-600 mt-2">*Requiere haber iniciado sesión con Google y conceder permisos de calendario.</p>
            </div>

            <div className="mt-8">
                <ChatInterface
                    context="planning"
                    title="Asistente de Agenda"
                    description="Estoy aquí para ayudarte a organizar tu tiempo. Pídeme que agende reuniones o consulte tus eventos."
                    onMessageSent={fetchEvents}
                />
            </div>
        </div>
    );
};

export default Planning;
