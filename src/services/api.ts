import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', 
});

// זהו ה-Interceptor שמוודא שהשרת יזהה אותך ויפסיק להחזיר 401
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // אנחנו מוסיפים את ה"מפתח" (הטוקן) לכותרת של כל הודעה
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;