import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000',
});

// התיקון הסופי: Interceptor שמושך את הטוקן מהזיכרון בכל שניה ושניה
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// אם מקבלים 401 (לא מורשה), מנקים הכל וחוזרים ללוגין בצורה מסודרת
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // רק אם אנחנו לא כבר בדף לוגין, תעביר אותנו לשם
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;