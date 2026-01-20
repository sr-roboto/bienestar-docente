
const Placeholder = ({ title }: { title: string }) => (
    <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">Esta funcionalidad estará disponible pronto.</p>
    </div>
);

export const Home = () => <Placeholder title="Inicio" />;
export const Crisis = () => <Placeholder title="Apoyo en Crisis" />;
export const Planning = () => <Placeholder title="Asistente de Planificación" />;
export const Mood = () => <Placeholder title="Monitor de Ánimo" />;
export const Community = () => <Placeholder title="Comunidad" />;
export const Pomodoro = () => <Placeholder title="Recreo Mental" />;
