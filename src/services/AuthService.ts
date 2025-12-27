import api from "./api";

export const AuthService = {
    async login(credentials: any) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    
    async register(userData: any) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async getMe() {
        const response = await api.get('/auth/me');
        return response.data;
    }
};