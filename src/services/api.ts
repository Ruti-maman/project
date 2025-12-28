import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

// הוספת הטוקן לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// טיפול בשגיאות (בלי לזרוק אותך החוצה באלימות)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expired or invalid - logging out");
      localStorage.removeItem("token");
      // כאן ביטלנו את הריענון האוטומטי כדי למנוע לופים
    }
    return Promise.reject(error);
  }
);

export default api;
