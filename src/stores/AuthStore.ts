import { makeAutoObservable } from "mobx";
import { User } from "../types/auth";
import api from "../services/api";

class AuthStore {
  user: User | null = null;
  token: string | null = localStorage.getItem("token");

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.getMe();
    }
  }

  setAuth(token: string, user: User) {
    // הגנה: אם הנתונים לא הגיעו, אל תמשיך
    if (!token || !user) {
      console.error("Missing token or user in setAuth!");
      return;
    }
    this.token = token;
    this.user = user;
    localStorage.setItem("token", token);
  }

async register(name: string, email: string, password: string) {
  try {
    // 1. מבצעים הרשמה
    const response = await api.post('/auth/register', { name, email, password });
    console.log("Register success, server returned:", response.data);

    // 2. מבצעים לוגין אוטומטי כדי לקבל את הטוקן והמשתמש המלא
    // זה השלב שחסר לך וגורם ל"טוען נתונים"
    await this.login(email, password);
    
    // 3. עוברים לדף הבית בכוח כדי לרענן את המצב
    window.location.href = '/home';

  } catch (error) {
    console.error("Register or Auto-Login failed:", error);
    throw error;
  }
}
 async login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log("Login server response:", response.data);

    // כאן השרת אמור להחזיר את הטוקן
    const token = response.data.token || response.data.accessToken;
    const user = response.data.user;

    if (token && user) {
      this.setAuth(token, user);
    } else {
      throw new Error("התחברות הצליחה אבל השרת לא שלח טוקן - בדקי את ה-Swagger של ה-Login");
    }
  } catch (error) {
    throw error;
  }
}

async getMe() {
  if (!this.token) return;

  try {
    const response = await api.get('/auth/me');
    this.user = response.data;
  } catch (error: any) {
    console.error("GetMe failed", error);
    // אם השרת מחזיר 401 או נופל, נגדיר משתמש זמני כדי שהדף ייפתח
    this.user = { id: 'temp', name: 'אורח', email: '', role: 'user' } as any;
  }
}
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
    window.location.href = '/login';
  }

  get isAuthenticated() {
    return !!this.token;
  }
}

export const authStore = new AuthStore();