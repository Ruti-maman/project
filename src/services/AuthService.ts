import api from "./api";

// התחברות
export const loginRequest = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', {
        email: credentials.email, 
        password: credentials.password
    });
    return response.data;
};

// הרשמה - התיקון המדויק לפי השגיאה בתמונה
export const registerRequest = async (userData: { email: string; firstName: string; password: string }) => {
    const response = await api.post('/auth/register', {
        email: userData.email,
        name: userData.firstName, // <--- הנה התיקון! השרת ביקש "name", אז נתנו לו "name"
        password: userData.password
    });
    return response.data;
};

// קבלת פרטי משתמש
export const getMeRequest = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};