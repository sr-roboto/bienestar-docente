import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.register(username, email, password);
            // Auto login or redirect to login? Redirect for simplicity
            navigate('/login');
        } catch (err: any) {
            setError("Error al registrar. El usuario o email ya existe.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-indigo-900">Crear Cuenta</h2>

                {error && <div className="p-3 text-red-600 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Usuario</label>
                        <input
                            type="text"
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                        <input
                            type="password"
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 font-bold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="text-sm text-center text-slate-600">
                    ¿Ya tienes cuenta? <a href="/login" className="text-indigo-600 hover:underline">Ingresa aquí</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
