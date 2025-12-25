import api from './api'; // הייבוא של הקובץ החדש שלך

// פונקציית לוגין - עכשיו היא הרבה יותר קצרה!
export const loginRequest = async (credentials: any) => {
    // שימי לב: משתמשים ב-api במקום ב-axios, והכתובת קצרה יותר
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// פונקציית קבלת פרטי המשתמש
export const getMeRequest = async () => {
    // אין צורך לשלוח headers ידנית! ה-Interceptor ב-api.ts עושה זאת בשבילך
    const response = await api.get('/auth/register');
    return response.data;
};