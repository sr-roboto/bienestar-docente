import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Interceptor caught 401: Unauthorized. Redirecting to login.");
            localStorage.removeItem('token');
            // Check if we are not already on login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
}

export interface ChatResponse {
    response: string;
}

export interface CommunityPost {
    id: number;
    author: string;
    content: string;
    likes: number;
    user_id?: number;
}

export interface MoodEntry {
    mood: string;
    note?: string;
    timestamp?: string;
    user_id?: number;
}

export const authService = {
    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await api.post('/token', formData, {
            headers: { 'Content-Type': 'multipart/form-data' } // axios automatically sets boundary but let's be safe or just let axios handle it if we pass formData
            // Actually, for formData in axios, if we pass FormData object, axios handles Content-Type usually.
            // But since 'api' instance has 'application/json' default, we might need to override.
            // However, usually passing FormData overrides it.
            // Let's use the explicit override to be safe or just let it be.
            // We'll trust axios to handle FormData correctly if we don't force JSON.
            // Wait, previous code used axios.post which doesn't have the default json header.
            // Our 'api' instance has default 'Content-Type': 'application/json'.
            // We MUST override it for FormData or unset it.
        });
        return response.data; // { access_token, token_type }
    },
    register: async (username: string, email: string, password: string) => {
        const response = await api.post('/register', { username, email, password });
        return response.data;
    },
    getMe: async () => {
        // No need to manually add header, interceptor handles it
        const res = await api.get('/users/me');
        return res.data;
    },
    googleLoginUrl: BASE_URL ? `${BASE_URL}/auth/google` : '/auth/google'
};

export const chatService = {
    sendMessage: async (message: string, context: string = 'general') => {
        const response = await api.post<ChatResponse>('/chat', { message, context });
        return response.data;
    },
};

export const communityService = {
    getPosts: async () => {
        const response = await api.get<CommunityPost[]>('/community');
        return response.data;
    },
    createPost: async (post: { content: string; author?: string }) => {
        const response = await api.post<CommunityPost>('/community', post);
        return response.data;
    }
}

export interface CalendarEvent {
    id: string;
    summary: string;
    start: string;
    end: string;
    link?: string;
}

export const calendarService = {
    getEvents: async () => {
        const response = await api.get<CalendarEvent[]>('/calendar');
        return response.data;
    }
}

export const moodService = {
    logMood: async (mood: string, note?: string) => {
        const response = await api.post<MoodEntry>('/mood', { mood, note });
        return response.data;
    },
    getHistory: async () => {
        const response = await api.get<MoodEntry[]>('/mood');
        return response.data;
    }
}
