import React, { useEffect, useState } from 'react';
import { authService, type User } from '../services/api';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authService.getMe();
                setUser(data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchUser();
    }, []);

    if (!user) return <div>Cargando perfil...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
                {user.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-indigo-100"
                    />
                ) : (
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 text-3xl font-bold text-indigo-500 bg-indigo-100 rounded-full">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}

                <h2 className="text-2xl font-bold text-slate-800">{user.username}</h2>
                <p className="text-slate-500 mb-6">{user.email}</p>
            </div>
        </div>
    );
};

export default Profile;
