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
        const response = await axios.post(`${API_URL}/token`, formData);
        return response.data; // { access_token, token_type }
    },
    register: async (username: string, email: string, password: string) => {
        const response = await axios.post(`${API_URL}/register`, { username, email, password });
        return response.data;
    },
    getMe: async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },
    googleLoginUrl: `https://bienestar-server.onrender.com/auth/google`
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
