import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001',
});