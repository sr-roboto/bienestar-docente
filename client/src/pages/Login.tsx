import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // @ts-ignore
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authService.login(username, password);
            localStorage.setItem('token', data.access_token);
            navigate(from, { replace: true });
            window.location.reload(); // To trigger app state update if cleaner way not implemented
        } catch (err: any) {
            setError("Credenciales inválidas");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-900">Bienestar Docente</h2>
                <h3 className="text-xl text-center text-slate-600">Iniciar Sesión</h3>

                {error && <div className="p-3 text-red-600 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Usuario o Email</label>
                        <input
                            type="text"
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        Ingresar
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">O continúa con</span>
                    </div>
                </div>

                <a
                    href={authService.googleLoginUrl}
                    className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border rounded-lg hover:bg-slate-50 border-slate-300 text-slate-700"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    <span>Google</span>
                </a>

                <p className="text-sm text-center text-slate-600">
                    ¿No tienes cuenta? <a href="/register" className="text-indigo-600 hover:underline">Regístrate</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
