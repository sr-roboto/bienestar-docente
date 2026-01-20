import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Plus, User } from 'lucide-react';
import { communityService, type CommunityPost } from '../services/api';

const Community: React.FC = () => {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const data = await communityService.getPosts();
            setPosts(data.reverse());
        } catch (error) {
            console.error('Failed to load posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePost = async () => {
        if (!newPostContent.trim()) return;
        setIsPosting(true);
        try {
            await communityService.createPost({
                author: "Tú", // Hardcoded for this demo
                content: newPostContent
            });
            setNewPostContent('');
            loadPosts();
        } catch (error) {
            console.error('Failed to create post', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Maestros que Inspiran</h2>
                <p className="opacity-90">
                    Un espacio seguro para compartir logros, pedir consejos o simplemente desahogarse.
                    Juntos somos más fuertes.
                </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Comparte algo hoy... ¿Un logro? ¿Una frustración? ¿Un tip?"
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={3}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handlePost}
                        disabled={isPosting || !newPostContent.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        {isPosting ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-center text-slate-500 py-8">Cargando comunidad...</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 p-2 rounded-full">
                                    <User className="text-indigo-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">{post.author}</h3>
                                    <p className="text-slate-600 mt-2 leading-relaxed">{post.content}</p>

                                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
                                            <Heart size={18} />
                                            <span className="text-sm">{post.likes} Apoyos</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                                            <MessageSquare size={18} />
                                            <span className="text-sm">Comentar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Community;
